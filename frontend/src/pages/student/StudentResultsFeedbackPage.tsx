import React, { useState } from 'react';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const StudentResultsFeedbackPage: React.FC = () => {
  const { currentSubmission, currentAssessment, showToast } = useGradeX();
  const [activeHighlight, setActiveHighlight] = useState<string>('all');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const currentQ = currentAssessment.questions[selectedQuestionIndex] || currentAssessment.questions[0];
  const currentAns =
    currentSubmission?.answers.find(a => a.questionId === currentQ?.id) ||
    currentSubmission?.answers[0];

  const qMarks = currentAns?.facultyMarks ?? currentAns?.aiMarks ?? 13.5;
  const totalScore = currentSubmission?.totalFacultyMarks ?? currentSubmission?.totalAiMarks ?? 39.5;

  const handleDownloadTranscript = () => {
    showToast('Downloaded certified academic grade report (PDF)', 'success');
  };

  const handleRequestReview = () => {
    showToast('Clarification request forwarded to Prof. Eleanor Vance', 'info');
  };

  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-10">
      {/* Breadcrumb & Top Bar Context */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-text-secondary">
          <span className="flex items-center gap-1 text-ink font-medium">
            <MaterialIcon name="school" className="text-[16px]" />
            <span>My Courses</span>
          </span>
          <span className="text-text-secondary/40">/</span>
          <span className="text-ink font-semibold">COG-302</span>
          <span className="text-text-secondary/40">/</span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-pale text-on-primary-container text-xs font-semibold">
            Results & Feedback
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <MaterialIcon name="verified" className="text-success text-[16px]" />
          <span>Institutional Grade Record #COG302-8821</span>
        </div>
      </div>

      {/* Page Title & Authority Scrim */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/40 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">
              Assessment Evaluation
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            <span className="text-xs text-success font-semibold">Faculty Verified</span>
          </div>
          <h1 className="font-headline-lg text-2xl md:text-4xl text-ink font-serif font-medium tracking-tight">
            Neural Encoding & Synaptic Plasticity
          </h1>
          <p className="font-body-md text-xs md:text-sm text-text-secondary mt-1">
            Graded by Prof. Eleanor Vance • Cognitive Neuroscience • Published Oct 24, 2026
          </p>
        </div>

        {/* Question Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-surface-soft p-1 rounded-xl border border-border">
          {currentAssessment.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setSelectedQuestionIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedQuestionIndex === idx
                  ? 'bg-surface text-primary shadow-xs font-bold border border-border'
                  : 'text-text-secondary hover:text-ink'
              }`}
            >
              Q{q.number} ({q.maxMarks} pts)
            </button>
          ))}
        </div>
      </div>

      {/* 1. Executive Score & Evaluation Header (Asymmetric Bento Block) */}
      <div className="w-full bg-surface rounded-2xl shadow-xs border border-border overflow-hidden mb-8">
        <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/60">
          <div className="flex flex-wrap items-baseline gap-6 md:gap-8">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Question {currentQ?.number} Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg text-3xl md:text-4xl text-ink font-serif font-bold">
                  {qMarks}
                </span>
                <span className="font-headline-sm text-base md:text-lg text-text-secondary font-serif">
                  / {currentQ?.maxMarks}.0 pts
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-success/15 text-success text-xs font-semibold ml-2">
                  {Math.round((qMarks / (currentQ?.maxMarks || 15)) * 100)}% Mastery
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-border hidden sm:block"></div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Overall Assessment
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display-lg text-2xl md:text-3xl text-ink font-serif font-bold">
                  {totalScore} / {currentAssessment.totalMarks}
                </span>
                <span className="text-xs text-text-secondary font-medium">(Top 22% of Class)</span>
              </div>
            </div>

            <div className="h-10 w-px bg-border hidden lg:block"></div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Evaluation Standard
              </span>
              <div className="flex items-center gap-1.5 text-xs text-ink font-medium">
                <MaterialIcon name="verified_user" className="text-primary text-[16px]" />
                <span>Certified Rubric Calibration v3.4</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTranscript}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-soft hover:bg-surface-container-high text-ink font-semibold text-xs border border-border transition-colors shadow-xs"
            >
              <MaterialIcon name="download" className="text-[16px]" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleRequestReview}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface hover:bg-surface-soft text-text-secondary hover:text-ink font-semibold text-xs border border-border transition-colors shadow-xs"
            >
              <MaterialIcon name="help_outline" className="text-[16px]" />
              <span>Ask Professor</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Two-Column Detailed Review: Student Submission vs. Explainable Rubric */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: Student Submitted Response & Interactive Concept Highlighting (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Prompt Box */}
          <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-text-secondary font-semibold">
              Assigned Question Prompt
            </span>
            <p className="text-xs md:text-sm text-ink font-medium leading-relaxed">
              {currentQ?.prompt}
            </p>
          </div>

          {/* Student Submission Transcript */}
          <div className="bg-surface rounded-2xl p-5 md:p-6 border border-border shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h3 className="font-title-sm text-base font-bold text-ink">Your Submitted Response</h3>
                <span className="text-xs text-text-secondary">Word Count: 242 words · On-time submission</span>
              </div>

              {/* Concept Highlighting Filter */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveHighlight('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeHighlight === 'all'
                      ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                      : 'bg-surface-soft text-text-secondary'
                  }`}
                >
                  All Tags
                </button>
                <button
                  onClick={() => setActiveHighlight('mastered')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeHighlight === 'mastered'
                      ? 'bg-success/15 text-success border border-success/30'
                      : 'bg-surface-soft text-text-secondary'
                  }`}
                >
                  Awarded
                </button>
              </div>
            </div>

            <div className="bg-surface-soft p-4 md:p-5 rounded-xl border border-border text-xs md:text-sm text-ink leading-relaxed space-y-3 font-sans">
              <p>
                During high-frequency tetanic stimulation of Schaffer collaterals, repetitive glutamate release causes substantial activation of{' '}
                <mark className="bg-blue-pale text-on-primary-container px-1 py-0.5 rounded font-medium">
                  AMPA receptors
                </mark>
                . The resulting inward sodium flux produces a strong post-synaptic depolarization in the dendritic spine.
              </p>
              <p>
                This electrical change removes the{' '}
                <mark className="bg-blue-pale text-on-primary-container px-1 py-0.5 rounded font-medium">
                  voltage-dependent magnesium (Mg2+) ion block
                </mark>{' '}
                that obstructs the pore of NMDA receptors at resting membrane potentials (-70mV). Once relieved, extracellular{' '}
                <mark className="bg-blue-pale text-on-primary-container px-1 py-0.5 rounded font-medium">
                  calcium (Ca2+) flows rapidly
                </mark>{' '}
                into the post-synaptic density.
              </p>
              <p>
                Within the spine, Ca2+ binds to calmodulin, forming the Ca2+/calmodulin complex which binds to CaMKII (calcium/calmodulin-dependent protein kinase II). This induces{' '}
                <mark className="bg-blue-pale text-on-primary-container px-1 py-0.5 rounded font-medium">
                  autophosphorylation of CaMKII at Threonine-286
                </mark>
                , locking the kinase into an autonomously active conformation that persists even after calcium levels recede.
              </p>
              <p>
                CaMKII phosphorylates existing AMPA receptors (enhancing conductance) and facilitates trafficking and{' '}
                <mark className="bg-blue-pale text-on-primary-container px-1 py-0.5 rounded font-medium">
                  insertion of additional AMPA receptors
                </mark>{' '}
                into the postsynaptic membrane. Retrograde messengers like{' '}
                <mark className="bg-warning/20 text-warning px-1 py-0.5 rounded font-medium">
                  nitric oxide (NO) may also diffuse back to presynaptic terminals
                </mark>
                , though the precise mechanism of retrograde transport in this experiment remains partially debated.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Explainable Rubric Breakdown (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-title-sm text-sm font-semibold text-ink">Rubric Breakdown</span>
              <span className="text-xs text-text-secondary">Evaluated by Rubric Matrix</span>
            </div>

            <div className="flex flex-col gap-3">
              {currentAns?.criteriaScores.map(crit => (
                <div
                  key={crit.criterionId}
                  className="p-3.5 bg-surface-soft rounded-xl border border-border/80 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs md:text-sm text-ink">{crit.criterionName}</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface font-bold text-xs text-ink border border-border">
                      {crit.marks} / {crit.maxMarks} pts
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{crit.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formative Feedback Summary */}
          <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-3">
            <span className="font-title-sm text-sm font-semibold text-ink">Formative Feedback</span>

            <div>
              <span className="text-xs font-semibold text-success block mb-1">Demonstrated Strengths</span>
              <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                {currentAns?.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            {currentAns?.improvements && currentAns.improvements.length > 0 && (
              <div className="pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-warning block mb-1">Areas for Growth</span>
                <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                  {currentAns.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Formative AI Improvement Plan & Personalized Next Steps */}
      <div className="bg-blue-pale/50 rounded-2xl p-6 border border-blue-border shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <MaterialIcon name="lightbulb" className="text-gold-primary text-[20px]" />
              <h3 className="font-title-sm text-base font-bold text-ink">Personalized Study Recommendation</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Based on your response to Question 1, strengthening your understanding of soluble guanylyl cyclase (sGC) and presynaptic cGMP signaling will bridge the gap between electrophysiology and molecular biochemistry.
            </p>
          </div>

          <div className="p-3 bg-surface rounded-xl border border-border text-xs flex flex-col gap-1 shrink-0">
            <span className="font-semibold text-ink">Recommended Reading:</span>
            <span className="text-text-secondary">Principles of Neural Science (Kandel) · Ch. 67</span>
          </div>
        </div>
      </div>
    </div>
  );
};

