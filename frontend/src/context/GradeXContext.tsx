import React, { createContext, useContext, useState, useEffect } from 'react';
import { Assessment, StudentSubmission, UploadedFile, AnalyticsSummary, Role } from '../types';
import { initialAssessments, initialSubmissions, mockAnalyticsSummary } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface GradeXContextType {
  role: Role;
  setRole: (role: Role) => void;
  assessments: Assessment[];
  submissions: StudentSubmission[];
  currentAssessment: Assessment;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentSubmission: StudentSubmission | undefined;
  updateCriterionMarks: (studentId: string, questionId: string, criterionId: string, marks: number) => void;
  acceptAiMarks: (studentId: string) => void;
  flagSubmission: (studentId: string, reason?: string) => void;
  markSubmissionReviewed: (studentId: string) => void;
  addAssessment: (assessment: Assessment) => void;
  uploadedFiles: UploadedFile[];
  addUploadedFiles: (files: UploadedFile[]) => void;
  removeUploadedFile: (id: string) => void;
  clearUploadQueue: () => void;
  simulateUploadProcess: () => void;
  analytics: AnalyticsSummary;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const GradeXContext = createContext<GradeXContextType | undefined>(undefined);

export const GradeXProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('faculty');
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(initialSubmissions);
  const [currentStudentId, setCurrentStudentId] = useState<string>('STU-8821');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 'f-1',
      name: 'Julian_Vance_COG302_Exam.pdf',
      size: '2.4 MB',
      type: 'PDF',
      studentName: 'Julian Vance',
      studentId: 'STU-8821',
      status: 'ready',
      progress: 100,
      pages: 4,
      timestamp: 'Today, 14:32'
    },
    {
      id: 'f-2',
      name: 'Maya_Lin_COG302_Exam.pdf',
      size: '3.1 MB',
      type: 'PDF',
      studentName: 'Maya Lin',
      studentId: 'STU-8822',
      status: 'ready',
      progress: 100,
      pages: 5,
      timestamp: 'Today, 15:10'
    },
    {
      id: 'f-3',
      name: 'Marcus_Chen_COG302_Exam.pdf',
      size: '1.8 MB',
      type: 'PDF',
      studentName: 'Marcus Chen',
      studentId: 'STU-8823',
      status: 'ready',
      progress: 100,
      pages: 3,
      timestamp: 'Today, 16:04'
    }
  ]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(mockAnalyticsSummary);

  const currentAssessment = assessments[0];
  const currentSubmission = submissions.find(s => s.studentId === currentStudentId) || submissions[0];

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateCriterionMarks = (
    studentId: string,
    questionId: string,
    criterionId: string,
    marks: number
  ) => {
    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.studentId !== studentId) return sub;

        const updatedAnswers = sub.answers.map(ans => {
          if (ans.questionId !== questionId) return ans;

          const updatedCriteria = ans.criteriaScores.map(crit => {
            if (crit.criterionId !== criterionId) return crit;
            return { ...crit, marks: Math.max(0, Math.min(crit.maxMarks, marks)) };
          });

          const newQMarks = updatedCriteria.reduce((sum, c) => sum + c.marks, 0);
          return {
            ...ans,
            facultyMarks: newQMarks,
            criteriaScores: updatedCriteria
          };
        });

        const newTotal = updatedAnswers.reduce((sum, a) => sum + (a.facultyMarks ?? a.aiMarks), 0);

        return {
          ...sub,
          totalFacultyMarks: newTotal,
          status: 'Needs Review',
          answers: updatedAnswers
        };
      })
    );
    showToast(`Updated marks for ${studentId}`, 'info');
  };

  const acceptAiMarks = (studentId: string) => {
    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.studentId !== studentId) return sub;
        return {
          ...sub,
          totalFacultyMarks: sub.totalAiMarks,
          status: 'Graded',
          reviewed: true,
          reviewedBy: 'Prof. Eleanor Vance',
          reviewedAt: new Date().toLocaleDateString()
        };
      })
    );
    showToast(`AI marks accepted and confirmed for ${studentId}`, 'success');
  };

  const flagSubmission = (studentId: string, reason: string = 'Flagged for detailed secondary faculty evaluation') => {
    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.studentId !== studentId) return sub;
        const newStatus = sub.status === 'Flagged' ? 'Needs Review' : 'Flagged';
        return {
          ...sub,
          status: newStatus,
          flagReason: newStatus === 'Flagged' ? reason : undefined
        };
      })
    );
    showToast(`Submission status toggled for ${studentId}`, 'warning');
  };

  const markSubmissionReviewed = (studentId: string) => {
    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.studentId !== studentId) return sub;
        return {
          ...sub,
          status: 'Graded',
          reviewed: true,
          reviewedBy: 'Prof. Eleanor Vance',
          reviewedAt: new Date().toLocaleDateString()
        };
      })
    );
    showToast(`Submission marked as completed for ${studentId}`, 'success');
  };

  const addAssessment = (assessment: Assessment) => {
    setAssessments(prev => [assessment, ...prev]);
    showToast(`Assessment "${assessment.title}" created successfully!`, 'success');
  };

  const addUploadedFiles = (newFiles: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...newFiles]);
    showToast(`Queued ${newFiles.length} file(s) for bulk processing`, 'info');
  };

  const removeUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearUploadQueue = () => {
    setUploadedFiles([]);
    showToast('Upload queue cleared', 'info');
  };

  const simulateUploadProcess = () => {
    // Animate pending files to complete
    setUploadedFiles(prev =>
      prev.map(f => ({ ...f, status: 'ready', progress: 100 }))
    );
    showToast('All documents parsed and mapped to student rosters!', 'success');
  };

  return (
    <GradeXContext.Provider
      value={{
        role,
        setRole,
        assessments,
        submissions,
        currentAssessment,
        currentStudentId,
        setCurrentStudentId,
        currentSubmission,
        updateCriterionMarks,
        acceptAiMarks,
        flagSubmission,
        markSubmissionReviewed,
        addAssessment,
        uploadedFiles,
        addUploadedFiles,
        removeUploadedFile,
        clearUploadQueue,
        simulateUploadProcess,
        analytics,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </GradeXContext.Provider>
  );
};

export const useGradeX = () => {
  const context = useContext(GradeXContext);
  if (!context) {
    throw new Error('useGradeX must be used within a GradeXProvider');
  }
  return context;
};

