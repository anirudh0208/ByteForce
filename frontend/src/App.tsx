import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GradeXProvider } from './context/GradeXContext';
import { ToastContainer } from './components/common/ToastContainer';

// Layouts
import { FacultyLayout } from './components/layout/FacultyLayout';
import { StudentLayout } from './components/layout/StudentLayout';

// Faculty Screens
import { CreateAssessmentPage } from './pages/faculty/CreateAssessmentPage'; // Screen 01
import { SubmissionsUploadPage } from './pages/faculty/SubmissionsUploadPage'; // Screen 02
import { FacultyDashboardPage } from './pages/faculty/FacultyDashboardPage'; // Screen 03
import { AiGradingWorkspacePage } from './pages/faculty/AiGradingWorkspacePage'; // Screen 04
import { FacultyReviewQueuePage } from './pages/faculty/FacultyReviewQueuePage'; // Screen 06
import { ResultsAnalyticsPage } from './pages/faculty/ResultsAnalyticsPage'; // Screen 08

// Student Screens
import { StudentDashboardPage } from './pages/student/StudentDashboardPage'; // Screen 05
import { StudentResultsFeedbackPage } from './pages/student/StudentResultsFeedbackPage'; // Screen 07
import { StudentAssessmentsPage } from './pages/student/StudentAssessmentsPage';
import { StudentProgressPage } from './pages/student/StudentProgressPage';

export default function App() {
  return (
    <GradeXProvider>
      <BrowserRouter>
        <Routes>
          {/* Default entrypoint */}
          <Route path="/" element={<Navigate to="/faculty/dashboard" replace />} />

          {/* Faculty Routes */}
          <Route path="/faculty" element={<FacultyLayout />}>
            <Route index element={<Navigate to="/faculty/dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboardPage />} />
            <Route path="assessments" element={<FacultyDashboardPage />} />
            <Route path="assessments/create" element={<CreateAssessmentPage />} />
            <Route path="submissions" element={<SubmissionsUploadPage />} />
            <Route path="grading" element={<AiGradingWorkspacePage />} />
            <Route path="reviews" element={<FacultyReviewQueuePage />} />
            <Route path="analytics" element={<ResultsAnalyticsPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="results" element={<StudentResultsFeedbackPage />} />
            <Route path="assessments" element={<StudentAssessmentsPage />} />
            <Route path="progress" element={<StudentProgressPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/faculty/dashboard" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </GradeXProvider>
  );
}
