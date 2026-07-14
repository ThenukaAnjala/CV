import { fireEvent, render, screen } from "@testing-library/react";
import { PreviewControls } from "./PreviewControls";

describe("PreviewControls", () => {
  it("lets desktop users choose a common resume paper size", () => {
    const onPaperSizeChange = vi.fn();

    render(
      <PreviewControls
        displayMode="document"
        onBoundaryChange={vi.fn()}
        onPageChange={vi.fn()}
        onPaperSizeChange={onPaperSizeChange}
        onZoomChange={vi.fn()}
        page={1}
        pageCount={2}
        paperSize="a4"
        showBoundary
        zoom="fit"
      />
    );

    const paperSelect = screen.getByLabelText("Paper size");

    expect(screen.getByRole("option", { name: "A4 (210 x 297 mm)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "US Letter (8.5 x 11 in)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "US Legal (8.5 x 14 in)" })).toBeInTheDocument();

    fireEvent.change(paperSelect, { target: { value: "letter" } });

    expect(onPaperSizeChange).toHaveBeenCalledWith("letter");
  });
});
