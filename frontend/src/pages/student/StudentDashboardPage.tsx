import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentSubmission, currentAssessment } = useGradeX();

  const totalScore = currentSubmission?.totalFacultyMarks ?? currentSubmission?.totalAiMarks ?? 39.5;
  const scorePercent = Math.round((totalScore / (currentSubmission?.maxPossibleMarks || 50)) * 100);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top Greeting & Academic Overview */}
      <div className="pt-2 pb-6 flex flex-col gap-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
                Student Academic Workspace
              </span>
              <span className="text-border">•</span>
              <span className="font-label-sm text-xs text-text-secondary">Week 9 of 15</span>
            </div>
            <h1 className="font-headline-lg text-3xl md:text-4xl text-ink font-serif tracking-tight font-medium">
              Welcome back, Julian
            </h1>
            <p className="font-body-md text-sm md:text-base text-text-secondary mt-0.5">
              Fall 2026 • Cognitive Science & Neurobiology
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span>Active Session</span>
            <span className="text-border mx-1">•</span>
            <span>
              Cohort Median: <strong className="text-ink font-semibold">81.4%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Metric Badges / Overview Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
              Current Grade Avg
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-2xl md:text-3xl text-ink font-serif font-bold">88.2%</span>
              <span className="font-title-sm text-xs text-success font-medium">+3.4% this term</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-pale text-primary flex items-center justify-center">
            <MaterialIcon name="grade" className="text-[20px]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
              Evaluated Papers
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-2xl md:text-3xl text-ink font-serif font-bold">14</span>
              <span className="font-title-sm text-xs text-text-secondary">of 16 submitted</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-soft text-ink flex items-center justify-center">
            <MaterialIcon name="assignment_turned_in" className="text-[20px]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
              Concept Mastery
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-2xl md:text-3xl text-ink font-serif font-bold">92%</span>
              <span className="font-title-sm text-xs text-primary font-medium">Core benchmarks</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-soft text-primary flex items-center justify-center">
            <MaterialIcon name="psychology" className="text-[20px]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
              Feedback Status
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-2xl md:text-3xl text-success font-serif font-bold">Ready</span>
              <span className="font-title-sm text-xs text-text-secondary">Midterm published</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <MaterialIcon name="notifications_active" className="text-[20px]" />
          </div>
        </div>
      </div>

      {/* Priority Action Highlight Banner */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-blue-pale/80 border border-blue-border shadow-sm p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface text-ink font-label-sm text-xs shadow-xs border border-border">
                <MaterialIcon name="check_circle" className="text-[14px] text-success" />
                <span>Faculty Verified</span>
              </span>
              <span className="text-border">•</span>
              <span className="font-label-sm text-xs text-text-secondary uppercase tracking-wider">
                Formative Midterm Assessment
              </span>
            </div>
            <h2 className="font-headline-md text-2xl md:text-3xl text-ink font-serif tracking-tight font-bold">
              COG-302: Neural Mechanisms of Memory
            </h2>
            <p className="font-body-md text-sm md:text-base text-text-secondary leading-relaxed">
              Faculty assessment completed by Prof. Eleanor Vance. Highlights strong synthesis in synaptic consolidation models with specific guidance on retrograde messenger kinetics.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-baseline gap-2">
                <span className="font-headline-sm text-2xl md:text-3xl text-ink font-serif font-bold">
                  {totalScore} / 50
                </span>
                <span className="text-xs text-text-secondary font-medium">Marks ({scorePercent}%)</span>
              </div>
              <span className="text-border">•</span>
              <span className="text-xs font-semibold text-primary">Class Percentile: 78th</span>
            </div>
          </div>

          <div className="flex items-center shrink-0">
            <button
              onClick={() => navigate('/student/results')}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-deep text-white rounded-xl font-title-sm text-xs md:text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <span>View Detailed Feedback & Rubric Breakdown</span>
              <MaterialIcon name="arrow_forward" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Architecture: Upcoming vs Feedback Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: Upcoming & In-Progress Assessments (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="font-headline-sm text-xl font-bold text-ink font-serif">
              In-Progress Submissions
            </h2>
            <span className="font-label-sm text-xs text-text-secondary uppercase tracking-wider">
              2 Actionable
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-surface p-5 border border-border shadow-xs hover:shadow-sm transition-all flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">PHIL-108 • Epistemic Logic & Ethics</span>
                <span className="text-warning font-semibold">Due in 4 days</span>
              </div>
              <h3 className="font-title-md text-base font-semibold text-ink">
                Midterm Essay: Moral Realism in Computational Minds
              </h3>
              <p className="font-body-sm text-xs text-text-secondary leading-relaxed">
                Investigate epistemic grounding and artificial agent moral status under consequentialist versus deontic frameworks.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-text-secondary">Word count guide: 2,500 words</span>
                <button
                  onClick={() => navigate('/student/results')}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Review Rubric Criteria</span>
                  <MaterialIcon name="chevron_right" className="text-[16px]" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-surface p-5 border border-border shadow-xs hover:shadow-sm transition-all flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary font-medium">BIO-410 • Synaptic Biophysics</span>
                <span className="text-text-secondary">Due in 9 days</span>
              </div>
              <h3 className="font-title-md text-base font-semibold text-ink">
                Lab Report: Spectrophotometric Analysis of GPCR Pathways
              </h3>
              <p className="font-body-sm text-xs text-text-secondary leading-relaxed">
                Empirical dataset evaluation of second-messenger cascades in hippocampal slice preparations.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-text-secondary">Format: Structured Scientific Report</span>
                <button
                  onClick={() => navigate('/student/results')}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View Lab Guidelines</span>
                  <MaterialIcon name="chevron_right" className="text-[16px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Formative Feedback & Concept Mastery (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="font-headline-sm text-xl font-bold text-ink font-serif">
              Concept Mastery
            </h2>
            <span className="text-xs text-text-secondary">Cognitive Neuroscience</span>
          </div>

          <div className="rounded-2xl bg-surface p-5 border border-border shadow-xs flex flex-col gap-4">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Demonstrated Competencies
            </span>

            <div className="flex flex-col gap-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-ink">Receptor Channel Kinetics</span>
                  <span className="font-bold text-success">94% Mastery</span>
                </div>
                <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-ink">Membrane Depolarization & AMPA</span>
                  <span className="font-bold text-success">91% Mastery</span>
                </div>
                <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-ink">Morris Water Maze Protocol</span>
                  <span className="font-bold text-primary">78% Mastery</span>
                </div>
                <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-ink">Retrograde Messenger Signaling</span>
                  <span className="font-bold text-warning">62% Review Area</span>
                </div>
                <div className="w-full h-2 bg-border/60 rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface-soft rounded-xl border border-border text-xs text-text-secondary mt-1">
              <span className="font-semibold text-ink block mb-0.5">Faculty Recommendation:</span>
              Review presynaptic targets of nitric oxide and cGMP cascades in Section 4.2 of Kandel.
            </div>
          </div>
        </div>
      </div>

      {/* Academic Integrity & Transparency Notice Footer Panel */}
      <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-pale text-primary flex items-center justify-center shrink-0">
            <MaterialIcon name="verified_user" className="text-[22px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-title-sm text-sm font-semibold text-ink">
              Transparent & Explainable Evaluation Policy
            </span>
            <p className="font-body-sm text-xs text-text-secondary">
              All marks and concept tags are generated against verified department rubrics and subject to final faculty oversight.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/student/results')}
          className="text-xs font-semibold text-primary hover:underline shrink-0"
        >
          View Full Rubric Policy
        </button>
      </div>
    </div>
  );
};

