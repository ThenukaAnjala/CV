# AGENTS.md

## Project role

Act as a senior Next.js and TypeScript engineer.

Build maintainable, accessible, secure, testable, and production-ready code.

Do not produce only mockups, pseudocode, incomplete examples, placeholder functions, or TODO-only implementations.

Every feature requested in the project specification must be implemented and tested.

---

## Core development principles

Follow these principles throughout the project:

1. Correctness before cleverness.
2. Simplicity before unnecessary abstraction.
3. Reusability without overengineering.
4. Accessibility from the beginning.
5. Privacy by design.
6. Mobile-first responsive development.
7. Strong TypeScript typing.
8. Predictable folder and component structure.
9. Small focused files.
10. No resume/user personal data hardcoded in source code, except explicitly requested public developer attribution.

---

## Privacy rules

The application processes resume information.

Resume data is private.

Do not:

- Send resume data to an external server
- Send resume data to analytics tools
- Store resume data in a remote database
- Add tracking scripts
- Add advertising scripts
- Log resume data to the console
- Include resume data in URLs
- Include real personal data in fixtures or tests
- Include real personal data in screenshots
- Include real personal data in documentation
- Include real personal data in Git history

Explicitly requested public developer attribution may include the developer-provided name and contact email. Treat it as app attribution, never as resume content, fixtures, logs, analytics, or user data.

All resume processing must remain in the browser and must stay in memory only while the page is open.

Do not persist resume data in LocalStorage, sessionStorage, IndexedDB, cookies, Cache API, OPFS, files, server APIs, analytics, logs, or any other browser/system storage.

The only allowed file creation is an explicit user-initiated export/download action.

PDF and DOCX generation must happen locally in the browser.

---

## Reference resume rule

A reference resume may be used only to understand the visual layout.

Never copy, infer, or hardcode any actual content from the reference resume.

Never include real:

- Names
- Email addresses
- Phone numbers
- Locations
- Social media links
- Employers
- Universities
- Qualifications
- Project names
- Technologies
- Achievements
- Dates
- Certifications
- Leadership positions

Use only fictional placeholders such as:

- YOUR NAME
- TARGET JOB TITLE
- name@example.com
- Company Name
- Institution Name
- Project Name
- Skill One
- Jan 2025 - Present

The repository must contain no actual personal information from the reference resume.

Before completing the task, search the entire repository for accidental personal data.

---

## TypeScript rules

Use TypeScript strict mode.

Do not use `any` unless there is no reasonable alternative and the reason is documented.

Prefer:

- Explicit domain types
- Discriminated unions
- Type-safe utility functions
- Readonly data where appropriate
- Narrowed error handling
- Typed component props
- Typed event handlers
- Typed form schemas

Avoid:

- Unsafe type assertions
- `as any`
- Broad object types
- Duplicate interfaces
- Unnecessary enums
- Non-null assertions without justification

Shared domain types must be placed in:

```text
src/types
```

Validation schemas must be placed in:

```text
src/schemas
```

---

## File-size rule

Keep source files focused and preferably below 150 lines.

A file may exceed 150 lines only when splitting it would make the implementation less readable or less maintainable.

When a component becomes large, split it into:

- Smaller UI components
- Hooks
- Utility functions
- Validation schemas
- Constants
- Domain-specific helpers

Do not place the complete application inside one large page component.

Do not create files containing multiple unrelated responsibilities.

---

## Component architecture

Use the following component categories.

### UI components

Generic reusable components with no resume-specific business logic.

Examples:

- Button
- Input
- Textarea
- Select
- Dialog
- Tabs
- Card
- Badge
- FormError
- EmptyState

Place them in:

```text
src/components/ui
```

### Pure task-specific components

Components related to resume building but not responsible for global state.

Examples:

- ResumeSection
- EntryHeader
- BulletList
- SkillRows
- SectionCard
- ATSIssueItem

### Feature components

Components responsible for a complete user feature.

Examples:

- PersonalInformationForm
- ExperienceForm
- ResumePreview
- ATSReadinessPanel
- JobDescriptionMatcher
- ExportActions

Do not mix generic UI logic with resume business logic.

---

## Component rules

Each component must:

- Have one clear responsibility
- Receive typed props
- Avoid hidden side effects
- Avoid duplicated markup
- Handle empty states
- Handle long text safely
- Work with keyboard navigation
- Use semantic HTML where possible

Do not create unnecessary wrapper components.

Do not use React Context for local state that can be passed simply.

Do not introduce Redux, Zustand, or another global state library unless absolutely necessary.

Prefer a focused reducer or custom hook for resume state.

---

## Next.js rules

Use the Next.js App Router.

Use Server Components by default.

Use Client Components only when browser APIs, state, event handlers, PDF generation, or DOCX generation require them.

Add `"use client"` only to the smallest necessary component boundary.

Do not mark the complete application as a Client Component without need.

Avoid server actions for private resume data.

Do not create API routes for storing resume information.

Use dynamic imports for large browser-only export libraries when useful.

Handle hydration safely.

---

## State management rules

Use one shared `ResumeData` object as the source of truth.

The following must use the same resume data:

- Form editor
- HTML preview
- ATS analyzer
- Job description matcher
- PDF generator
- DOCX generator
- JSON export

Do not maintain separate resume content for each output format.

Do not duplicate resume information in multiple stores.

Use immutable state updates.

