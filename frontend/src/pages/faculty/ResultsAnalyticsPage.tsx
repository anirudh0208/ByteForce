import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const ResultsAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { analytics, currentAssessment, setCurrentStudentId, showToast } = useGradeX();
  const [selectedCohort, setSelectedCohort] = useState('COG-302');

  const handleOpenStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
    navigate('/faculty/grading');
  };

  const handlePublishAll = () => {
    showToast('All evaluated scores & rubric feedback officially published to student portals!', 'success');
  };

  const handleExport = () => {
    showToast('Exported institutional gradebook & item-analysis report (CSV)', 'info');
  };

  return (
    <div className="flex flex-col w-full gap-8 pb-10">
      {/* Executive Header Banner */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 bg-surface p-6 md:p-8 rounded-2xl border border-border shadow-xs">
        <div className="flex flex-col gap-2.5 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-blue-pale text-on-primary-container font-label-sm text-xs uppercase tracking-wider font-semibold">
              Class Performance Report
            </span>
            <span className="text-text-secondary font-label-md text-xs">Ref: COG-302 · Fall 2026</span>
          </div>
          <h1 className="font-headline-lg text-2xl md:text-4xl text-ink font-serif tracking-tight font-medium">
            Results & Analytics
          </h1>
          <p className="font-body-md text-sm md:text-base text-text-secondary">
            Comprehensive overview of cohort score distribution, rubric item difficulty, and formative intervention targets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={selectedCohort}
              onChange={e => setSelectedCohort(e.target.value)}
              className="appearance-none bg-surface-soft text-ink font-title-sm text-xs md:text-sm pl-4 pr-10 py-2.5 rounded-xl cursor-pointer border border-border shadow-xs focus:outline-none focus:border-primary"
            >
              <option value="COG-302">COG-302: Neural Mechanisms (48 Students)</option>
              <option value="BIO-410">BIO-410: Synaptic Biophysics (36 Students)</option>
              <option value="NEUR-201">NEUR-201: Cellular Neuroscience (52 Students)</option>
            </select>
            <MaterialIcon
              name="expand_more"
              className="absolute right-3 top-2.5 text-text-secondary text-[20px] pointer-events-none"
            />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface text-ink hover:bg-surface-soft rounded-xl font-title-sm text-xs md:text-sm border border-border shadow-xs transition-colors"
          >
            <MaterialIcon name="download" className="text-[18px]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePublishAll}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:bg-blue-deep rounded-xl font-title-sm text-xs md:text-sm font-semibold transition-all shadow-md"
          >
            <MaterialIcon name="send" className="text-[18px]" />
            <span>Publish All Grades</span>
          </button>
        </div>
      </div>

      {/* Class Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs uppercase tracking-wider font-semibold">Cohort Average</span>
            <MaterialIcon name="trending_up" className="text-primary text-[20px]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display-lg text-3xl font-serif font-bold text-ink">
              {analytics.classAverage}%
            </span>
            <span className="text-xs text-success font-semibold">39.2 / 50 pts</span>
          </div>
          <span className="text-[11px] text-text-secondary mt-1">Median: {analytics.medianScore}%</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs uppercase tracking-wider font-semibold">Score Range</span>
            <MaterialIcon name="swap_vert" className="text-gold-primary text-[20px]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display-lg text-3xl font-serif font-bold text-ink">
              {analytics.lowestScore} – {analytics.highestScore}
            </span>
            <span className="text-xs text-text-secondary">pts</span>
          </div>
          <span className="text-[11px] text-text-secondary mt-1">High: Maya Lin (47.0 pts)</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs uppercase tracking-wider font-semibold">Standard Deviation</span>
            <MaterialIcon name="show_chart" className="text-primary text-[20px]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display-lg text-3xl font-serif font-bold text-ink">
              ±{analytics.standardDeviation}
            </span>
            <span className="text-xs text-text-secondary">pts</span>
          </div>
          <span className="text-[11px] text-text-secondary mt-1">Normal bell distribution</span>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-secondary">
            <span className="text-xs uppercase tracking-wider font-semibold">AI Grading Efficiency</span>
            <MaterialIcon name="bolt" className="text-success text-[20px]" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display-lg text-3xl font-serif font-bold text-ink">
              100%
            </span>
            <span className="text-xs text-success font-semibold">Evaluated</span>
          </div>
          <span className="text-[11px] text-text-secondary mt-1">48 papers in 58 seconds</span>
        </div>
      </div>

      {/* Grade Distribution & Question Summary (2 Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Grade Distribution Histogram */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div>
              <h2 className="font-headline-sm text-xl font-bold text-ink">Grade Distribution</h2>
              <span className="text-xs text-text-secondary">Student marks clustered across score tiers</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-blue-deep"></span>
                <span>Student Count</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold-primary"></span>
                <span>Class Median (80.5%)</span>
              </div>
            </div>
          </div>

          {/* Clean Histogram Visualizer */}
          <div className="relative w-full bg-surface-soft rounded-xl p-6 flex flex-col justify-end">
            <div className="grid grid-cols-5 h-52 items-end gap-4 px-2">
              {analytics.gradeDistribution.map((tier, idx) => {
                // Height percentage normalized
                const maxCount = 20;
                const heightPct = Math.round((tier.count / maxCount) * 100);
                const isHighest = tier.count === 18;

                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end">
                    <span className="text-xs text-ink mb-1.5 font-bold">{tier.count}</span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-90 ${
                        isHighest ? 'bg-blue-deep' : 'bg-primary/70'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    ></div>
                    <span className="text-[11px] text-text-secondary mt-3 font-semibold text-center">
                      {tier.grade.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-text-secondary font-mono">{tier.range}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Question Summary & Difficulty Index */}
        <div className="lg:col-span-5 bg-surface rounded-2xl p-6 border border-border shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
            <div>
              <h2 className="font-headline-sm text-xl font-bold text-ink">Question Summary</h2>
              <span className="text-xs text-text-secondary">Item difficulty and success rates</span>
            </div>
            <span className="text-xs text-primary font-semibold">3 Exam Questions</span>
          </div>

          <div className="flex flex-col gap-4">
            {analytics.questionPerformance.map(qp => (
              <div key={qp.questionNumber} className="p-3.5 bg-surface-soft rounded-xl border border-border flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-blue-pale text-primary font-bold text-xs flex items-center justify-center">
                      Q{qp.questionNumber}
                    </span>
                    <span className="font-semibold text-xs text-ink">{qp.title}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      qp.difficulty === 'Challenging'
                        ? 'bg-danger/10 text-danger'
                        : qp.difficulty === 'Moderate'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-success/10 text-success'
                    }`}
                  >
                    {qp.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>
                    Avg: <strong className="text-ink">{qp.averageMarks}</strong> / {qp.maxMarks} pts
                  </span>
                  <span className="font-semibold text-ink">{qp.successRate}% Success</span>
                </div>

                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${qp.successRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Formative Insights: Difficult Concepts & Students Needing Support */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Concepts Students Found Difficult (6 cols) */}
        <div className="lg:col-span-6 bg-surface rounded-2xl p-6 border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MaterialIcon name="psychology_alt" className="text-warning text-[22px]" />
              <h3 className="font-title-sm text-base font-bold text-ink">
                Concepts Students Found Difficult
              </h3>
            </div>
            <span className="text-xs text-text-secondary">AI Diagnostic</span>
          </div>

          <div className="flex flex-col gap-3">
            {analytics.difficultConcepts.map((dc, i) => (
              <div key={i} className="p-3.5 bg-surface-soft rounded-xl border border-border/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink">{dc.concept}</span>
                  <span className="font-bold text-danger">{dc.missedPercentage}% Omission</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-danger rounded-full"
                    style={{ width: `${dc.missedPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-secondary mt-0.5">
                  <span>Topic: {dc.topic}</span>
                  <span>{dc.affectedStudents} students impacted</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Who May Need Support (6 cols) */}
        <div className="lg:col-span-6 bg-surface rounded-2xl p-6 border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MaterialIcon name="support_agent" className="text-primary text-[22px]" />
              <h3 className="font-title-sm text-base font-bold text-ink">
                Students Who May Need Support
              </h3>
            </div>
            <span className="text-xs text-text-secondary">Proactive Intervention</span>
          </div>

          <div className="flex flex-col gap-3">
            {analytics.studentsNeedingSupport.map(stu => (
              <div
                key={stu.studentId}
                className="p-3.5 bg-surface-soft rounded-xl border border-border flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-pale text-primary font-bold flex items-center justify-center text-xs">
                    {stu.studentName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-ink">{stu.studentName}</span>
                    <span className="text-[11px] text-text-secondary">
                      Score: {stu.score}% • Gap: {stu.gapArea}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenStudent(stu.studentId)}
                    className="px-3 py-1.5 bg-surface hover:bg-surface-container-high text-ink rounded-lg text-xs font-semibold border border-border shadow-xs transition-colors"
                  >
                    Inspect
                  </button>
                  <button
                    onClick={() => showToast(`Study guide dispatched to ${stu.studentName}`, 'info')}
                    className="p-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs transition-colors"
                    title="Send Targeted Remediation"
                  >
                    <MaterialIcon name="send" className="text-[16px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

