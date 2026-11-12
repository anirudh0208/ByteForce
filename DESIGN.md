# DESIGN.md — GradeX
## Google Stitch Design System & Website Direction

> **Product:** GradeX  
> **Domain:** Education  
> **Problem Statement:** Automated Formative Assessment and Intelligent Subjective Grading Assistant  
> **Platform:** Responsive web application  
> **Primary users:** Faculty / teachers and students

---

## 1. Product Design Goal

Design GradeX as a premium, trustworthy, human-centred AI assessment platform that helps faculty evaluate subjective answers consistently and efficiently while giving students useful, explainable feedback.

The product should feel like a refined modern SaaS platform—not a conventional school ERP, not a generic admin template, and not a chatbot.

### Core product workflow

1. Faculty creates an assessment.
2. Faculty adds questions, reference answers and a marking rubric.
3. Students submit typed answers or supported digital documents.
4. GradeX evaluates answers against the rubric, awards concept-wise marks and generates feedback.
5. Low-confidence or unusual evaluations are flagged for faculty review.
6. Faculty reviews, edits or overrides marks and publishes results.
7. Students view marks, feedback and areas to improve.

**Important product principle:** AI recommends grades; faculty remains in control of final academic decisions. Make review status, confidence and grade changes visible and understandable.

---

## 2. Visual Inspiration

Use the attached reference image as the primary visual direction.

### What to carry over

- A warm, pale ivory canvas instead of stark white.
- Large, airy sky-blue surfaces with subtle gradients.
- Cream/off-white cards that feel soft and tactile.
- Muted champagne, sand and golden-brown accents used sparingly.
- Elegant editorial serif typography for large headings and key numerical highlights.
- Clean, understated sans-serif typography for navigation, labels, tables and controls.
- Rounded cards, delicate outlines, soft shadows and generous spacing.
- Calm, balanced layouts with a premium wellness-app level of visual polish.

### What to adapt for an education SaaS product

The reference is a mobile wellness dashboard. Do **not** reproduce its phone mockups, wellness metrics, flowers, wearable ring or health charts.

Translate its visual character into a practical desktop-first web platform:
- Use a persistent sidebar and a clear top bar.
- Use large dashboard cards for assessment progress and grading activity.
- Use tables and review panels for student submissions.
- Use charts only when they help explain class or question performance.
- Keep assessment creation and grading workflows efficient and information-rich.

---

## 3. Brand Personality

**Brand attributes:** Intelligent · Calm · Precise · Supportive · Trustworthy · Academic · Premium

The interface should communicate:
- Confidence without looking intimidating.
- AI capability without excessive futuristic decoration.
- Academic seriousness without looking outdated.
- Student support without feeling childish.
- Transparency and human oversight at every grading stage.

Avoid:
- Loud neon gradients.
- Excessive purple AI branding.
- Heavy glassmorphism that reduces readability.
- Dense ERP-style screens.
- Cartoon illustrations and childish education graphics.
- Too many badges, colours, shadows or decorative elements.
- Fake AI chat interfaces as the primary product experience.

---

## 4. Colour System

Use the following palette as the design foundation. Keep backgrounds light and low-contrast; reserve stronger colours for important actions and statuses.

| Token | Hex | Usage |
|---|---|---|
| `canvas` | `#EEECE3` | Main application background; warm ivory |
| `surface` | `#F8F5F0` | Primary cards, panels and content surfaces |
| `surface-soft` | `#F2EFE8` | Secondary cards and table backgrounds |
| `blue-primary` | `#A9C9E8` | Primary brand blue, selected areas and highlights |
| `blue-deep` | `#789FC6` | Hover states, active navigation and chart emphasis |
| `blue-pale` | `#DCEAF5` | Subtle blue backgrounds and selected rows |
| `blue-border` | `#C6DCEB` | Soft borders and card outlines |
| `gold-primary` | `#B99555` | Restrained accent, premium details and secondary highlights |
| `gold-soft` | `#E5D4AC` | Warm accent backgrounds |
| `ink` | `#272522` | Main headings and body text |
| `text-secondary` | `#777873` | Supporting text, descriptions and metadata |
| `border` | `#E2DED5` | Dividers, outlines and table separators |
| `success` | `#668B73` | Published, completed and successful states |
| `warning` | `#B58A4A` | Needs review and attention states |
| `danger` | `#B96D66` | Errors, failed uploads and critical issues |

