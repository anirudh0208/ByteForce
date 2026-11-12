import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../../components/common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';
import { UploadedFile } from '../../types';

export const SubmissionsUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedFiles, addUploadedFiles, removeUploadedFile, clearUploadQueue, simulateUploadProcess, showToast } = useGradeX();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filter, setFilter] = useState<'all' | 'matched' | 'unmatched' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFiles(e.target.files);
    }
  };

  const processSelectedFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((f, i) => {
      const studentName = f.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      return {
        id: `upl-${Date.now()}-${i}`,
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.endsWith('.pdf') ? 'PDF' : 'DOCX',
        studentName: studentName.length > 20 ? studentName.substring(0, 18) + '...' : studentName,
        studentId: `STU-${8830 + i}`,
        status: 'ready',
        progress: 100,
        pages: Math.floor(Math.random() * 3) + 3,
        timestamp: 'Just now'
      };
    });

    addUploadedFiles(newFiles);
  };

  const handleStartGrading = () => {
    setIsProcessing(true);
    showToast('Initiating Gemini 3.8 parallel grading pipeline...', 'info');
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/faculty/grading');
    }, 1200);
  };

  // Filtered files
  const filteredFiles = uploadedFiles.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.studentName && f.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.studentId && f.studentId.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filter === 'matched') return f.studentId !== undefined;
    if (filter === 'unmatched') return f.studentId === undefined;
    if (filter === 'flagged') return f.status === 'error';
    return true;
  });

  return (
    <div className="w-full rounded-2xl bg-surface border border-border min-h-[calc(100vh-134px)] p-4 md:p-6 shadow-[0_4px_20px_-2px_rgba(39,37,34,0.04)]">
      <div className="flex flex-col w-full">
        {/* Top Context Header & Breadcrumbs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">Assessments</span>
              <span className="text-outline-variant font-label-sm">/</span>
              <span className="font-label-sm text-xs uppercase tracking-wider text-text-secondary">COG-302 Neural Mechanisms</span>
              <span className="text-outline-variant font-label-sm">/</span>
              <span className="font-label-sm text-xs uppercase tracking-wider text-primary font-semibold">Submissions</span>
            </div>
            <div className="flex items-baseline gap-4 flex-wrap">
              <h1 className="font-headline-lg text-2xl md:text-3xl text-ink font-bold tracking-tight">
                Upload Student Papers
              </h1>
              <span className="px-2.5 py-1 bg-surface-soft text-text-secondary rounded-full font-label-sm text-xs tracking-wide">
                Midterm Assessment · Fall 2026
              </span>
            </div>
          </div>

          {/* Assessment Selector Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none bg-surface-soft border border-border rounded-xl px-4 py-2.5 pr-10 text-xs md:text-sm font-title-sm font-semibold text-ink focus:outline-none focus:border-primary cursor-pointer shadow-xs">
                <option>COG-302: Neural Encoding & Synaptic Plasticity</option>
                <option>BIO-410: Advanced Synaptic Biophysics</option>
                <option>NEUR-201: Cellular Neuroscience Midterm</option>
              </select>
              <MaterialIcon name="expand_more" className="absolute right-3 top-3 text-text-secondary text-[20px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Interactive Drag-and-Drop Ingestion Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative w-full rounded-2xl border-2 border-dashed p-8 md:p-10 mb-8 text-center transition-all ${
            isDragging
              ? 'bg-blue-pale/40 border-primary scale-[1.005]'
              : 'bg-surface-container-low/40 border-border hover:border-blue-deep/50'
          }`}
        >
          <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-soft flex items-center justify-center text-primary mb-4 shadow-sm">
              <MaterialIcon name="upload_file" className="text-[32px]" />
            </div>
            <h2 className="font-headline-sm text-xl md:text-2xl font-bold text-ink mb-2">
              Drag and drop PDF or Word documents here
            </h2>
            <p className="font-body-sm text-xs md:text-sm text-text-secondary max-w-md mb-6 leading-relaxed">
              Upload individual student answer sheets, batch scanned exams, or zip archives. GradeX automatically extracts OCR text and reconciles student IDs with your institutional roster.
            </p>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-blue-deep hover:bg-primary text-white rounded-xl font-title-sm text-xs md:text-sm shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
              >
                <MaterialIcon name="folder_open" className="text-[18px]" />
                <span>Choose Files from Computer</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.jpg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <button
                onClick={() => {
                  simulateUploadProcess();
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-surface text-ink hover:bg-surface-soft rounded-xl font-title-sm text-xs md:text-sm border border-border shadow-xs transition-colors"
              >
                <MaterialIcon name="cloud_sync" className="text-[18px] text-primary" />
                <span>Simulate Roster Sync</span>
              </button>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border/40 text-text-secondary text-[11px] font-medium">
              <span className="flex items-center gap-1.5">
                <MaterialIcon name="check_circle" className="text-success text-[14px]" />
                <span>OCR Multi-column Parser Enabled</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MaterialIcon name="verified_user" className="text-primary text-[14px]" />
                <span>FERPA Compliant Privacy Filter</span>
              </span>
            </div>
          </div>
        </div>

        {/* Ingestion Insights Overview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-surface shadow-xs flex items-center gap-4 border border-border">
            <div className="w-12 h-12 rounded-xl bg-surface-soft text-ink flex items-center justify-center shrink-0">
              <MaterialIcon name="school" className="text-[24px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wide text-text-secondary">Roster Size</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-sm text-xl font-bold text-ink">52</span>
                <span className="font-label-sm text-xs text-text-secondary">enrolled</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface shadow-xs flex items-center gap-4 border border-border">
            <div className="w-12 h-12 rounded-xl bg-surface-soft text-success flex items-center justify-center shrink-0">
              <MaterialIcon name="check_circle" className="text-[24px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wide text-text-secondary">Matched to Roster</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-sm text-xl font-bold text-ink">{uploadedFiles.length}</span>
                <span className="font-label-sm text-xs text-success font-semibold">100% matched</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface shadow-xs flex items-center gap-4 border border-border">
            <div className="w-12 h-12 rounded-xl bg-surface-soft text-warning flex items-center justify-center shrink-0">
              <MaterialIcon name="help_outline" className="text-[24px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wide text-text-secondary">Needs Review</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-sm text-xl font-bold text-ink">3</span>
                <span className="font-label-sm text-xs text-text-secondary">low confidence</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface shadow-xs flex items-center gap-4 border border-border">
            <div className="w-12 h-12 rounded-xl bg-surface-soft text-primary flex items-center justify-center shrink-0">
              <MaterialIcon name="bolt" className="text-[24px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[11px] uppercase tracking-wide text-text-secondary">Est. Batch Speed</span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline-sm text-xl font-bold text-ink">~58s</span>
                <span className="font-label-sm text-xs text-text-secondary">for full cohort</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Row and Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                  : 'bg-surface-soft text-text-secondary hover:text-ink'
              }`}
            >
              All Submissions ({uploadedFiles.length})
            </button>
            <button
              onClick={() => setFilter('matched')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'matched'
                  ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                  : 'bg-surface-soft text-text-secondary hover:text-ink'
              }`}
            >
              Matched ({uploadedFiles.filter(f => f.studentId).length})
            </button>
            <button
              onClick={() => setFilter('flagged')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === 'flagged'
                  ? 'bg-blue-pale text-on-primary-container border border-blue-border'
                  : 'bg-surface-soft text-text-secondary hover:text-ink'
              }`}
            >
              Flagged for Review (3)
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <MaterialIcon name="search" className="absolute left-3 top-2.5 text-text-secondary text-[18px]" />
            <input
              type="text"
              placeholder="Search student or file..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface-soft text-ink text-xs rounded-xl pl-9 pr-3 py-2 border border-border focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Student Submissions Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-surface shadow-xs mb-6">
          <table className="w-full text-left">
            <thead className="bg-surface-soft text-text-secondary font-label-sm text-xs uppercase tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Student & ID</th>
                <th className="py-3 px-4">Uploaded File</th>
                <th className="py-3 px-4">Format & Pages</th>
                <th className="py-3 px-4">OCR Status</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs md:text-sm text-ink">
              {filteredFiles.map(file => (
                <tr key={file.id} className="hover:bg-surface-soft/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-pale text-primary font-bold flex items-center justify-center text-xs">
                        {file.studentName ? file.studentName.charAt(0) : 'S'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-ink">{file.studentName || 'Unmatched Student'}</span>
                        <span className="text-[11px] text-text-secondary">{file.studentId || 'No ID detected'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-text-secondary">
                    {file.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-surface-soft border border-border text-[11px] font-medium text-text-secondary">
                      {file.type} · {file.pages || 4} pages
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      OCR Complete
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-secondary text-xs">
                    {file.timestamp}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => removeUploadedFile(file.id)}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                      title="Remove file"
                    >
                      <MaterialIcon name="delete" className="text-[18px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Floating Action Drawer / Control Bar */}
        <div className="sticky bottom-4 z-30 w-full mt-auto">
          <div className="bg-surface/95 backdrop-blur-md rounded-2xl p-space-md shadow-xl border border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-pale text-primary flex items-center justify-center">
                <MaterialIcon name="inventory" className="text-[20px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-title-sm text-sm font-semibold text-ink">
                  {uploadedFiles.length} Student Scripts Ready for Grading
                </span>
                <span className="font-body-sm text-xs text-text-secondary">
                  Cognitive Neuroscience (COG-302) · Fall 2026
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={clearUploadQueue}
                className="px-4 py-2 rounded-xl bg-surface text-text-secondary hover:text-ink hover:bg-surface-soft font-label-md text-xs font-semibold border border-border transition-colors shadow-xs"
              >
                Clear Batch
              </button>
              <button
                disabled={isProcessing}
                onClick={handleStartGrading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-blue-deep font-label-md text-xs font-semibold transition-all shadow-md"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Starting AI Engine...</span>
                  </>
                ) : (
                  <>
                    <MaterialIcon name="auto_awesome" className="text-[18px]" />
                    <span>Begin Batch AI Grading</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

