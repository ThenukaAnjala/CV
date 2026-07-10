import { render, screen } from "@testing-library/react";
import { EntryHeader } from "./EntryHeader";

describe("EntryHeader", () => {
  it("keeps single-date entries aligned to the right edge", () => {
    render(<EntryHeader date="Feb 2026" primary="" />);

    const date = screen.getByText("Feb 2026");
    const row = date.parentElement;

    if (!row) throw new Error("Missing entry header row");

    expect(row).toHaveClass("grid-cols-[minmax(0,1fr)_auto]");
    expect(date).toHaveClass("justify-self-end");
    expect(date).toHaveClass("text-right");
    expect(date).toHaveClass("whitespace-nowrap");
  });
});