Use stable generated IDs for repeated items.

Do not use array indexes as React keys.

---

## Form rules

Use React Hook Form and Zod.

All form fields must have:

- Visible labels
- Typed values
- Validation where appropriate
- Accessible validation messages
- Helpful placeholders
- Keyboard support

Do not use placeholders as the only form labels.

Optional empty sections must not block normal editing.

Only required export information should block export.

---

## Styling rules

Use Tailwind CSS.

Keep styling consistent through shared design tokens.

Do not add unnecessary UI libraries.

Do not create excessive visual decoration.

The builder interface may use cards, icons, shadows, tabs, and controls.

The actual resume document must remain plain and ATS-friendly.

Do not place icons, cards, badges, charts, sidebars, or progress bars inside the resume.

---

## HCI and UX rules

Follow basic human-computer interaction principles.

The interface must provide:

- Clear visual hierarchy
- Consistent controls
- Immediate preview feedback
- Clear validation messages
- Visible privacy and persistence status
- Loading states
- Error states
- Confirmation before destructive actions
- Easy undo where practical
- Mobile-friendly interactions
- Large enough click targets
- Keyboard accessibility
- Readable typography
- Sufficient contrast

Do not overload the interface with too many actions at once.

Group related fields into clear sections.

Use progressive disclosure for advanced features.

On mobile, provide clear Edit and Preview modes.

---

## Accessibility rules

Target practical WCAG accessibility.

Implement:

- Semantic HTML
- Proper form labels
- Visible focus states
- Keyboard-operable controls
- Accessible dialogs
- Accessible tabs
- `aria-live` status updates
- Descriptive button labels
- Descriptive link text
- Sufficient color contrast
- Error messages connected to fields
- No color-only communication

Do not remove focus outlines without replacing them.

---

## Error-handling rules

Do not silently fail.

Handle:

- Invalid form input
- Invalid URLs
- Invalid imported JSON syntax
- Unsupported imported JSON
- PDF generation errors
- DOCX generation errors
- Unexpected browser export exceptions
- Empty required export fields
- Unexpected runtime errors

Display clear, user-friendly error messages.

Do not expose stack traces to normal users.

Do not log personal resume data.

---

## Naming conventions

Use:

- PascalCase for React components and types
- camelCase for variables and functions
- UPPER_SNAKE_CASE for true global constants
- kebab-case for route segments
- Descriptive names rather than abbreviations

Examples:

```text
ResumePreview.tsx
ExperienceForm.tsx
analyzeResume.ts
resumeSchema.ts
useResumeData.ts
```

Avoid vague names such as:

```text
data.ts
helper.ts
stuff.ts
component1.tsx
temp.ts
```

---

## Function rules

Functions must be small and focused.

Prefer pure functions for:

- Resume normalization
- ATS checks
- Keyword extraction
- Filename creation
- Date formatting
- JSON validation
- Resume text generation

Avoid deeply nested conditions.

Use early returns where they improve readability.

Do not duplicate formatting logic between PDF, DOCX, and preview when shared domain helpers can be used.

---

## Comments and documentation

Write comments only where they explain:

- Non-obvious behavior
- Important decisions
- Browser compatibility workarounds
- Complex formatting logic
- Privacy-sensitive decisions

Do not comment obvious code.

Public utility functions may use concise JSDoc where useful.

Keep the README accurate.

---

## Testing rules

Use a suitable test runner such as Vitest.

Write tests for deterministic business logic.

At minimum, test:

- ATS readiness analysis
- Keyword extraction
- Job description matching
- Filename sanitization
- Resume normalization
- Imported JSON validation
- Empty resume behavior
- Long text behavior
- Invalid URLs
- Special filename characters

Tests must use fictional information only.

Do not include reference-resume personal data in tests.

---

## Dependency rules

Use only necessary dependencies.

Before adding a package, verify that it provides meaningful value.

Do not add:

- A database client
- Analytics libraries
- Authentication libraries
- Heavy state-management packages
- Unnecessary UI frameworks
- AI service SDKs
- Screenshot-to-PDF libraries

Prefer browser APIs and focused packages.

---

## Git and repository hygiene

Do not commit:

- `.env`
- Build output
- Temporary files
- Generated resumes
- Personal resume JSON
- Downloaded PDFs
- Downloaded DOCX files
- Debug logs
- User-uploaded content

Create an appropriate `.gitignore`.

No environment variables should be required for this project.

---

## Completion workflow

Before declaring the project complete:

1. Install dependencies.
2. Run the development server.
3. Run linting.
4. Run unit tests.
5. Run the production build.
6. Fix all TypeScript errors.
7. Fix runtime errors.
8. Review responsive layouts.
9. Test PDF generation.
10. Test DOCX generation.
11. Confirm no resume data is written to LocalStorage, sessionStorage, IndexedDB, cookies, Cache API, server APIs, or logs.
12. Test JSON import and export.
13. Test reset confirmation.
14. Test long resume content.
15. Search the repository for accidental personal data.
16. Confirm no resume data is transmitted over the network.
17. Confirm the README matches the implementation.

Do not claim completion if the build fails.

---

## Response rules

When implementation is finished, provide:

- A concise implementation summary
- Important architecture decisions
- The final file tree
- Installation commands
- Development command
- Test command
- Build command
- Deployment instructions
- Known limitations

Do not provide only a plan.

Do not leave essential code as TODO items.
