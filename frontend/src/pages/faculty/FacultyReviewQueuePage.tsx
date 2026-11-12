import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const FacultyReviewQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { submissions, setCurrentStudentId, acceptAiMarks, markSubmissionReviewed, showToast } = useGradeX();

  const [activeFilter, setActiveFilter] = useState<'all' | 'low-conf' | 'borderline' | 'reviewed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const flaggedList = submissions.filter(s => {
    if (activeFilter === 'reviewed') return s.reviewed;
    if (activeFilter === 'low-conf') return s.confidenceScore < 80 && !s.reviewed;
    if (activeFilter === 'borderline') return s.status === 'Flagged';
    return !s.reviewed || s.status === 'Needs Review' || s.status === 'Flagged';
  });

  const filteredSubmissions = flaggedList.filter(
    s =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenWorkspace = (studentId: string) => {
    setCurrentStudentId(studentId);
    navigate('/faculty/grading');
  };

  const handleBatchApprove = () => {
    submissions
      .filter(s => s.confidenceScore >= 80 && !s.reviewed)
      .forEach(s => acceptAiMarks(s.studentId));
    showToast('Batch approved all high-confidence (>80%) evaluations', 'success');
  };

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Breadcrumb & Workspace Header Area */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center gap-2 text-text-secondary font-label-md text-xs">
          <span>Assessments</span>
          <MaterialIcon name="chevron_right" className="text-[14px]" />
          <span className="text-ink font-medium">COG-302 Neural Mechanisms</span>
          <MaterialIcon name="chevron_right" className="text-[14px]" />
          <span className="text-primary font-semibold px-2.5 py-0.5 bg-blue-pale rounded-full">Review Queue</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-headline-lg text-2xl md:text-4xl text-ink font-serif tracking-tight font-medium">
              Review Queue
            </h1>
            <p className="font-body-md text-sm md:text-base text-text-secondary mt-1.5 leading-relaxed">
              Student submissions flagged for professor review due to borderline scores, ambiguous terminology, or low evaluation confidence.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => showToast('Exporting verification audit log (CSV)...', 'info')}
              className="px-4 py-2 rounded-xl bg-surface border border-border text-ink font-label-md text-xs md:text-sm hover:bg-surface-soft transition-all shadow-xs flex items-center gap-2"
            >
              <MaterialIcon name="file_download" className="text-[18px] text-text-secondary" />
              <span>Export Audit</span>
            </button>
            <button
              onClick={handleBatchApprove}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-deep text-white font-label-md text-xs md:text-sm font-semibold transition-all shadow-xs flex items-center gap-2"
            >
              <MaterialIcon name="done_all" className="text-[18px]" />
              <span>Batch Approve High-Conf (&gt;80%)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
              Flagged for Review
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-2xl md:text-3xl text-warning font-serif font-bold">
                {submissions.filter(s => !s.reviewed).length}
              </span>
              <span className="font-title-sm text-xs text-text-secondary">papers pending</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
            <MaterialIcon name="priority_high" className="text-[20px]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
              Avg. AI Confidence
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-2xl md:text-3xl text-ink font-serif font-bold">76.4%</span>
              <span className="font-title-sm text-xs text-primary font-medium">on flagged set</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-pale text-primary flex items-center justify-center">
            <MaterialIcon name="analytics" className="text-[20px]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
              Reviewed Today
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-2xl md:text-3xl text-success font-serif font-bold">
                {submissions.filter(s => s.reviewed).length}
              </span>
              <span className="font-title-sm text-xs text-success font-medium">confirmed</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <MaterialIcon name="task_alt" className="text-[20px]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">
              Est. Completion
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display-lg text-2xl md:text-3xl text-ink font-serif font-bold">~8 mins</span>
              <span className="font-title-sm text-xs text-text-secondary">for remaining</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-soft text-text-secondary flex items-center justify-center">
            <MaterialIcon name="timer" className="text-[20px]" />
          </div>
        </div>
      </div>

      {/* Primary Workspace Content (Bento Split: Main Queue 8-col + Governance Drawer 4-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Queue Left Column (8 of 12) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Queue Controls & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                    : 'bg-surface-soft text-text-secondary hover:text-ink'
                }`}
              >
                All Flagged
              </button>
              <button
                onClick={() => setActiveFilter('low-conf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'low-conf'
                    ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                    : 'bg-surface-soft text-text-secondary hover:text-ink'
                }`}
              >
                Low AI Confidence
              </button>
              <button
                onClick={() => setActiveFilter('borderline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'borderline'
                    ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                    : 'bg-surface-soft text-text-secondary hover:text-ink'
                }`}
              >
                Borderline Threshold
              </button>
              <button
                onClick={() => setActiveFilter('reviewed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === 'reviewed'
                    ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                    : 'bg-surface-soft text-text-secondary hover:text-ink'
                }`}
              >
                Completed Reviews
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <MaterialIcon name="search" className="absolute left-3 top-2.5 text-text-secondary text-[18px]" />
              <input
                type="text"
                placeholder="Search student or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-surface-soft text-ink text-xs rounded-xl pl-9 pr-3 py-2 border border-border focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Flagged Submissions Review Cards List */}
          <div className="flex flex-col gap-4">
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center bg-surface rounded-2xl border border-border">
                <MaterialIcon name="verified" className="text-success text-[36px] mb-2" />
                <p className="font-semibold text-ink text-sm">No submissions in this filter category.</p>
                <p className="text-xs text-text-secondary mt-1">All items in this section have been resolved.</p>
              </div>
            ) : (
              filteredSubmissions.map(sub => (
                <div
                  key={sub.id}
                  className="bg-surface rounded-2xl p-5 md:p-6 border border-border/80 shadow-xs hover:shadow-md transition-all flex flex-col gap-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-pale text-primary font-bold flex items-center justify-center shrink-0 text-sm border border-blue-border">
                        {sub.studentName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-title-sm text-sm font-semibold text-ink">{sub.studentName}</span>
                          <span className="font-mono text-xs text-text-secondary px-2 py-0.5 rounded bg-surface-soft">
                            {sub.studentId}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              sub.confidenceScore >= 80
                                ? 'bg-success/15 text-success'
                                : 'bg-warning/15 text-warning'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                sub.confidenceScore >= 80 ? 'bg-success' : 'bg-warning'
                              }`}
                            ></span>
                            {sub.confidenceScore}% Confidence
                          </span>
                        </div>

                        {/* Note / Flag reason */}
                        <div className="mt-2 text-xs text-ink leading-relaxed bg-surface-soft p-3 rounded-xl border border-border/60">
                          <span className="font-semibold text-text-secondary">Evaluation Flag: </span>
                          <span className="italic">{sub.flagReason || 'Requires manual secondary rubric verification.'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold font-serif text-ink">
                          {sub.totalFacultyMarks ?? sub.totalAiMarks}
                        </span>
                        <span className="text-xs text-text-secondary">/ {sub.maxPossibleMarks} pts</span>
                      </div>
                      <span className="text-[11px] text-text-secondary">{sub.submittedAt}</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <span className="text-[11px] text-text-secondary">
                      Question 1: Biophysical basis of LTP · Schaffer Collaterals
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => acceptAiMarks(sub.studentId)}
                        className="px-3 py-1.5 rounded-lg bg-surface text-ink hover:bg-surface-soft border border-border text-xs font-semibold transition-colors"
                      >
                        Quick Approve
                      </button>
                      <button
                        onClick={() => handleOpenWorkspace(sub.studentId)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-blue-deep text-white text-xs font-semibold transition-all shadow-xs"
                      >
                        <MaterialIcon name="open_in_new" className="text-[14px]" />
                        <span>Open Workspace</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Faculty Governance & Audit Trail Panel (4 of 12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Profile & Moderation Authority */}
          <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-deep/20 text-primary flex items-center justify-center font-bold text-base border border-blue-border">
                EV
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-ink truncate">Prof. Eleanor Vance</span>
                <span className="text-xs text-text-secondary truncate">Lead Assessor · Cognitive Neuroscience</span>
              </div>
            </div>

            <div className="p-3 bg-surface-soft rounded-xl border border-border text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Confidence Floor</span>
                <span className="font-semibold text-ink">80.0% Minimum</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Oversight Standard</span>
                <span className="font-semibold text-success">FERPA Tier-1 Verified</span>
              </div>
            </div>
          </div>

          {/* Real-time Review Audit Trail */}
          <div className="bg-surface rounded-2xl p-5 border border-border shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-title-sm text-sm font-semibold text-ink">Recent Audit Trail</span>
              <MaterialIcon name="history" className="text-text-secondary text-[18px]" />
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-start gap-2.5 pb-2 border-b border-border/40">
                <span className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0"></span>
                <div className="flex flex-col">
                  <span className="font-medium text-ink">Prof. Vance approved Maya Lin</span>
                  <span className="text-[11px] text-text-secondary">47.0/50 pts · High confidence verification</span>
                  <span className="text-[10px] text-text-secondary font-mono mt-0.5">Today, 15:42</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2 border-b border-border/40">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <div className="flex flex-col">
                  <span className="font-medium text-ink">Score Override on Julian Vance</span>
                  <span className="text-[11px] text-text-secondary">Q1 adjusted to 13.5 pts (+1.0 pt)</span>
                  <span className="text-[10px] text-text-secondary font-mono mt-0.5">Today, 14:50</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0"></span>
                <div className="flex flex-col">
                  <span className="font-medium text-ink">AI Flagged David Kim</span>
                  <span className="text-[11px] text-text-secondary">AMPA/NMDA receptor trafficking conflict</span>
                  <span className="text-[10px] text-text-secondary font-mono mt-0.5">Today, 13:12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

