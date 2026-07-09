import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows validation messages for invalid personal information", async () => {
    render(<ResumeBuilder />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "not-an-email" } });

    expect(await screen.findByText("Enter a valid email address.")).toBeInTheDocument();
  });

  it("keeps repeated-section field focus while typing", async () => {
    const user = userEvent.setup();
    render(<ResumeBuilder />);

    await user.click(screen.getByRole("button", { name: "Education" }));
    await user.click(screen.getByRole("button", { name: "Add education" }));
    await user.type(screen.getByLabelText("Institution"), "MIT");

    expect(screen.getByLabelText("Institution")).toHaveValue("MIT");
    expect(screen.getByLabelText("Institution")).toHaveFocus();
  });

  it("uses month and year pickers for resume dates", async () => {
    const user = userEvent.setup();
    render(<ResumeBuilder />);

    await user.click(screen.getByRole("button", { name: "Education" }));
    await user.click(screen.getByRole("button", { name: "Add education" }));

    const startDate = screen.getByLabelText("Start date");
    fireEvent.change(startDate, { target: { value: "2026-07" } });

    expect(startDate).toHaveAttribute("type", "month");
    expect(startDate).toHaveValue("2026-07");
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
