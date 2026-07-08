import { z } from "zod";
import { RESUME_SECTION_SETTINGS, SCHEMA_VERSION, SECTION_LABELS } from "@/constants/resume";
import { isValidHttpUrl, trimText } from "@/lib/resume/format";

const optionalText = (max = 2000) => z.string().max(max);
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

const sectionKeySchema = z.enum([
  "summary",
  "education",
  "experience",
  "projects",
  "skills",
  "certifications",
  "activities"
]);

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
      startDate: optionalText(40),
      endDate: optionalText(40),
      details: z.array(bulletSchema(idSchema)),
      hidden: z.boolean()
    })
    .strict();
}

function experienceSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      company: optionalText(180),
      position: optionalText(180),
      location: optionalText(120),
      startDate: optionalText(40),
      endDate: optionalText(40),
      isCurrent: z.boolean(),
      bullets: z.array(bulletSchema(idSchema)),
      hidden: z.boolean()
    })
    .strict();
}

function projectSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      name: optionalText(180),
      role: optionalText(180),
      startDate: optionalText(40),
      endDate: optionalText(40),
      description: optionalText(1000),
      links: z.array(linkSchema(idSchema)),
      bullets: z.array(bulletSchema(idSchema)),
      hidden: z.boolean()
    })
    .strict();
}

function skillGroupSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      label: optionalText(120),
      values: z.array(optionalText(120).refine((value) => !value || trimText(value).length > 0)),
      hidden: z.boolean()
    })
    .strict();
}

function certificationSchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      name: optionalText(180),
      issuer: optionalText(180),
      year: optionalText(40),
      credentialUrl: urlSchema,
      hidden: z.boolean()
    })
    .strict();
}

function activitySchema<T extends z.ZodType>(idSchema: T) {
  return z
    .object({
      id: idSchema,
      role: optionalText(180),
      organization: optionalText(180),
      year: optionalText(40),
      bullets: z.array(bulletSchema(idSchema)),
      hidden: z.boolean()
    })
    .strict();
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
    phone: optionalText(80),
    location: optionalText(120),
    website: urlSchema,
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
