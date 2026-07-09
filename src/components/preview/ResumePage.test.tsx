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
});
