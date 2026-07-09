const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const FULL_MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

function getMonthIndex(label: string): number {
  const normalized = label.trim().toLowerCase();
  return MONTH_LABELS.findIndex(
    (month, index) => month.toLowerCase() === normalized || FULL_MONTH_LABELS[index].toLowerCase() === normalized
  );
}

export function fromMonthInputValue(value: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return "";

  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex >= MONTH_LABELS.length) return "";

  return `${MONTH_LABELS[monthIndex]} ${match[1]}`;
}

export function toMonthInputValue(value: string): string {
  const trimmed = value.trim();
  const inputMatch = /^(\d{4})-(\d{2})$/.exec(trimmed);
  if (inputMatch) return trimmed;

  const yearOnlyMatch = /^(\d{4})$/.exec(trimmed);
  if (yearOnlyMatch) return `${yearOnlyMatch[1]}-01`;

  const labelMatch = /^([A-Za-z]{3,9})\s+(\d{4})$/.exec(trimmed);
  if (!labelMatch) return "";

  const monthIndex = getMonthIndex(labelMatch[1]);
  if (monthIndex === -1) return "";

  return `${labelMatch[2]}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function isValidMonthYearValue(value: string): boolean {
  const trimmed = value.trim();
  return !trimmed || toMonthInputValue(trimmed) !== "";
}

export function compareMonthYearValues(left: string, right: string): number | null {
  const leftValue = toMonthInputValue(left);
  const rightValue = toMonthInputValue(right);

  if (!leftValue || !rightValue) return null;
  return leftValue.localeCompare(rightValue);
}
