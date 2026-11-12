import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const FacultyLayout: React.FC = () => {
  const { submissions, setRole } = useGradeX();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = submissions.filter(s => s.status === 'Needs Review' || s.status === 'Flagged').length;

  const navItems = [
    { name: 'Overview', path: '/faculty/dashboard', icon: 'dashboard' },
    { name: 'Assessments', path: '/faculty/assessments', icon: 'menu_book' },
    { name: 'Create Assessment', path: '/faculty/assessments/create', icon: 'add_circle' },
    { name: 'Submissions', path: '/faculty/submissions', icon: 'cloud_upload' },
    { name: 'AI Grading', path: '/faculty/grading', icon: 'auto_awesome' },
    { name: 'Review Queue', path: '/faculty/reviews', icon: 'check_box', badge: pendingCount },
    { name: 'Analytics', path: '/faculty/analytics', icon: 'bar_chart' },
  ];

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/assessments/create')) return { breadcrumb: 'Assessments / Authoring', title: 'Create Assessment & Rubric' };
    if (p.includes('/submissions')) return { breadcrumb: 'Submissions / Ingestion', title: 'Submissions & Bulk Upload' };
    if (p.includes('/grading')) return { breadcrumb: 'Evaluation / Pipeline', title: 'AI Grading Workspace' };
    if (p.includes('/reviews')) return { breadcrumb: 'Faculty Oversight / Queue', title: 'Faculty Review Queue' };
    if (p.includes('/analytics')) return { breadcrumb: 'Institutional Insights / Metrics', title: 'Results & Analytics' };
    return { breadcrumb: 'Curriculum / Intelligence', title: 'Faculty Overview' };
  };

  const { breadcrumb, title } = getPageTitle();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-headline-sm font-semibold">G</div>
          <span className="font-headline-sm text-ink font-semibold">GradeX</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-pale text-on-primary-container">Faculty</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-text-secondary hover:text-ink hover:bg-surface-soft"
        >
          <MaterialIcon name={mobileMenuOpen ? 'close' : 'menu'} className="text-[24px]" />
        </button>
      </div>

      {/* Persistent Left Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'flex' : 'hidden'
        } md:flex fixed md:sticky top-0 left-0 h-screen w-[250px] bg-surface border-r border-border z-50 flex-col justify-between shrink-0 shadow-sm transition-all`}
      >
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-[70px] px-space-md border-b border-border flex items-center gap-space-sm">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm font-headline-md font-bold">
              G
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-headline-sm text-headline-sm text-ink leading-none tracking-tight font-semibold">
                Grade<span className="text-primary font-bold">X</span>
              </span>
              <span className="font-label-sm text-[10px] text-text-secondary tracking-widest uppercase mt-0.5">
                Academic Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 p-space-sm mt-2">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || (item.path === '/faculty/dashboard' && location.pathname === '/faculty');
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue-pale text-on-primary-container font-title-sm font-semibold shadow-sm'
                      : 'text-text-secondary hover:text-ink hover:bg-surface-soft font-body-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MaterialIcon
                      name={item.icon}
                      className={`text-[20px] ${isActive ? 'text-primary' : 'text-text-secondary'}`}
                    />
                    <span className="text-[14px]">{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-warning text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Account / Switcher */}
        <div className="p-space-md border-t border-border flex flex-col gap-3">
          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Demo Role</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary text-white">Faculty</span>
            </div>
            <button
              onClick={() => {
                setRole('student');
                navigate('/student/dashboard');
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-surface hover:bg-surface-soft text-primary font-medium text-xs rounded-lg border border-blue-border transition-all shadow-xs"
            >
              <MaterialIcon name="swap_horiz" className="text-[16px]" />
              <span>Switch to Student View</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 px-1">
            <div className="w-9 h-9 rounded-full bg-blue-deep/20 text-primary flex items-center justify-center font-semibold text-sm border border-blue-border">
              EV
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-ink truncate leading-tight">Prof. Eleanor Vance</span>
              <span className="text-[11px] text-text-secondary truncate leading-tight">Cognitive Neuroscience</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 h-[70px] bg-surface/90 backdrop-blur-md border-b border-border z-40 px-4 md:px-space-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-label-md text-label-md text-text-secondary hidden sm:inline">{breadcrumb}</span>
            <span className="font-label-md text-label-md text-outline-variant hidden sm:inline">/</span>
            <span className="font-title-sm text-title-sm text-ink font-semibold">{title}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action to toggle student view */}
            <button
              onClick={() => {
                setRole('student');
                navigate('/student/dashboard');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-pale text-on-primary-container hover:bg-blue-primary/30 text-xs font-semibold border border-blue-border transition-colors"
            >
              <MaterialIcon name="visibility" className="text-[16px]" />
              <span>Preview as Student</span>
            </button>

            {/* Quick status pill */}
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-soft rounded-lg border border-border text-xs text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              <span className="hidden md:inline font-medium">Model:</span>
              <span className="text-ink font-semibold">Gemini 3.8</span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-space-lg max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

