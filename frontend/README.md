# GradeX — Frontend Application

AI-Powered Answer Sheet Evaluation Platform faithfully implemented from Google Stitch designs.

## Technology Stack
- **Framework:** React 18 with TypeScript
- **Bundler & Dev Server:** Vite 6
- **Styling:** Tailwind CSS with custom Stitch theme tokens (`canvas`, `surface`, `blue-primary`, `ink`, etc.)
- **Icons:** Material Symbols Outlined
- **Routing:** React Router v6
- **State Management:** React Context (`GradeXContext`) with shared state across all screens

---

## Screen Mapping

| Screen # | Screen Title | Route | Component |
|---|---|---|---|
| 01 | **Create Assessment & Rubric** | `/faculty/assessments/create` | `CreateAssessmentPage.tsx` |
| 02 | **Submissions & Bulk Upload** | `/faculty/submissions` | `SubmissionsUploadPage.tsx` |
| 03 | **Faculty Dashboard** | `/faculty/dashboard` | `FacultyDashboardPage.tsx` |
| 04 | **AI Grading Workspace** | `/faculty/grading` | `AiGradingWorkspacePage.tsx` |
| 05 | **Student Dashboard** | `/student/dashboard` | `StudentDashboardPage.tsx` |
| 06 | **Faculty Review Queue** | `/faculty/reviews` | `FacultyReviewQueuePage.tsx` |
| 07 | **Student Results & Feedback** | `/student/results` | `StudentResultsFeedbackPage.tsx` |
| 08 | **Results & Analytics** | `/faculty/analytics` | `ResultsAnalyticsPage.tsx` |

### Supporting Routes
- `/student/assessments`: Student courses and active assessments overview
- `/student/progress`: Student longitudinal progress and competency matrix

---

## Running the Application

To run the development server locally:

```bash
cd c:\hackathon\gradeX\frontend
npm run dev
```

Then open http://localhost:3000 in your browser.

To run a production build preview:

```bash
cd c:\hackathon\gradeX\frontend
npm run build
npm run preview
```

---

## Demo Role Switcher
A persistent role toggle is available in both the sidebar and top navigation bars:
- Click **"Switch to Student View"** to explore the student experience (Dashboard & Results/Feedback).
- Click **"Switch to Faculty View"** to return to the full faculty suite (Grading Workspace, Review Queue, Ingestion, Analytics, Assessment Authoring).

