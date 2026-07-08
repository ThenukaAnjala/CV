import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ResumeBuilder } from "./ResumeBuilder";
import { APP_DEVELOPER } from "@/constants/app";

describe("ResumeBuilder browser workflows", () => {
  it("shows the no-autosave privacy status", () => {
    render(<ResumeBuilder />);

    expect(screen.getByText(/No autosave is active/i)).toBeInTheDocument();
  });

  it("shows the public developer attribution", () => {
    render(<ResumeBuilder />);

    expect(screen.getByText(new RegExp(APP_DEVELOPER.name, "i"))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: APP_DEVELOPER.email })).toHaveAttribute(
      "href",
      `mailto:${APP_DEVELOPER.email}`
    );
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
