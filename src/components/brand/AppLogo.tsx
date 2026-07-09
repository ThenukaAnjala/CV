import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" {...props}>
      <rect fill="#020617" height="64" rx="14" width="64" />
      <path
        d="M20 13h18.5L49 23.5V49c0 2.76-2.24 5-5 5H20c-2.76 0-5-2.24-5-5V18c0-2.76 2.24-5 5-5Z"
        fill="#f8fafc"
      />
      <path d="M38 13v11c0 1.1.9 2 2 2h9" fill="#dbeafe" />
      <path d="M22.5 31.5h14" stroke="#0369a1" strokeLinecap="round" strokeWidth="3" />
      <path d="M22.5 38.5h8" stroke="#0369a1" strokeLinecap="round" strokeWidth="3" />
      <path
        d="M26 47c6.5-9.5 14.5-9.5 21 0"
        fill="none"
        stroke="#0f766e"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
      <path
        d="m42 39 4.25 4.25L54 35.5"
        fill="none"
        stroke="#38bdf8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.4"
      />
      <circle cx="22" cy="47" fill="#38bdf8" r="3.2" />
      <circle cx="48.5" cy="47" fill="#0f766e" r="3.2" />
    </svg>
  );
}
