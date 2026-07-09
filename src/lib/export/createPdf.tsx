import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  pdf
} from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { ResumeData, SectionKey } from "@/types/resume";
import { getPersonalContactItems, getResumeLinkDisplayItems } from "@/lib/resume/displayLinks";
import { formatDateRange, getOrderedSections, hasText, joinNonEmpty } from "@/lib/resume/format";
import { normalizeResumeData } from "@/lib/resume/normalizers";

const styles = StyleSheet.create({
  page: { paddingTop: 42, paddingBottom: 42, paddingHorizontal: 48, fontFamily: "Helvetica", fontSize: 10, color: "#111827" },
  header: { textAlign: "center", marginBottom: 10 },
  name: { fontSize: 18, fontWeight: 700, textTransform: "uppercase" },
  headline: { fontSize: 11, fontWeight: 700, marginTop: 2 },
  contact: { fontSize: 9.5, marginTop: 4, lineHeight: 1.25 },
  section: { marginTop: 9 },
  sectionTitle: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", borderBottomWidth: 1, borderBottomColor: "#111827", paddingBottom: 2, marginBottom: 5 },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  entryLeft: { flex: 1 },
  entryPrimary: { fontWeight: 700 },
  entrySubline: { lineHeight: 1.2, marginTop: 1 },
  date: { minWidth: 88, textAlign: "right" },
  paragraph: { lineHeight: 1.25 },
  bulletRow: { flexDirection: "row", gap: 5, marginTop: 2, paddingLeft: 10 },
  bulletText: { flex: 1, lineHeight: 1.2 },
  projectLinks: { marginTop: 2 },
  skillRow: { flexDirection: "row", gap: 10, marginBottom: 3 },
  skillLabel: { width: 96, fontWeight: 700 },
  skillValues: { flex: 1 },
  link: { color: "#1d4ed8", textDecoration: "underline" }
});

export async function createResumePdfBlob(data: ResumeData): Promise<Blob> {
  return pdf(<ResumePdfDocument data={normalizeResumeData(data)} />).toBlob();
}

function ResumePdfDocument({ data }: { data: ResumeData }): ReactElement {
  return (
    <Document title="ATS Resume">
      <Page size="A4" style={styles.page} wrap>
        <Header data={data} />
        {getOrderedSections(data).map((section) =>
          section.visible && sectionHasContent(data, section.key) ? (
            <Section key={section.key} title={section.title}>
              {renderSection(data, section.key)}
            </Section>
          ) : null
        )}
      </Page>
    </Document>
  );
}

