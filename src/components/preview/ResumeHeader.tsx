import type { PersonalInfo } from "@/types/resume";

export function ResumeHeader({ personal }: { personal: PersonalInfo }) {
  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    ...personal.links.map((link) => `${link.label}: ${link.url}`)
  ].filter(Boolean);

  return (
    <header className="text-center">
      {personal.fullName ? (
        <h1 className="break-words text-[18pt] font-bold uppercase leading-tight">{personal.fullName}</h1>
      ) : null}
      {personal.headline ? <p className="mt-0.5 break-words text-[11pt] font-semibold">{personal.headline}</p> : null}
      {contacts.length > 0 ? (
        <p className="mt-1 break-words text-[9.5pt] leading-snug">
          {contacts.map((item, index) => (
            <span key={`${item}-${index}`}>
              {index > 0 ? " | " : null}
              {isUrlContact(item) ? (
                <a className="text-blue-700 underline" href={item} rel="noreferrer" target="_blank">
                  {item}
                </a>
              ) : (
                item
              )}
            </span>
          ))}
        </p>
      ) : null}
    </header>
  );
}

function isUrlContact(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}
