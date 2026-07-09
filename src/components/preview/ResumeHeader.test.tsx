import { render, screen } from "@testing-library/react";
import { ResumeHeader } from "./ResumeHeader";
import type { PersonalInfo } from "@/types/resume";

function createPersonalInfo(overrides: Partial<PersonalInfo> = {}): PersonalInfo {
  return {
    fullName: "Example Candidate",
    headline: "Software Engineer",
    email: "candidate@example.com",
    phone: "+1 555 0100",
    location: "Example City",
    website: "https://example.com",
    links: [],
    ...overrides
  };
}

describe("ResumeHeader", () => {
  it("renders personal links by label without showing the URL as visible text", () => {
    render(
      <ResumeHeader
        personal={createPersonalInfo({
          links: [{ id: "link-1", label: "LinkedIn", url: "https://network.example.com/profile" }]
        })}
      />
    );

    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      "https://network.example.com/profile"
    );
    expect(screen.queryByText(/network\.example\.com/i)).not.toBeInTheDocument();
  });

  it("keeps invalid draft link URLs out of visible resume text", () => {
    render(
      <ResumeHeader
        personal={createPersonalInfo({
          email: "",
          phone: "",
          location: "",
          website: "",
          links: [{ id: "link-1", label: "LinkedIn", url: "not-a-url" }]
        })}
      />
    );

    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "LinkedIn" })).not.toBeInTheDocument();
    expect(screen.queryByText("not-a-url")).not.toBeInTheDocument();
  });
});
