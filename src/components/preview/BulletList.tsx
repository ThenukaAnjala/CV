import type { ResumeBullet } from "@/types/resume";

export function BulletList({ bullets }: { bullets: ResumeBullet[] }) {
  if (bullets.length === 0) return null;

  return (
    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[10pt] leading-snug">
      {bullets.map((bullet) => (
        <li className="break-words" key={bullet.id}>
          {bullet.text}
        </li>
      ))}
    </ul>
  );
}
