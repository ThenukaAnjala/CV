import type { PersonalInfo } from "@/types/resume";
import { getPersonalContactItems } from "@/lib/resume/displayLinks";

export function ResumeHeader({ personal }: { personal: PersonalInfo }) {
  const contacts = getPersonalContactItems(personal);

  return (
    <header className="text-center">
      {personal.fullName ? (
        <h1 className="break-words text-[18pt] font-bold uppercase leading-tight">{personal.fullName}</h1>
      ) : null}
      {personal.headline ? <p className="mt-0.5 break-words text-[11pt] font-semibold">{personal.headline}</p> : null}
      {contacts.length > 0 ? (
        <p className="mt-1 break-words text-[9.5pt] leading-snug">
          {contacts.map((item, index) => (
            <span key={item.id}>
              {index > 0 ? " | " : null}
              {item.kind === "link" ? (
                <a className="text-blue-700 underline" href={item.href} rel="noreferrer" target="_blank">
                  {item.label}
                </a>
              ) : (
                item.label
              )}
            </span>
          ))}
        </p>
      ) : null}
    </header>
  );
}