### Colour usage rules

- Use `canvas` for the page background, not pure white.
- Use `surface` for most content cards.
- Use `blue-primary` and `blue-pale` for the primary visual identity.
- Use gold only as a small accent; it must not compete with blue.
- Use `ink` for readable text. Do not use pale blue or gold for long body copy.
- Status colours must always be accompanied by text or an icon; never communicate status through colour alone.
- Maintain accessible text contrast, especially for small labels and table content.

---

## 5. Typography

The reference combines a high-contrast editorial serif with a minimal sans-serif. Recreate that contrast.

### Font pairing

**Display / editorial headings:** `Cormorant Garamond`  
Fallback: `Georgia`, serif.

**Interface / body / controls:** `DM Sans`  
Fallback: `Inter`, `Arial`, sans-serif.

Use Google Fonts when available. If the chosen font is unavailable in the implementation environment, use the listed fallback.

### Type scale

| Style | Font | Suggested size | Weight |
|---|---|---:|---|
| Hero heading | Cormorant Garamond | 56–68 px | 400 |
| Page heading | Cormorant Garamond | 42–48 px | 400 |
| Section heading | Cormorant Garamond | 30–34 px | 500 |
| Card title | DM Sans | 16–18 px | 600 |
| Body | DM Sans | 14–16 px | 400 |
| Supporting text | DM Sans | 12–13 px | 400 |
| KPI number | Cormorant Garamond | 42–52 px | 500 |
| Button / navigation | DM Sans | 13–14 px | 500–600 |

### Typography rules

- Use serif typography for page titles, hero statements and large KPI values.
- Use sans-serif typography for all functional interface elements.
- Keep headings elegant and spacious, but never sacrifice clarity.
- Avoid using the display serif for dense paragraphs, forms, tables or buttons.
- Use sentence case. Avoid unnecessary all-caps labels.

---

## 6. Layout & Grid

### Desktop

- Design first for a 1440 px desktop viewport.
- Use a fixed or sticky left sidebar approximately 240–260 px wide.
- Use a top header approximately 68–76 px high.
- Main content should have 28–36 px horizontal padding.
- Use a 12-column grid where appropriate.
- Keep a comfortable maximum content width for long forms and reading views.
- Use consistent alignment across page titles, cards and tables.

### Tablet

- Collapse the sidebar into a compact navigation rail or drawer.
- Reduce dashboard grids from 3–4 columns to 2 columns.
- Keep tables usable with horizontal scrolling or a clear stacked layout.

### Mobile

- Use a compact top bar and mobile navigation.
- Stack cards vertically.
- Convert wide tables into readable submission cards.
- Keep primary actions easy to reach.
- Never shrink desktop tables until text becomes unreadable.

### Spacing scale

Use a consistent 4 px base scale:
- 4 px: icon-to-label spacing.
- 8 px: compact internal spacing.
- 12 px: small component gaps.
- 16 px: standard card spacing.
- 24 px: section spacing.
- 32 px: major content spacing.
- 40–48 px: page-level separation.

---

## 7. Shape, Borders & Elevation

- Main cards: 20–26 px border radius.
- Large feature panels: 26–32 px border radius.
- Inputs: 12–14 px border radius.
- Buttons: 12–14 px border radius; use pill shapes only for compact filters when appropriate.
- Use thin, warm-grey or pale-blue borders.
- Use very soft shadows with low opacity.
- Prefer subtle surface contrast over heavy shadows.
- Keep card padding around 20–28 px.
- Use consistent icon sizing and stroke weight.

The overall impression should be soft, premium and precise—not overly rounded or toy-like.

