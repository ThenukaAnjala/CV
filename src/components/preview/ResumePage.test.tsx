import { render, screen } from "@testing-library/react";
import { ResumePage } from "./ResumePage";
import { createCompleteResume } from "@/test/resumeFactory";

describe("ResumePage", () => {
  it("renders education institution and location on the second line", () => {
    render(<ResumePage data={createCompleteResume()} />);

    expect(screen.getByText("Bachelor of Science in Computing")).toBeInTheDocument();
    expect(screen.getByText("Example University, Example City")).toBeInTheDocument();
  });

  it("renders experience company and location on the second line", () => {
    render(<ResumePage data={createCompleteResume()} />);

    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Example Software Company, Example City")).toBeInTheDocument();
  });

  it("renders skill labels on the left and values on the right", () => {
    render(<ResumePage data={createCompleteResume()} />);

    const label = screen.getByText("Core Skills:");
    const values = screen.getByText("TypeScript, React, Next.js");
    const row = label.parentElement;

    if (!row) throw new Error("Missing skills row");

    expect(row).toHaveClass("justify-between");
    expect(values).toHaveClass("text-right");
  });

  it("renders certification links by label without showing the URL", () => {
    render(<ResumePage data={createCompleteResume()} />);

    const link = screen.getByRole("link", { name: "Credential" });

    expect(link).toHaveAttribute("href", "https://certificate.example.com");
    expect(screen.queryByText("https://certificate.example.com")).not.toBeInTheDocument();
  });

  it("uses the selected paper dimensions for desktop preview", () => {
    const { container } = render(<ResumePage data={createCompleteResume()} paperSizeKey="letter" />);
    const page = container.querySelector("article");

    if (!page) throw new Error("Missing resume page");

    expect(page).toHaveStyle({ minHeight: "279.4mm", width: "215.9mm" });
  });

  it("flows document content into paginated paper columns", () => {
    const { container } = render(
      <ResumePage data={createCompleteResume()} page={2} paginated paperSizeKey="legal" />
    );
    const page = container.querySelector("article");
    const flow = page?.firstElementChild;

    if (!(flow instanceof HTMLElement)) throw new Error("Missing paginated content flow");

    expect(page).toHaveStyle({ height: "355.6mm", width: "215.9mm" });
    expect(flow).toHaveStyle({
      columnGap: "18mm",
      columnWidth: "181.9mm",
      height: "325.6mm",
      transform: "translateX(-199.9mm)"
    });
  });
});
