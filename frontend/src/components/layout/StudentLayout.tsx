import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MaterialIcon } from '../common/MaterialIcon';
import { useGradeX } from '../../context/GradeXContext';

export const StudentLayout: React.FC = () => {
  const { setRole } = useGradeX();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: 'grid_view' },
    { name: 'My Assessments', path: '/student/assessments', icon: 'menu_book' },
    { name: 'Results & Feedback', path: '/student/results', icon: 'check_circle' },
    { name: 'Learning Progress', path: '/student/progress', icon: 'trending_up' },
  ];

  const getPageTitle = () => {
    const p = location.pathname;
    if (p.includes('/results')) return { breadcrumb: 'Academic Space / Evaluations', title: 'Student Results & Feedback' };
    if (p.includes('/assessments')) return { breadcrumb: 'Academic Space / Courses', title: 'My Assessments' };
    if (p.includes('/progress')) return { breadcrumb: 'Academic Space / Competency', title: 'Learning Progress' };
    return { breadcrumb: 'Academic Space / Overview', title: 'Student Dashboard' };
  };

  const { breadcrumb, title } = getPageTitle();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-surface border-b border-border sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-headline-sm font-semibold">G</div>
          <span className="font-headline-sm text-ink font-semibold">GradeX</span>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-pale text-on-primary-container">Student</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-text-secondary hover:text-ink hover:bg-surface-soft"
        >
          <MaterialIcon name={mobileMenuOpen ? 'close' : 'menu'} className="text-[24px]" />
        </button>
      </div>

      {/* Student Left Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'flex' : 'hidden'
        } md:flex fixed md:sticky top-0 left-0 h-screen w-72 bg-surface border-r border-border z-50 flex-col justify-between shrink-0 shadow-sm transition-all`}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-border/60">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline-sm font-bold text-white">
                G
              </div>
              <span className="font-headline-md text-headline-md tracking-tight text-ink font-semibold">
                Grade<span className="text-primary">X</span>
              </span>
            </div>
            <span className="text-label-sm font-label-sm px-2 py-0.5 rounded bg-blue-pale text-on-primary-container border border-blue-border tracking-wider uppercase text-[10px] font-semibold">
              Student
            </span>
          </div>

          {/* Navigation */}
          <div className="p-space-md">
            <span className="text-label-sm font-label-sm text-text-secondary uppercase tracking-wider px-space-sm mb-space-xs block text-[11px] font-semibold">
              Academic Space
            </span>
            <nav className="flex flex-col gap-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.path || (item.path === '/student/dashboard' && location.pathname === '/student');
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-space-sm px-space-sm py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-pale text-on-primary-container font-title-sm font-semibold shadow-sm'
                        : 'text-text-secondary hover:text-ink hover:bg-surface-soft font-body-md'
                    }`}
                  >
                    <MaterialIcon
                      name={item.icon}
                      className={`text-[20px] ${isActive ? 'text-primary' : 'text-text-secondary'}`}
                    />
                    <span className="text-[14px]">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Policy & Profile */}
        <div className="p-space-md border-t border-border flex flex-col gap-3">
          <div className="p-space-sm bg-surface-soft rounded-xl border border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-text-secondary uppercase">Rubric Policy</span>
              <MaterialIcon name="verified" className="text-primary text-[14px]" />
            </div>
            <p className="text-body-sm text-[12px] text-text-secondary line-clamp-2">
              All evaluations are certified against academic benchmark standards.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-border/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">Demo Role</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-success text-white">Student</span>
            </div>
            <button
              onClick={() => {
                setRole('faculty');
                navigate('/faculty/dashboard');
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-surface hover:bg-surface-soft text-primary font-medium text-xs rounded-lg border border-blue-border transition-all shadow-xs"
            >
              <MaterialIcon name="swap_horiz" className="text-[16px]" />
              <span>Switch to Faculty View</span>
            </button>
          </div>

          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-blue-border">
              JV
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-title-sm text-[13px] font-semibold text-ink truncate leading-tight">Julian Vance</span>
              <span className="text-body-sm text-[11px] text-text-secondary truncate leading-tight">STU-8821 · Year 4</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 h-16 bg-surface/90 backdrop-blur-md border-b border-border z-40 px-4 md:px-space-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-label-md text-label-md text-text-secondary hidden sm:inline">{breadcrumb}</span>
            <span className="font-label-md text-label-md text-outline-variant hidden sm:inline">/</span>
            <span className="font-title-sm text-title-sm text-ink font-semibold">{title}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setRole('faculty');
                navigate('/faculty/dashboard');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-ink hover:bg-surface-soft text-xs font-semibold border border-border transition-colors shadow-xs"
            >
              <MaterialIcon name="school" className="text-[16px] text-primary" />
              <span>Switch to Faculty</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-space-lg max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

