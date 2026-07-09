import type { ResumeData } from "@/types/resume";
import { createBlankResumeData } from "@/lib/resume/defaults";

export function createCompleteResume(): ResumeData {
  return {
    ...createBlankResumeData(),
    personal: {
      fullName: "Example Candidate",
      headline: "Software Engineer",
      email: "candidate@example.com",
      phone: "+1 555 0100",
      location: "Example City",
      website: "",
      links: [{ id: "link-1", label: "Portfolio", url: "https://portfolio.example.com" }]
    },
    summary:
      "Software engineer with experience building accessible web applications, improving internal tools, collaborating with product teams, and maintaining reliable TypeScript services. Focused on clear communication, careful testing, measurable delivery, and practical engineering decisions across frontend and backend systems.",
    education: [
      {
        id: "education-1",
        institution: "Example University",
        qualification: "Bachelor of Science in Computing",
        location: "Example City",
        startDate: "Jan 2021",
        endDate: "Dec 2024",
        details: [],
        hidden: false
      }
    ],
    experience: [
      {
        id: "experience-1",
        company: "Example Software Company",
        position: "Frontend Engineer",
        location: "Example City",
        startDate: "Jan 2025",
        endDate: "",
        isCurrent: true,
        bullets: [
          { id: "bullet-1", text: "Improved form completion by 18% by simplifying validation states and reducing unnecessary steps." },
          { id: "bullet-2", text: "Built reusable TypeScript components used by three internal product teams." }
        ],
        hidden: false
      }
    ],
    projects: [
      {
        id: "project-1",
        name: "Example Analytics Project",
        role: "Developer",
        startDate: "Feb 2025",
        endDate: "Apr 2025",
        description: "Built a local dashboard for comparing operational data.",
        links: [{ id: "project-link-1", label: "Demo", url: "https://project.example.com" }],
        bullets: [{ id: "project-bullet-1", text: "Created data filters that reduced manual review time by 25%." }],
        hidden: false
      }
    ],
    skillGroups: [
      { id: "skill-1", label: "Core Skills", values: ["TypeScript", "React", "Next.js"], hidden: false },
      { id: "skill-2", label: "Tools", values: ["Vitest", "Git"], hidden: false }
    ],
    certifications: [
      {
        id: "certification-1",
        name: "Example Web Certificate",
        issuer: "Example Issuer",
        year: "2025",
        links: [{ id: "certification-link-1", label: "Credential", url: "https://certificate.example.com" }],
        hidden: false
      }
    ],
    activities: [
      {
        id: "activity-1",
        role: "Team Lead",
        organization: "Example Club",
        year: "2025",
        bullets: [{ id: "activity-bullet-1", text: "Coordinated a five-person team for a community workshop." }],
        hidden: false
      }
    ]
  };
}
