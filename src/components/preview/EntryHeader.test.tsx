import { render, screen } from "@testing-library/react";
import { EntryHeader } from "./EntryHeader";

describe("EntryHeader", () => {
  it("keeps single-date entries aligned to the right edge", () => {
    render(<EntryHeader date="Feb 2026" primary="" />);

    const date = screen.getByText("Feb 2026");
    const row = date.parentElement;

    if (!row) throw new Error("Missing entry header row");

    expect(row).toHaveClass("flex");
    expect(row).toHaveClass("w-full");
    expect(date).toHaveClass("ml-auto");
    expect(date).toHaveClass("shrink-0");
    expect(date).toHaveClass("text-right");
    expect(date).toHaveClass("whitespace-nowrap");
    expect(date.className).not.toContain("min-w");
  });

  it("keeps long entry text out of the natural-width date column", () => {
    render(
      <EntryHeader
        date="Jun 2026"
        primary="Project Name With A Very Long Title"
        secondary="Software Engineer"
      />
    );

    const date = screen.getByText("Jun 2026");
    const left = screen.getByText("Project Name With A Very Long Title, Software Engineer").closest("div");

    if (!left) throw new Error("Missing entry header content");

    expect(left).toHaveClass("min-w-0");
    expect(left).toHaveClass("flex-1");
    expect(left).toHaveClass("pr-4");
    expect(date).toHaveClass("shrink-0");
    expect(date.className).not.toContain("min-w");
  });
});