---

## 8. Navigation & Application Shell

### Faculty navigation

Use a persistent left sidebar with:
1. Overview
2. Assessments
3. Create Assessment
4. Submissions
5. AI Grading
6. Review Queue
7. Analytics
8. Settings

Sidebar design:
- Warm ivory or cream surface.
- GradeX wordmark at the top.
- Simple outline icons.
- Active item uses a pale-blue rounded background and dark text.
- Keep labels visible on desktop.
- Add a small profile / account area at the bottom.

### Student navigation

1. Dashboard
2. My Assessments
3. Results & Feedback
4. Progress
5. Profile

Student navigation should be simpler and should not expose faculty-only grading controls.

### Top bar

Include:
- Current page title or breadcrumb.
- Search only where useful.
- Notifications.
- Help / support.
- User avatar and account menu.

Avoid overcrowding the top bar.

---

## 9. Key Screens to Design

Create a cohesive multi-page website with reusable components and consistent navigation.

### A. Landing / Product Introduction

Purpose: Explain the platform and guide users to sign in.

Include:
- A refined hero headline such as **“Make every assessment more meaningful.”**
- Short supporting text explaining AI-assisted subjective grading and faculty control.
- Primary CTA: `Get Started` or `Sign In`.
- Secondary CTA: `Explore how it works`.
- A product preview showing an assessment dashboard or grading review interface.
- Three concise value propositions: Faster evaluation, Consistent rubric-based grading, Actionable student feedback.
- A simple workflow section: Create → Submit → Evaluate → Review → Publish.
- A trust statement emphasizing faculty oversight and explainable grading.

Visual direction:
- Large editorial serif headline.
- Sky-blue hero surface or soft blue gradient.
- Warm ivory background.
- Cream content cards.
- Restrained gold accent details.
- Avoid generic stock photos of students and graduation caps.

### B. Faculty Dashboard

Purpose: Give faculty a clear view of assessment activity and grading workload.

Suggested content:
- Greeting and page title: `Good morning, Professor`.
- Primary action: `Create assessment`.
- KPI cards:
  - Active assessments.
  - Total submissions.
  - Graded submissions.
  - Pending faculty reviews.
- Assessment activity list with assessment name, subject, submission count, progress and status.
- Grading progress visualization.
- Review queue highlighting low-confidence or flagged answers.
- Recent activity.
- A small performance insight panel, such as frequently misunderstood concepts.

Use large, elegant KPI numbers with serif typography and concise sans-serif labels. Make the most important next action obvious.

### C. Create Assessment

Purpose: Let faculty create a structured assessment without friction.

Use a clear multi-step form or stepper:
1. Assessment details.
2. Add questions.
3. Add reference answers.
4. Configure marking rubric.
5. Review and publish.

Fields may include:
- Assessment title.
- Subject / course.
- Instructions.
- Due date.
- Question text.
- Maximum marks.
- Reference answer.
- Rubric criteria and marks per criterion.

Design requirements:
- Clearly separate each question into its own card.
- Make rubric criteria editable and easy to scan.
- Show total marks and validation feedback.
- Include `Save draft` and `Publish assessment` actions.
- Avoid placing every field into one long, overwhelming form.

### D. Submissions & Bulk Upload

Purpose: Help faculty collect many student answers efficiently.

Include:
- Assessment selector.
- Drag-and-drop upload zone for supported files.
- Clear supported file types and size guidance.
- Bulk upload progress.
- Student / file mapping table.
- Upload success, duplicate and failed-file states.
- Option to review unmatched files before grading.

The MVP can prioritise digital submissions and structured bulk imports. Do not imply that physical handwritten answer sheets are automatically processed unless that capability is actually implemented.

### E. AI Grading Workspace

Purpose: Show how each answer is evaluated against the faculty's rubric.

Recommended desktop layout:
- Left panel: question and reference answer.
- Centre panel: student's submitted answer.
- Right panel: AI evaluation and rubric breakdown.

