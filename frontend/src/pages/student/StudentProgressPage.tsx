import React from 'react';
import { MaterialIcon } from '../../components/common/MaterialIcon';

export const StudentProgressPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-[1400px] mx-auto pb-10">
      <div className="pb-6 border-b border-border/40 mb-6">
        <h1 className="font-headline-lg text-2xl md:text-4xl text-ink font-serif font-medium tracking-tight">
          Learning Progress & Competency Matrix
        </h1>
        <p className="font-body-md text-sm md:text-base text-text-secondary mt-1">
          Detailed cognitive domain tracking, continuous rubric growth, and mastery trajectory.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-surface rounded-2xl border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-title-sm text-base font-bold text-ink">Domain Competency Ratings</h2>
            <MaterialIcon name="insights" className="text-primary text-[20px]" />
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold text-ink">
                <span>Electrophysiology & Channel Kinetics</span>
                <span className="text-success">94%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-ink">
                <span>Molecular Intracellular Cascades</span>
                <span className="text-primary">88%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-ink">
                <span>Behavioral Experimental Design</span>
                <span className="text-primary">82%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-ink">
                <span>Retrograde & Synaptic Plasticity Tracing</span>
                <span className="text-warning">68%</span>
              </div>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface rounded-2xl border border-border shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="font-title-sm text-base font-bold text-ink">Longitudinal Grade Trajectory</h2>
            <MaterialIcon name="trending_up" className="text-success text-[20px]" />
          </div>

          <div className="p-4 bg-surface-soft rounded-xl border border-border text-xs flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Term Baseline (Week 1)</span>
              <span className="font-semibold text-ink">76.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Midterm Examination (Week 8)</span>
              <span className="font-semibold text-success">88.2% (+12.2% gain)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">Projected Final Standing</span>
              <span className="font-semibold text-primary">Honours Distinction</span>
            </div>
          </div>

          <div className="p-4 bg-blue-pale/50 rounded-xl border border-blue-border text-xs text-ink leading-relaxed">
            <span className="font-semibold block mb-1">Faculty Advisor Recommendation:</span>
            Julian demonstrates consistent acceleration in analytical syntheses. Continued focus on experimental control protocols will position him well for the senior honours thesis.
          </div>
        </div>
      </div>
    </div>
  );
};

