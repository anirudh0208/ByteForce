export type Role = 'faculty' | 'student';

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxMarks: number;
  awardedMarks?: number;
}

export interface Question {
  id: string;
  number: number;
  title: string;
  prompt: string;
  benchmarkAnswer: string;
  maxMarks: number;
  criteria: RubricCriterion[];
}

export interface Assessment {
  id: string;
  code: string;
  title: string;
  subject: string;
  cohort: string;
  dueDate: string;
  totalMarks: number;
  questionsCount: number;
  submissionsCount: number;
  totalEnrolled: number;
  gradedCount: number;
  pendingReviewCount: number;
  status: 'Published' | 'Draft' | 'Grading' | 'Completed';
  averageScore?: number;
  estimatedGradingSpeed?: string;
  questions: Question[];
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  assessmentId: string;
  assessmentTitle: string;
  submittedAt: string;
  status: 'Graded' | 'Needs Review' | 'Flagged' | 'Processing';
  confidenceScore: number; // 0 - 100
  totalAiMarks: number;
  totalFacultyMarks?: number;
  maxPossibleMarks: number;
  flagReason?: string;
  reviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  
  // Specific question answers
  answers: {
    questionId: string;
    questionNumber: number;
    studentText: string;
    aiMarks: number;
    facultyMarks?: number;
    maxMarks: number;
    correctConcepts: string[];
    missingConcepts: string[];
    strengths: string[];
    improvements: string[];
    criteriaScores: {
      criterionId: string;
      criterionName: string;
      marks: number;
      maxMarks: number;
      feedback: string;
    }[];
  }[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  studentName?: string;
  studentId?: string;
  status: 'uploading' | 'parsing' | 'matched' | 'error' | 'ready';
  progress: number;
  pages?: number;
  timestamp: string;
}

export interface AnalyticsSummary {
  classAverage: number;
  medianScore: number;
  highestScore: number;
  lowestScore: number;
  standardDeviation: number;
  gradeDistribution: {
    grade: string;
    range: string;
    count: number;
    percentage: number;
  }[];
  questionPerformance: {
    questionNumber: number;
    title: string;
    averageMarks: number;
    maxMarks: number;
    successRate: number;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
  }[];
  difficultConcepts: {
    concept: string;
    missedPercentage: number;
    affectedStudents: number;
    topic: string;
  }[];
  studentsNeedingSupport: {
    studentName: string;
    studentId: string;
    score: number;
    gapArea: string;
    trend: 'declining' | 'stable' | 'improving';
  }[];
}