Show:
- Awarded marks and maximum marks.
- Criterion-wise marks.
- Key concepts identified.
- Missing or incorrect concepts.
- Short explanation for marks awarded or deducted.
- AI confidence indicator.
- `Accept recommendation`, `Edit marks` and `Flag for review` actions.

Make the relationship between the submitted answer, rubric criteria and awarded marks easy to understand. Do not show an unexplained AI score.

### F. Faculty Review Queue

Purpose: Keep faculty in control of uncertain or exceptional grades.

Include:
- Pending review count.
- Filters: All, Low confidence, Flagged, Modified.
- Student name / ID.
- Assessment and question.
- AI-recommended marks.
- Confidence / review reason.
- Review status.
- Quick action to open the grading workspace.

Use restrained warning accents for items requiring attention. Make reviewed, overridden and pending states distinct.

### G. Results & Analytics

Purpose: Help faculty understand performance and publish results.

Include:
- Class average.
- Highest and lowest score.
- Grade distribution.
- Question-wise performance.
- Commonly misunderstood concepts.
- Students who may need additional support.
- Assessment completion and grading status.
- Export / download report action, if supported.

Use clean charts with pale-blue lines or bars and subtle gridlines. Do not overload the screen with decorative graphs.

### H. Student Dashboard

Purpose: Let students understand what they need to complete and what has been evaluated.

Include:
- Welcome message.
- Upcoming assessments.
- Submitted assessments.
- Results awaiting publication.
- Recent feedback.
- Progress overview.

Use friendly, calm language. Keep the interface simpler than the faculty workspace.

### I. Student Assessment & Feedback

Assessment submission screen:
- Assessment title and instructions.
- Questions with clear numbering and marks.
- Large readable answer editor.
- Save draft / submit actions.
- Submission confirmation.

Feedback screen:
- Total marks and maximum marks.
- Question-wise marks.
- Strengths.
- Missing concepts / areas to improve.
- Actionable suggestions.
- Rubric-based explanation.

Do not expose internal faculty notes, hidden reference answers or unpublished grades to students.

---

## 10. Reusable Components

Create reusable components for:

- `AppSidebar`
- `Topbar`
- `PageHeader`
- `PrimaryButton`
- `SecondaryButton`
- `IconButton`
- `MetricCard`
- `AssessmentCard`
- `StatusBadge`
- `ProgressBar`
- `DataTable`
- `SearchInput`
- `FilterChips`
- `EmptyState`
- `UploadDropzone`
- `UploadProgress`
- `QuestionCard`
- `RubricEditor`
- `AnswerPanel`
- `RubricBreakdown`
- `ConfidenceIndicator`
- `ReviewQueueItem`
- `FeedbackCard`
- `ChartCard`
- `ConfirmationModal`
- `ToastNotification`

Components should share the same colour, typography, radius, border and spacing tokens.

---

## 11. Interaction & State Design

Design meaningful states, not only ideal screenshots.

### Required states

- Default.
- Hover.
- Focus.
- Active / selected.
- Disabled.
- Loading.
- Empty.
- Success.
- Error.
- Pending.
- Needs review.
- Published.

### Important interactions

- Sidebar navigation changes the active section.
- Assessment cards open assessment details.
- Filters update visible submissions.
- Upload area supports drag-and-drop and file selection.
- Upload progress is visible.
- Grading actions clearly distinguish accepting, editing and flagging.
- Faculty edits show that the AI recommendation was overridden.
- Publish action requires confirmation.
- Student submission displays a confirmation state.
- Notifications and toast messages provide clear feedback.

Use visible focus indicators and keyboard-accessible controls.

---

## 12. Icons & Data Visualisation

### Icons

- Use a consistent outline icon family such as Lucide.
- Use icons only when they improve recognition.
- Keep icons around 16–20 px for controls and 20–24 px for navigation.
- Avoid mixing filled, outlined and decorative icon styles.

### Charts

