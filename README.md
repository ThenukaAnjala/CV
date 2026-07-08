# ATS Resume Builder

Create, check, and export an ATS-friendly resume locally in your browser.

## Developer

Developed by THENUKA GUNASEKARA.

Contact: thenukaanjala@gmail.com

## Features

- Structured resume editor for personal information, summary, education, experience, projects, skills, certifications, and activities
- Live A4 resume preview with plain ATS-friendly single-column layout
- In-memory editing only; resume data is not autosaved, cached, or restored from browser storage
- JSON import and export with schema validation
- Deterministic ATS readiness estimate
- Local job description keyword matching
- Searchable PDF download through `@react-pdf/renderer`
- Editable Word DOCX download through `docx`
- Responsive desktop layout and mobile Edit/Preview mode
- Unit tests for resume analysis, matching, filenames, normalization, JSON import, and export generation

## Privacy-First Architecture

Resume data is held only in the current browser page's memory while the page is open. The app has no login, backend database, analytics, tracking scripts, server actions for resume data, API routes for personal information, cookies, LocalStorage, sessionStorage, IndexedDB, or other resume-data persistence.

All processing for JSON import/export, ATS checks, keyword matching, PDF generation, and DOCX generation happens locally in the browser. Files are created only when the user explicitly chooses an export or download action; the app does not keep a copy.

No environment variables are required.

## Technology Stack

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS
- React Hook Form
- Zod
- `@hookform/resolvers`
- `@react-pdf/renderer`
- `docx`
- Vitest
- React Testing Library setup

## Folder Structure

```text
src/
  app/                 App Router pages and global styles
  components/
    ats/               ATS readiness and keyword matching panels
    builder/           Resume editor shell and form sections
    export/            PDF and DOCX download buttons
    preview/           A4 resume preview components
    ui/                Reusable UI controls
  constants/           Resume constants and section labels
  lib/
    ats/               ATS and keyword logic
    export/            PDF and DOCX generators
    forms/             Form helpers
    resume/            Normalization, filenames, JSON, validation
    ui/                UI helpers
  schemas/             Zod schemas
  test/                Fictional test data factory
  types/               Shared resume domain types
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open the local URL printed by Next.js.

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Production Build

```bash
npm run build
```

## Vercel Deployment

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Use the default Next.js framework settings.
4. Do not add environment variables; none are required.
5. Deploy.

The deployed app remains client-side for resume data. Vercel serves the static/app assets, but resume content is not stored on a server by this project.

## PDF Generation

PDF generation uses `@react-pdf/renderer` to create selectable, searchable text in an A4 document. It does not screenshot, rasterize, or canvas-capture the HTML preview.

## DOCX Generation

DOCX generation uses `docx` to create editable Word paragraphs, headings, bullet lists, tab-aligned dates, and hyperlinks. The resume is not inserted as an image.

## No Persistent Storage

The editor does not save resume data automatically. It does not write resume data to:

```text
LocalStorage
sessionStorage
IndexedDB
cookies
Cache API
server APIs
```

Refreshing or closing the page clears the current editor state. Export PDF, Word, or JSON only when you intentionally want your browser to create a file on your device.

## JSON Import and Export

JSON exports include `schemaVersion`. Imports are parsed as JSON, validated with Zod, normalized, and confirmed before replacing only the current in-memory editor state. Imported strings are treated as text and are never executed.

## ATS Estimate Limitations

The ATS readiness score is a deterministic local estimate. It is not an official ATS certification, does not guarantee parsing behavior, and does not guarantee interviews or recruiter outcomes.

## Job Description Matching Limitations

Keyword matching is a local text comparison. It does not perfectly understand recruiter intent, and a keyword match is not proof of qualification. Only add missing keywords when they truthfully reflect your experience, education, project work, or skills.

## Accessibility

The app uses semantic form labels, visible focus states, keyboard-operable move controls, accessible dialogs, status messages with `aria-live`, and mobile-friendly touch targets.

## Known Limitations

- The browser preview estimates page count by content volume; final pagination is determined by the PDF/DOCX renderers.
- DOCX date alignment uses tab stops, which can vary slightly across Word-compatible editors.
- The ATS estimate and keyword matcher are deterministic heuristics, not a substitute for human review.
- Edits are intentionally not autosaved. Refreshing or closing the page clears unsaved work unless the user explicitly downloads an export file.
