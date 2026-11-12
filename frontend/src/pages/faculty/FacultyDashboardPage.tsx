import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const FacultyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { assessments, submissions, setCurrentStudentId, showToast } = useGradeX();

  const pendingSubmissions = submissions.filter(s => s.status === 'Needs Review' || s.status === 'Flagged');

  const handleOpenStudentGrading = (studentId: string) => {
    setCurrentStudentId(studentId);
    navigate('/faculty/grading');
  };

  return (
    <div className="w-full rounded-2xl bg-surface border border-border min-h-[calc(100vh-134px)] p-4 md:p-6 shadow-[0_4px_20px_-2px_rgba(39,37,34,0.04)]">
      <div className="flex flex-col w-full">
        {/* Top Greeting & Executive Actions Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-border/40">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="font-headline-lg text-2xl md:text-4xl text-ink tracking-tight font-serif font-medium">
              Good morning, Professor Vance
            </h1>
            <p className="font-body-md text-sm md:text-base text-text-secondary leading-relaxed">
              Automated grading status, rubric calibrations, and priority verification queues for Fall 2026.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => showToast('Exported institutional grading audit log (CSV)', 'info')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-soft text-ink font-title-sm text-xs md:text-sm transition-colors shadow-xs"
            >
              <MaterialIcon name="file_download" className="text-[18px] text-text-secondary" />
              <span>Export Log</span>
            </button>
            <button
              onClick={() => navigate('/faculty/assessments/create')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-deep hover:bg-primary text-white font-title-sm text-xs md:text-sm transition-all shadow-sm"
            >
              <MaterialIcon name="add" className="text-[18px]" />
              <span>Create Assessment</span>
            </button>
          </div>
        </div>

        {/* KPI Overview Stat Cards (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 my-8">
          <div className="rounded-2xl bg-surface p-6 border border-border flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
                  Active Assessments
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-display-lg text-3xl md:text-4xl text-ink font-serif font-normal">
                    {assessments.length}
                  </span>
                  <span className="font-title-sm text-xs text-primary font-medium">Active</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center text-primary">
                <MaterialIcon name="auto_stories" className="text-[20px]" />
              </div>
            </div>
            <div className="pt-4 mt-2 text-text-secondary font-body-sm text-xs border-t border-border/40">
              3 department cohorts
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-6 border border-border flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
                  Total Submissions
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-display-lg text-3xl md:text-4xl text-ink font-serif font-normal">162</span>
                  <span className="font-title-sm text-xs text-success font-medium">96.4% received</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center text-success">
                <MaterialIcon name="cloud_done" className="text-[20px]" />
              </div>
            </div>
            <div className="pt-4 mt-2 text-text-secondary font-body-sm text-xs border-t border-border/40">
              +48 from COG-302 midterm
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-6 border border-border flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
                  Avg. AI Grading Speed
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-display-lg text-3xl md:text-4xl text-ink font-serif font-normal">1.2s</span>
                  <span className="font-title-sm text-xs text-primary font-medium">per script</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-surface-soft flex items-center justify-center text-gold-primary">
                <MaterialIcon name="speed" className="text-[20px]" />
              </div>
            </div>
            <div className="pt-4 mt-2 text-text-secondary font-body-sm text-xs border-t border-border/40">
              Gemini 3.8 Multi-modal inference
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-6 border border-border flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
                  Pending Faculty Reviews
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-display-lg text-3xl md:text-4xl text-warning font-serif font-bold">
                    {pendingSubmissions.length}
                  </span>
                  <span className="font-title-sm text-xs text-warning font-medium">Needs Attention</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                <MaterialIcon name="rate_review" className="text-[20px]" />
              </div>
            </div>
            <div className="pt-4 mt-2 text-text-secondary font-body-sm text-xs border-t border-border/40">
              Low confidence & borderline scores
            </div>
          </div>
        </div>

        {/* Main Workspace Grid: 70% Left Cohort & Stream / 30% Right Action & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN (Approx 70% -> col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* Section a: Active Assessment Cohorts & Grading Progress */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-xl md:text-2xl font-bold text-ink">
                    Active Assessment Cohorts
                  </h2>
                  <p className="font-body-sm text-xs text-text-secondary">
                    Course submissions, automated rubric progress, and review completion.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/faculty/submissions')}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View All Ingested</span>
                  <MaterialIcon name="arrow_forward" className="text-[14px]" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {assessments.map(asmt => {
                  const progressPct = Math.round((asmt.gradedCount / (asmt.submissionsCount || 1)) * 100);
                  return (
                    <div
                      key={asmt.id}
                      className="bg-surface-soft p-5 rounded-2xl border border-border flex flex-col gap-4 hover:border-blue-border transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-pale text-primary font-bold flex items-center justify-center text-xs">
                            {asmt.code.split('-')[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-ink text-sm md:text-base">{asmt.title}</span>
                              <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-bold text-text-secondary">
                                {asmt.code}
                              </span>
                            </div>
                            <span className="text-xs text-text-secondary">{asmt.cohort}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              asmt.status === 'Completed'
                                ? 'bg-success/15 text-success'
                                : asmt.status === 'Grading'
                                ? 'bg-primary/15 text-primary'
                                : 'bg-warning/15 text-warning'
                            }`}
                          >
                            {asmt.status === 'Completed' ? '100% Graded' : 'Grading in Progress'}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs text-text-secondary font-medium">
                          <span>
                            Evaluation Progress ({asmt.gradedCount} of {asmt.submissionsCount} scripts graded)
                          </span>
                          <span className="font-bold text-ink">{progressPct}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-border/60 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                        <div className="flex items-center gap-4 text-text-secondary">
                          <span>Due: {asmt.dueDate}</span>
                          <span>·</span>
                          <span>Total Score: {asmt.totalMarks} pts</span>
                          <span>·</span>
                          <span className="text-warning font-semibold">{asmt.pendingReviewCount} Flagged</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate('/faculty/submissions')}
                            className="px-3 py-1.5 rounded-lg bg-surface text-ink hover:bg-surface-container-high border border-border font-semibold text-xs transition-colors"
                          >
                            Submissions
                          </button>
                          <button
                            onClick={() => navigate('/faculty/grading')}
                            className="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-blue-deep font-semibold text-xs transition-colors shadow-xs"
                          >
                            Open Grading
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section b: Recent AI Grading Stream & Audit Feed */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline-sm text-xl md:text-2xl font-bold text-ink">
                    Recent AI Grading Stream
                  </h2>
                  <p className="font-body-sm text-xs text-text-secondary">
                    Real-time verification telemetry and confidence ratings.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/faculty/reviews')}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Open Full Queue</span>
                  <MaterialIcon name="arrow_forward" className="text-[14px]" />
                </button>
              </div>

              <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface shadow-xs">
                <table className="w-full text-left">
                  <thead className="bg-surface-soft text-text-secondary font-label-sm text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Assessment</th>
                      <th className="py-3 px-4">AI Score</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 text-xs md:text-sm text-ink">
                    {submissions.slice(0, 5).map(sub => (
                      <tr key={sub.id} className="hover:bg-surface-soft/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-pale text-primary font-bold flex items-center justify-center text-xs">
                              {sub.studentName.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">{sub.studentName}</span>
                              <span className="text-[11px] text-text-secondary">{sub.studentId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-text-secondary text-xs">{sub.assessmentTitle}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-ink">
                            {sub.totalFacultyMarks ?? sub.totalAiMarks} / {sub.maxPossibleMarks}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                sub.confidenceScore >= 85
                                  ? 'bg-success'
                                  : sub.confidenceScore >= 70
                                  ? 'bg-warning'
                                  : 'bg-danger'
                              }`}
                            ></span>
                            <span className="font-semibold text-xs">{sub.confidenceScore}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              sub.status === 'Graded'
                                ? 'bg-success/10 text-success'
                                : sub.status === 'Needs Review'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-danger/10 text-danger'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenStudentGrading(sub.studentId)}
                            className="px-2.5 py-1 bg-surface-soft hover:bg-primary hover:text-white rounded-lg text-xs font-semibold border border-border transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Approx 30% -> col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Section a: Faculty Review Priority Queue */}
            <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="priority_high" className="text-warning text-[20px]" />
                  <h3 className="font-title-sm text-sm font-semibold text-ink">Priority Review Queue</h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-warning/15 text-warning text-xs font-bold">
                  {pendingSubmissions.length} Pending
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                Scripts flagged for low confidence, conflicting statements, or borderline thresholds requiring human confirmation.
              </p>

              <div className="flex flex-col gap-2.5">
                {pendingSubmissions.slice(0, 3).map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleOpenStudentGrading(p.studentId)}
                    className="p-3 bg-surface-soft hover:bg-surface-container-high rounded-xl border border-border/80 cursor-pointer transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-ink">{p.studentName}</span>
                      <span className="text-[11px] font-bold text-warning">{p.confidenceScore}% conf</span>
                    </div>
                    <p className="text-[11px] text-text-secondary line-clamp-2 italic">
                      "{p.flagReason || 'Requires rubric verification.'}"
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/faculty/reviews')}
                className="w-full py-2 bg-blue-pale hover:bg-blue-primary/30 text-on-primary-container text-xs font-semibold rounded-xl border border-blue-border transition-colors text-center"
              >
                Inspect All Pending Reviews
              </button>
            </div>

            {/* Section b: Curricular Insights */}
            <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="lightbulb" className="text-gold-primary text-[20px]" />
                  <h3 className="font-title-sm text-sm font-semibold text-ink">Curricular Insights</h3>
                </div>
                <span className="text-[11px] text-text-secondary">COG-302</span>
              </div>

              <p className="text-xs text-text-secondary">
                Common conceptual blind spots detected across student cohort:
              </p>

              <div className="flex flex-col gap-3">
                <div className="p-3 bg-surface-soft rounded-xl border border-border">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-ink">Retrograde NO diffusion</span>
                    <span className="font-bold text-danger">42% missed</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-danger rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-[10px] text-text-secondary mt-1 block">
                    Confounded with endocannabinoid pathways
                  </span>
                </div>

                <div className="p-3 bg-surface-soft rounded-xl border border-border">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-ink">Visible platform control</span>
                    <span className="font-bold text-warning">35% missed</span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-[10px] text-text-secondary mt-1 block">
                    Omitted sensory/locomotor swim baselines
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/faculty/analytics')}
                className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1 pt-1"
              >
                <span>View Full Institutional Analytics</span>
                <MaterialIcon name="arrow_forward" className="text-[14px]" />
              </button>
            </div>

            {/* Section c: Academic Integrity & Human-in-the-Loop Oversight Badge */}
            <div className="p-4 rounded-2xl bg-blue-pale/40 border border-blue-border flex items-start gap-3">
              <MaterialIcon name="verified_user" className="text-primary text-[22px] shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-xs text-ink">Human-in-the-Loop Governance</span>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Final grade publication strictly requires faculty review. AI provides assisted rubric scoring, confidence estimation, and formative feedback generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

