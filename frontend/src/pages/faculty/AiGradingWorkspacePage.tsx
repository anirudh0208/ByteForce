import React, { useState } from 'react';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const AiGradingWorkspacePage: React.FC = () => {
  const {
    currentAssessment,
    submissions,
    currentStudentId,
    setCurrentStudentId,
    currentSubmission,
    updateCriterionMarks,
    acceptAiMarks,
    flagSubmission,
    markSubmissionReviewed,
    showToast
  } = useGradeX();

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [highlightMode, setHighlightMode] = useState<'all' | 'correct' | 'missing'>('all');
  const [facultyNotes, setFacultyNotes] = useState('');

  const currentQuestion = currentAssessment.questions[selectedQuestionIndex] || currentAssessment.questions[0];

  // Current submission answer for this question
  const currentAnswer =
    currentSubmission?.answers.find(a => a.questionId === currentQuestion?.id) ||
    currentSubmission?.answers[0];

  const currentStudentIdx = submissions.findIndex(s => s.studentId === currentStudentId);

  const handlePrevStudent = () => {
    if (currentStudentIdx > 0) {
      setCurrentStudentId(submissions[currentStudentIdx - 1].studentId);
    } else {
      setCurrentStudentId(submissions[submissions.length - 1].studentId);
    }
  };

  const handleNextStudent = () => {
    if (currentStudentIdx < submissions.length - 1) {
      setCurrentStudentId(submissions[currentStudentIdx + 1].studentId);
    } else {
      setCurrentStudentId(submissions[0].studentId);
    }
  };

  const currentQMarks = currentAnswer?.facultyMarks ?? currentAnswer?.aiMarks ?? 0;
  const currentTotalMarks =
    currentSubmission?.totalFacultyMarks ?? currentSubmission?.totalAiMarks ?? 0;

  return (
    <div className="flex flex-col w-full pb-8">
      {/* TOP CONTEXTUAL SUB-BAR */}
      <div className="w-full bg-surface rounded-2xl shadow-xs border border-border px-4 md:px-6 py-4 mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Student Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="font-label-sm uppercase tracking-wider text-text-secondary">
              {currentAssessment.code}
            </span>
            <span className="text-text-secondary/40">/</span>
            <span className="font-semibold text-ink">{currentAssessment.title}</span>
            <span className="text-text-secondary/40">/</span>
            <span className="text-text-secondary">Grading Pipeline</span>
          </div>

          <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block"></div>

          {/* Student Selector */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-deep/20 text-primary font-bold flex items-center justify-center text-xs border border-blue-border">
              {currentSubmission?.studentName.charAt(0)}
            </div>
            <select
              value={currentStudentId}
              onChange={e => setCurrentStudentId(e.target.value)}
              className="bg-surface-soft border border-border rounded-lg px-2.5 py-1 text-xs md:text-sm font-semibold text-ink focus:outline-none cursor-pointer"
            >
              {submissions.map(s => (
                <option key={s.studentId} value={s.studentId}>
                  {s.studentName} ({s.studentId}) — Score: {s.totalFacultyMarks ?? s.totalAiMarks}/{s.maxPossibleMarks}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Question Tabs & Prev/Next Nav */}
        <div className="flex items-center justify-between xl:justify-end gap-3 flex-wrap">
          {/* Question Selector Tabs */}
          <div className="flex items-center gap-1 bg-surface-soft p-1 rounded-xl border border-border">
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

          {/* Student Next/Prev Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-secondary mr-1">
              Student {currentStudentIdx + 1} of {submissions.length}
            </span>
            <button
              onClick={handlePrevStudent}
              className="p-1.5 rounded-lg bg-surface-soft hover:bg-surface-container-high border border-border text-ink transition-colors"
              title="Previous Student"
            >
              <MaterialIcon name="chevron_left" className="text-[20px]" />
            </button>
            <button
              onClick={handleNextStudent}
              className="p-1.5 rounded-lg bg-surface-soft hover:bg-surface-container-high border border-border text-ink transition-colors"
              title="Next Student"
            >
              <MaterialIcon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>

      {/* FLAGSHIP THREE-PANEL ACADEMIC WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PANEL 1 (LEFT ~28%): Question & Reference Anchor */}
        <section className="lg:col-span-4 xl:col-span-3 bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="font-label-sm text-[11px] text-text-secondary uppercase tracking-wider block">
                Question {currentQuestion?.number} · Analytical
              </span>
              <h2 className="font-headline-sm text-lg md:text-xl font-bold text-ink mt-0.5">
                Prompt & Benchmark
              </h2>
            </div>
            <span className="w-8 h-8 rounded-lg bg-surface-soft flex items-center justify-center text-text-secondary">
              <MaterialIcon name="menu_book" className="text-[20px]" />
            </span>
          </div>

          {/* Prompt */}
          <div className="space-y-1.5">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Assigned Prompt
            </span>
            <div className="bg-surface-soft p-3.5 rounded-xl border border-border/80 text-xs md:text-sm text-ink leading-relaxed">
              {currentQuestion?.prompt}
            </div>
          </div>

          {/* Benchmark Reference Answer */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                Gold Benchmark Answer
              </span>
              <span className="text-[10px] text-primary font-semibold">Faculty Calibrated</span>
            </div>
            <div className="bg-surface-soft p-3.5 rounded-xl border border-border/80 text-xs text-ink leading-relaxed max-h-60 overflow-y-auto">
              <p className="whitespace-pre-line">{currentQuestion?.benchmarkAnswer}</p>
            </div>
          </div>

          {/* Rubric Criteria Summary */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Rubric Pillars ({currentQuestion?.criteria.length})
            </span>
            <div className="flex flex-col gap-2">
              {currentQuestion?.criteria.map((crit, idx) => (
                <div key={crit.id} className="p-2.5 bg-surface-soft rounded-lg border border-border/60 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-ink">{crit.name}</span>
                    <span className="font-bold text-primary">{crit.maxMarks} pts</span>
                  </div>
                  <p className="text-[11px] text-text-secondary line-clamp-2">{crit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PANEL 2 (CENTRE ~42%): Student Submission Document & Semantic Overlays */}
        <section className="lg:col-span-8 xl:col-span-5 bg-surface rounded-2xl p-5 md:p-6 border border-border shadow-xs flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-lg md:text-xl font-bold text-ink">Student Submission</h3>
                <span className="font-label-sm text-xs text-text-secondary">· Question {currentQuestion?.number}</span>
              </div>
              <p className="font-body-sm text-xs text-text-secondary">
                Submitted {currentSubmission?.submittedAt} · OCR Parsed with 99.4% confidence
              </p>
            </div>

            {/* Filter tags */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setHighlightMode('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  highlightMode === 'all'
                    ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                    : 'bg-surface-soft text-text-secondary'
                }`}
              >
                All Concepts
              </button>
              <button
                onClick={() => setHighlightMode('correct')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  highlightMode === 'correct'
                    ? 'bg-success/15 text-success border border-success/30'
                    : 'bg-surface-soft text-text-secondary'
                }`}
              >
                Matched
              </button>
            </div>
          </div>

          {/* Student Answer Body */}
          <div className="bg-surface-soft rounded-xl p-4 md:p-5 border border-border text-xs md:text-sm text-ink leading-relaxed min-h-[380px] font-sans">
            {currentAnswer ? (
              <div className="space-y-4">
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
            ) : (
              <p className="italic text-text-secondary">No submission answer logged for this question item.</p>
            )}
          </div>

          {/* Semantic Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-surface-container-low rounded-xl border border-border text-[11px] text-text-secondary">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-deep"></span>
                <span>Rubric Aligned Anchor</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-warning"></span>
                <span>Requires Verification</span>
              </span>
            </div>
            <span className="font-mono">242 words · ~1.8 min reading time</span>
          </div>

          {/* Faculty Internal Annotation */}
          <div className="space-y-1.5">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
              Faculty Private Note / Annotation
            </span>
            <input
              type="text"
              placeholder="Add personal grading comment or moderation remark..."
              value={facultyNotes}
              onChange={e => setFacultyNotes(e.target.value)}
              className="w-full bg-surface-soft text-xs text-ink rounded-lg px-3 py-2 border border-border focus:outline-none focus:border-primary"
            />
          </div>
        </section>

        {/* PANEL 3 (RIGHT ~30%): AI Evaluation, Detailed Rubric & Sticky Actions */}
        <section className="lg:col-span-12 xl:col-span-4 flex flex-col gap-5">
          {/* Score & Confidence Overview Card */}
          <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-text-secondary font-semibold">
                  Evaluated Question Score
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-display-lg text-3xl md:text-4xl text-ink font-serif font-bold">
                    {currentQMarks}
                  </span>
                  <span className="font-headline-sm text-lg text-text-secondary font-serif">
                    / {currentQuestion?.maxMarks} pts
                  </span>
                </div>
              </div>

              {/* Confidence badge */}
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    (currentSubmission?.confidenceScore ?? 0) >= 80
                      ? 'bg-success/15 text-success'
                      : 'bg-warning/15 text-warning'
                  }`}
                >
                  <MaterialIcon
                    name={(currentSubmission?.confidenceScore ?? 0) >= 80 ? 'verified' : 'help'}
                    className="text-[16px]"
                  />
                  <span>{currentSubmission?.confidenceScore}% Confidence</span>
                </span>
                <span className="text-[10px] text-text-secondary block mt-1">
                  Total Assessment: {currentTotalMarks} / {currentAssessment.totalMarks}
                </span>
              </div>
            </div>

            {/* Warning Callout if flagged or low confidence */}
            {currentSubmission?.flagReason && (
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-xs text-ink flex items-start gap-2">
                <MaterialIcon name="warning" className="text-warning text-[18px] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-warning">Flagged by Evaluation Filter</span>
                  <p className="text-text-secondary leading-tight">{currentSubmission.flagReason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Granular Rubric Criteria Breakdown (EDITABLE) */}
          <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-title-sm text-sm font-semibold text-ink">Rubric Breakdown</span>
              <span className="text-xs text-text-secondary font-medium">Click score to override</span>
            </div>

            <div className="flex flex-col gap-3">
              {currentAnswer?.criteriaScores.map(crit => (
                <div
                  key={crit.criterionId}
                  className="p-3 bg-surface-soft rounded-xl border border-border/80 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-ink">{crit.criterionName}</span>
                    {/* Interactive Score Stepper / Override Input */}
                    <div className="flex items-center gap-1.5 bg-surface px-2 py-1 rounded-lg border border-border shadow-xs">
                      <button
                        onClick={() =>
                          updateCriterionMarks(
                            currentStudentId,
                            currentQuestion.id,
                            crit.criterionId,
                            crit.marks - 0.5
                          )
                        }
                        className="w-5 h-5 flex items-center justify-center rounded text-text-secondary hover:text-ink hover:bg-surface-soft text-sm font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max={crit.maxMarks}
                        value={crit.marks}
                        onChange={e =>
                          updateCriterionMarks(
                            currentStudentId,
                            currentQuestion.id,
                            crit.criterionId,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-8 text-center text-xs font-bold text-ink bg-transparent focus:outline-none"
                      />
                      <button
                        onClick={() =>
                          updateCriterionMarks(
                            currentStudentId,
                            currentQuestion.id,
                            crit.criterionId,
                            crit.marks + 0.5
                          )
                        }
                        className="w-5 h-5 flex items-center justify-center rounded text-text-secondary hover:text-ink hover:bg-surface-soft text-sm font-bold"
                      >
                        +
                      </button>
                      <span className="text-[10px] text-text-secondary">/ {crit.maxMarks}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug">{crit.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formative Feedback & Concept Mapping */}
          <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-3">
            <span className="font-title-sm text-sm font-semibold text-ink">Concept Mapping</span>

            <div>
              <span className="text-[11px] font-semibold text-success block mb-1.5 uppercase tracking-wide">
                Demonstrated Concepts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentAnswer?.correctConcepts.map((cc, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-success/10 text-success text-[11px] font-medium border border-success/20"
                  >
                    {cc}
                  </span>
                ))}
              </div>
            </div>

            {currentAnswer?.missingConcepts && currentAnswer.missingConcepts.length > 0 && (
              <div className="pt-2 border-t border-border/60">
                <span className="text-[11px] font-semibold text-danger block mb-1.5 uppercase tracking-wide">
                  Gaps / Omissions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentAnswer.missingConcepts.map((mc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-danger/10 text-danger text-[11px] font-medium border border-danger/20"
                    >
                      {mc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Faculty Action Buttons */}
          <div className="bg-surface rounded-2xl p-4 border border-border shadow-md flex flex-col gap-2.5">
            <button
              onClick={() => acceptAiMarks(currentStudentId)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white hover:bg-blue-deep rounded-xl font-semibold text-xs md:text-sm transition-all shadow-sm"
            >
              <MaterialIcon name="check_circle" className="text-[18px]" />
              <span>Accept AI Marks ({currentTotalMarks} pts)</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => flagSubmission(currentStudentId)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  currentSubmission?.status === 'Flagged'
                    ? 'bg-warning text-white border-warning'
                    : 'bg-surface-soft text-warning hover:bg-warning/10 border-border'
                }`}
              >
                <MaterialIcon name="flag" className="text-[16px]" />
                <span>{currentSubmission?.status === 'Flagged' ? 'Unflag' : 'Flag for Review'}</span>
              </button>

              <button
                onClick={() => {
                  markSubmissionReviewed(currentStudentId);
                  handleNextStudent();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-soft hover:bg-surface-container-high text-ink border border-border text-xs font-semibold transition-all"
              >
                <MaterialIcon name="arrow_forward" className="text-[16px]" />
                <span>Next Student</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

