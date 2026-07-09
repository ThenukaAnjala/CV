import { z } from "zod";
import { RESUME_SECTION_SETTINGS, SCHEMA_VERSION, SECTION_LABELS } from "@/constants/resume";
import { compareMonthYearValues, isValidMonthYearValue } from "@/lib/resume/dateValues";
import { isValidHttpUrl, trimText } from "@/lib/resume/format";

const optionalText = (max = 2000) =>
  z
    .string()
    .max(max, `Use ${max} characters or fewer.`)
    .refine((value) => !value || trimText(value).length > 0, "This field cannot contain only spaces.");
const requiredId = z.string().min(1);
const optionalId = z.string().optional();

const emailSchema = optionalText(200).refine(
  (value) => !trimText(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimText(value)),
  "Enter a valid email address."
);

const urlSchema = optionalText(1000).refine(
  (value) => isValidHttpUrl(value),
  "Enter a valid http or https URL."
);

const phoneSchema = optionalText(80).refine(
  (value) => !trimText(value) || /^[+()0-9\s.-]{5,80}$/.test(trimText(value)),
  "Enter a valid phone number."
);

const monthYearSchema = optionalText(40).refine(
  (value) => isValidMonthYearValue(value),
  "Use month and year, for example Jan 2025."
);

const sectionKeySchema = z.enum([
  "summary",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "activities"
]);

type IssuePath = Array<string | number>;

function hasValue(value: string): boolean {
  return trimText(value).length > 0;
}

function hasBulletContent(bullets: readonly { text: string }[]): boolean {
  return bullets.some((bullet) => hasValue(bullet.text));
}

function hasLinkContent(links: readonly { label: string; url: string }[]): boolean {
  return links.some((link) => hasValue(link.label) || hasValue(link.url));
}

function hasSkillValues(values: readonly string[]): boolean {
  return values.some(hasValue);
}

function addIssue(context: z.RefinementCtx, path: IssuePath, message: string): void {
  context.addIssue({ code: "custom", path, message });
}

function requireWhenStarted(
  context: z.RefinementCtx,
  started: boolean,
  path: IssuePath,
  value: string,
  message: string
): void {
  if (started && !hasValue(value)) addIssue(context, path, message);
}

function validateDateRange(context: z.RefinementCtx, startDate: string, endDate: string): void {
  const order = compareMonthYearValues(startDate, endDate);
  if (order !== null && order > 0) {
    addIssue(context, ["endDate"], "End date must be the same as or after the start date.");
  }
}

function linkSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      label: optionalText(120),
      url: urlSchema
    })
    .strict()
    .superRefine((link, context) => {
      if (trimText(link.url) && !trimText(link.label)) {
        context.addIssue({ code: "custom", path: ["label"], message: "Add a label for this link." });
      }
      if (trimText(link.label) && !trimText(link.url)) {
        context.addIssue({ code: "custom", path: ["url"], message: "Add a URL for this link." });
      }
    });
}

function bulletSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      text: optionalText(800).refine((value) => !value || trimText(value).length > 0, {
        message: "Bullet text cannot contain only spaces."
      })
    })
    .strict();
}

function educationSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      institution: optionalText(180),
      qualification: optionalText(180),
      location: optionalText(120),
      startDate: monthYearSchema,
      endDate: monthYearSchema,
      details: z.array(bulletSchema(idSchema)),
      hidden: z.boolean()
    })
    .strict()
    .superRefine((entry, context) => {
      const started =
        hasBulletContent(entry.details) ||
        [entry.institution, entry.qualification, entry.location, entry.startDate, entry.endDate].some(hasValue);

      requireWhenStarted(context, started, ["qualification"], entry.qualification, "Add a qualification for this education entry.");
      requireWhenStarted(context, started, ["institution"], entry.institution, "Add an institution for this education entry.");
      validateDateRange(context, entry.startDate, entry.endDate);
    });
}

function experienceSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      company: optionalText(180),
      position: optionalText(180),
      location: optionalText(120),
      startDate: monthYearSchema,
      endDate: monthYearSchema,
      isCurrent: z.boolean(),
      bullets: z.array(bulletSchema(idSchema)),
      hidden: z.boolean()
    })
    .strict()
    .superRefine((entry, context) => {
      const started =
        hasBulletContent(entry.bullets) ||
        [entry.company, entry.position, entry.location, entry.startDate, entry.endDate].some(hasValue);

      requireWhenStarted(context, started, ["position"], entry.position, "Add a position for this experience entry.");
      requireWhenStarted(context, started, ["company"], entry.company, "Add a company for this experience entry.");
      if (!entry.isCurrent) validateDateRange(context, entry.startDate, entry.endDate);
    });
}

function projectSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      name: optionalText(180),
      role: optionalText(180),
      startDate: monthYearSchema,
      endDate: monthYearSchema,
      description: optionalText(1000),
      links: z.array(linkSchema(idSchema)),
      bullets: z.array(bulletSchema(idSchema)),
      hidden: z.boolean()
    })
    .strict()
    .superRefine((entry, context) => {
      const started =
        hasBulletContent(entry.bullets) ||
        hasLinkContent(entry.links) ||
        [entry.name, entry.role, entry.startDate, entry.endDate, entry.description].some(hasValue);

      requireWhenStarted(context, started, ["name"], entry.name, "Add a project name for this project entry.");
      validateDateRange(context, entry.startDate, entry.endDate);
    });
}

function skillGroupSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      label: optionalText(120),
      values: z.array(optionalText(120)),
      hidden: z.boolean()
    })
    .strict()
    .superRefine((group, context) => {
      const started = hasValue(group.label) || hasSkillValues(group.values);

      requireWhenStarted(context, started, ["label"], group.label, "Add a label for this skill group.");
      if (started && !hasSkillValues(group.values)) {
        addIssue(context, ["values", 0], "Add at least one skill in this group.");
      }
    });
}

function certificationSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      name: optionalText(180),
      issuer: optionalText(180),
      year: monthYearSchema,
      credentialUrl: urlSchema,
      hidden: z.boolean()
    })
    .strict()
    .superRefine((entry, context) => {
      const started = [entry.name, entry.issuer, entry.year, entry.credentialUrl].some(hasValue);

      requireWhenStarted(context, started, ["name"], entry.name, "Add a certification name.");
      requireWhenStarted(context, started, ["issuer"], entry.issuer, "Add the certification issuer.");
    });
}

function activitySchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      role: optionalText(180),
      organization: optionalText(180),
      year: monthYearSchema,
      bullets: z.array(bulletSchema(idSchema)),
      hidden: z.boolean()
    })
    .strict()
    .superRefine((entry, context) => {
      const started = hasBulletContent(entry.bullets) || [entry.role, entry.organization, entry.year].some(hasValue);

      requireWhenStarted(context, started, ["role"], entry.role, "Add a role for this activity.");
      requireWhenStarted(context, started, ["organization"], entry.organization, "Add an organization for this activity.");
    });
}

const sectionSettingSchema = z
  .object({
    key: sectionKeySchema,
    title: optionalText(80),
    visible: z.boolean()
  })
  .strict();

const personalSchema = z
  .object({
    fullName: optionalText(160),
    headline: optionalText(180),
    email: emailSchema,
    phone: phoneSchema,
    location: optionalText(120),
    website: optionalText(1000),
    links: z.array(linkSchema(requiredId))
  })
  .strict();

const personalImportSchema = personalSchema.extend({
  links: z.array(linkSchema(optionalId)).optional().default([])
});

export const resumeDataSchema = z
  .object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    personal: personalSchema,
    summary: optionalText(1600),
    education: z.array(educationSchema(requiredId)),
    experience: z.array(experienceSchema(requiredId)),
    projects: z.array(projectSchema(requiredId)),
    skillGroups: z.array(skillGroupSchema(requiredId)),
    certifications: z.array(certificationSchema(requiredId)),
    activities: z.array(activitySchema(requiredId)),
    sectionSettings: z.array(sectionSettingSchema).min(RESUME_SECTION_SETTINGS.length),
    updatedAt: optionalText(80)
  })
  .strict()
  .superRefine((data, context) => {
    const keys = new Set(data.sectionSettings.map((section) => section.key));
    for (const key of Object.keys(SECTION_LABELS)) {
      if (!keys.has(key as keyof typeof SECTION_LABELS)) {
        context.addIssue({
          code: "custom",
          path: ["sectionSettings"],
          message: `Missing section setting for ${key}.`
        });
      }
    }
  });

export const resumeImportSchema = z
  .object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    personal: personalImportSchema.optional(),
    summary: optionalText(1600).optional(),
    education: z.array(educationSchema(optionalId)).optional(),
    experience: z.array(experienceSchema(optionalId)).optional(),
    projects: z.array(projectSchema(optionalId)).optional(),
    skillGroups: z.array(skillGroupSchema(optionalId)).optional(),
    certifications: z.array(certificationSchema(optionalId)).optional(),
    activities: z.array(activitySchema(optionalId)).optional(),
    sectionSettings: z.array(sectionSettingSchema).optional(),
    updatedAt: optionalText(80).optional()
  })
  .strict();

export type ResumeImportInput = z.infer<typeof resumeImportSchema>;