- Prefer simple bar charts, line charts and progress indicators.
- Use blue as the primary data colour.
- Use warm neutral gridlines and backgrounds.
- Use gold sparingly to highlight a selected data point or important insight.
- Include labels, legends and accessible text summaries.
- Never rely on colour alone to communicate a result.

---

## 13. Accessibility & Usability

- Maintain WCAG-conscious colour contrast.
- Use readable font sizes; avoid tiny metadata.
- Provide visible labels for every form input.
- Make all actions keyboard accessible.
- Use clear validation messages beside the relevant field.
- Provide text alternatives for chart insights.
- Do not use colour alone for grading confidence or status.
- Keep tables readable and support sorting / filtering where useful.
- Use plain language for AI explanations.
- Make destructive or final actions explicit and confirmable.

---

## 14. Content & Microcopy

Use concise, calm, professional language.

Preferred examples:
- `Create assessment`
- `Review AI grading`
- `Ready for faculty review`
- `Needs your attention`
- `AI recommendation`
- `Marks awarded`
- `View feedback`
- `Publish results`
- `Your feedback is ready`

Avoid:
- Overly robotic AI language.
- Claims that AI grading is always correct.
- “100% accurate” or other unsupported promises.
- Excessive exclamation marks.
- Unclear technical terms shown to students.

Always distinguish:
- AI-recommended marks.
- Faculty-reviewed marks.
- Published final marks.

---

## 15. Responsive & Performance Considerations

- Use responsive grids and flexible layouts.
- Keep the grading workspace optimised for desktop, while ensuring it remains usable on tablets.
- On small screens, stack the answer and rubric panels into a clear vertical sequence.
- Use loading skeletons for dashboards and tables.
- Avoid large decorative animations.
- Keep transitions subtle, approximately 150–220 ms.
- Respect reduced-motion preferences.

---

## 16. Recommended Design Tokens

```css
:root {
  --color-canvas: #EEECE3;
  --color-surface: #F8F5F0;
  --color-surface-soft: #F2EFE8;

  --color-blue-primary: #A9C9E8;
  --color-blue-deep: #789FC6;
  --color-blue-pale: #DCEAF5;
  --color-blue-border: #C6DCEB;

  --color-gold-primary: #B99555;
  --color-gold-soft: #E5D4AC;

  --color-ink: #272522;
  --color-text-secondary: #777873;
  --color-border: #E2DED5;

  --color-success: #668B73;
  --color-warning: #B58A4A;
  --color-danger: #B96D66;

  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-interface: "DM Sans", Inter, Arial, sans-serif;

  --radius-input: 12px;
  --radius-card: 22px;
  --radius-panel: 28px;

  --shadow-card: 0 8px 28px rgba(53, 49, 41, 0.055);
}
```

---

## 17. Final Instructions for Google Stitch

Generate a complete, cohesive, responsive **GradeX web application** using this design system.

Prioritise these screens for the first implementation:
1. Faculty dashboard.
2. Create assessment with questions and rubric.
3. Submissions / bulk upload.
4. AI grading workspace.
5. Faculty review queue.
6. Results and analytics.
7. Student dashboard.
8. Student feedback page.

### Non-negotiable design rules

- Follow the attached reference image's warm ivory, pastel sky-blue, cream and muted gold palette.
- Use Cormorant Garamond-style editorial serif headings with DM Sans-style interface typography.
- Keep the design premium, minimal, spacious and polished.
- Build a real web-app layout with sidebar navigation, top bar, cards, forms, tables and review panels.
- Use consistent reusable components across every screen.
- Make faculty review and human oversight central to the grading experience.
- Show explainable, rubric-based marks rather than a mysterious AI score.
- Clearly distinguish AI recommendations from faculty-approved final grades.
- Design realistic loading, empty, error, success and review states.
- Do not copy the wellness content or mobile-phone layout from the reference.
- Do not invent unsupported product capabilities.
- Avoid generic dashboard templates and excessive decoration.

**The final result should feel like a premium education SaaS product with the visual softness of the reference image and the clarity, usability and information hierarchy required by a serious academic assessment platform.**
