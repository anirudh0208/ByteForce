import React from 'react';
import { useGradeX } from '../../context/GradeXContext';
import { MaterialIcon } from './MaterialIcon';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGradeX();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const bg =
          toast.type === 'success'
            ? 'bg-success text-white border-success/20'
            : toast.type === 'warning'
            ? 'bg-warning text-white border-warning/20'
            : 'bg-primary text-white border-primary/20';

        const icon =
          toast.type === 'success'
            ? 'check_circle'
            : toast.type === 'warning'
            ? 'warning'
            : 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              <MaterialIcon name={icon} className="text-[20px]" />
              <span className="text-body-md font-medium text-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors ml-3"
            >
              <MaterialIcon name="close" className="text-[18px]" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