function Header({ data }: { data: ResumeData }) {
  const contacts = getPersonalContactItems(data.personal);

  return (
    <View style={styles.header}>
      {data.personal.fullName ? <Text style={styles.name}>{data.personal.fullName}</Text> : null}
      {data.personal.headline ? <Text style={styles.headline}>{data.personal.headline}</Text> : null}
      {contacts.length > 0 ? (
        <Text style={styles.contact}>
          {contacts.map((item, index) => (
            <Text key={item.id}>
              {index > 0 ? " | " : ""}
              {item.kind === "link" ? (
                <Link src={item.href} style={styles.link}>
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </Text>
          ))}
        </Text>
      ) : null}
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactElement | ReactElement[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function EntryHeader({ left, subline, date }: { left: string; subline?: string; date?: string }) {
  return (
    <View style={styles.entryHeader}>
      <View style={styles.entryLeft}>
        {left ? <Text style={styles.entryPrimary}>{left}</Text> : null}
        {subline ? <Text style={styles.entrySubline}>{subline}</Text> : null}
      </View>
      {date ? <Text style={styles.date}>{date}</Text> : null}
    </View>
  );
}

function Bullets({ bullets }: { bullets: Array<{ id: string; text: string }> }) {
  return bullets.map((bullet) => (
    <View key={bullet.id} style={styles.bulletRow}>
      <Text>-</Text>
      <Text style={styles.bulletText}>{bullet.text}</Text>
    </View>
  ));
}

function renderSection(data: ResumeData, key: SectionKey): ReactElement | ReactElement[] {
  if (key === "summary") return <Text style={styles.paragraph}>{data.summary}</Text>;
  if (key === "education") {
    return data.education.filter((item) => !item.hidden).map((item) => (
      <View key={item.id} wrap={false}>
        <EntryHeader
          date={formatDateRange(item.startDate, item.endDate)}
          left={item.qualification}
          subline={joinNonEmpty([item.institution, item.location], ", ")}
        />
        <Bullets bullets={item.details} />
      </View>
    ));
  }
  if (key === "experience") {
    return data.experience.filter((item) => !item.hidden).map((item) => (
      <View key={item.id} wrap={false}>
        <EntryHeader
          date={formatDateRange(item.startDate, item.endDate, item.isCurrent)}
          left={item.position}
          subline={joinNonEmpty([item.company, item.location], ", ")}
        />
        <Bullets bullets={item.bullets} />
      </View>
    ));
  }
  if (key === "projects") {
    return data.projects.filter((item) => !item.hidden).map((item) => {
      const links = getResumeLinkDisplayItems(item.links);

      return (
        <View key={item.id} wrap={false}>
          <EntryHeader date={formatDateRange(item.startDate, item.endDate)} left={joinNonEmpty([item.name, item.role], ", ")} />
          {item.description ? <Text style={styles.paragraph}>{item.description}</Text> : null}
          {links.length > 0 ? (
            <Text style={styles.projectLinks}>
              {links.map((link, index) => (
                <Text key={link.id}>
                  {index > 0 ? " | " : ""}
                  {link.kind === "link" ? (
                    <Link src={link.href} style={styles.link}>
                      {link.label}
                    </Link>
                  ) : (
                    link.label
                  )}
                </Text>
              ))}
            </Text>
          ) : null}
          <Bullets bullets={item.bullets} />
        </View>
      );
    });
  }
  if (key === "skills") {
    return data.skillGroups.filter((group) => !group.hidden).map((group) => (
      <View key={group.id} style={styles.skillRow}>
        <Text style={styles.skillLabel}>{group.label}:</Text>
        <Text style={styles.skillValues}>{joinNonEmpty(group.values, ", ")}</Text>
      </View>
    ));
  }
  if (key === "certifications") {
    return data.certifications.filter((item) => !item.hidden).map((item) => (
      <View key={item.id}>
        <EntryHeader date={item.year} left={joinNonEmpty([item.name, item.issuer], ", ")} />
        {item.credentialUrl ? <Link src={item.credentialUrl} style={styles.link}>{item.credentialUrl}</Link> : null}
      </View>
    ));
  }
  return data.activities.filter((item) => !item.hidden).map((item) => (
    <View key={item.id} wrap={false}>
      <EntryHeader date={item.year} left={joinNonEmpty([item.role, item.organization], ", ")} />
      <Bullets bullets={item.bullets} />
    </View>
  ));
}

function sectionHasContent(data: ResumeData, key: SectionKey): boolean {
  if (key === "summary") return hasText(data.summary);
  if (key === "education") return data.education.some((item) => !item.hidden && (hasText(item.institution) || hasText(item.qualification) || item.details.length > 0));
  if (key === "experience") return data.experience.some((item) => !item.hidden && (hasText(item.company) || hasText(item.position) || item.bullets.length > 0));
  if (key === "projects") return data.projects.some((item) => !item.hidden && (hasText(item.name) || hasText(item.description) || item.bullets.length > 0));
  if (key === "skills") return data.skillGroups.some((group) => !group.hidden && hasText(group.label) && group.values.length > 0);
  if (key === "certifications") return data.certifications.some((item) => !item.hidden && hasText(item.name));
  return data.activities.some((item) => !item.hidden && (hasText(item.role) || hasText(item.organization) || item.bullets.length > 0));
}
