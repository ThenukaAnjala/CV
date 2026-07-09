import { describe, expect, it } from "vitest";
import { fromMonthInputValue, toMonthInputValue } from "./MonthYearInput";

describe("MonthYearInput date conversion", () => {
  it("converts browser month values to resume date labels", () => {
    expect(fromMonthInputValue("2026-07")).toBe("Jul 2026");
    expect(fromMonthInputValue("2025-01")).toBe("Jan 2025");
  });

  it("converts resume date labels to browser month values", () => {
    expect(toMonthInputValue("Jul 2026")).toBe("2026-07");
    expect(toMonthInputValue("September 2025")).toBe("2025-09");
  });

  it("handles old year-only values and invalid values predictably", () => {
    expect(toMonthInputValue("2025")).toBe("2025-01");
    expect(toMonthInputValue("not a date")).toBe("");
    expect(fromMonthInputValue("2026-13")).toBe("");
  });
});
