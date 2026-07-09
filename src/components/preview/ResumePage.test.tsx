import { render, screen } from "@testing-library/react";
import { ResumePage } from "./ResumePage";
import { createCompleteResume } from "@/test/resumeFactory";

describe("ResumePage", () => {
  it("renders education institution and location on the second line", () => {
    render(<ResumePage data={createCompleteResume()} />);

    expect(screen.getByText("Bachelor of Science in Computing")).toBeInTheDocument();
    expect(screen.getByText("Example University, Example City")).toBeInTheDocument();
  });
});
