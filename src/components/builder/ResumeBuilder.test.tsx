import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ResumeBuilder } from "./ResumeBuilder";

describe("ResumeBuilder browser workflows", () => {
  it("shows the no-autosave privacy status", () => {
    render(<ResumeBuilder />);

    expect(screen.getByText(/No autosave is active/i)).toBeInTheDocument();
  });

  it("keeps edits on the current page", () => {
    render(<ResumeBuilder />);

    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Example Candidate" } });

    expect(screen.getByLabelText("Full name")).toHaveValue("Example Candidate");
  });

  it("resets after confirmation", async () => {
    render(<ResumeBuilder />);
    const nameInput = screen.getByLabelText("Full name");
    fireEvent.change(nameInput, { target: { value: "Example Candidate" } });

    fireEvent.click(screen.getByRole("button", { name: "Reset Resume" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(nameInput).toHaveValue("");
    });
  });
});
