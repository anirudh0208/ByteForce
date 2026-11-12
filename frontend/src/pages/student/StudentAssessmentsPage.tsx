import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const StudentAssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { assessments, currentSubmission } = useGradeX();

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-10">
      <div className="pb-6 border-b border-border/40 mb-6">
        <h1 className="font-headline-lg text-2xl md:text-4xl text-ink font-serif font-medium tracking-tight">
          My Course Assessments
        </h1>
        <p className="font-body-md text-sm md:text-base text-text-secondary mt-1">
          Active examinations, submissions, and published grading feedback for Cognitive Science & Neurobiology.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {assessments.map(asmt => (
          <div
            key={asmt.id}
            className="p-5 md:p-6 bg-surface rounded-2xl border border-border shadow-xs hover:border-blue-border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-pale text-primary font-bold flex items-center justify-center text-sm shrink-0">
                {asmt.code.split('-')[0]}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-title-sm text-base font-bold text-ink">{asmt.title}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-soft border border-border text-[11px] font-semibold text-text-secondary">
                    {asmt.code}
                  </span>
                </div>
                <span className="text-xs text-text-secondary mt-0.5">
                  Due {asmt.dueDate} · Total Score: {asmt.totalMarks} Marks
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-success/15 text-success">
                    <MaterialIcon name="check_circle" className="text-[14px]" />
                    <span>Grading Published</span>
                  </span>
                  <span className="text-xs text-text-secondary font-medium">
                    Your Score: <strong className="text-ink">{currentSubmission?.totalFacultyMarks ?? currentSubmission?.totalAiMarks ?? 39.5}</strong> / {asmt.totalMarks} pts
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/student/results')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-blue-deep text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
              >
                <span>View Results & Feedback</span>
                <MaterialIcon name="arrow_forward" className="text-[16px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

