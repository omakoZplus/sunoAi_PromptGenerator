import React from 'react';
import LockIcon from './icons/LockIcon';
import UnlockIcon from './icons/UnlockIcon';

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  headerAccessory?: React.ReactNode;
  isLocked?: boolean;
  onLockToggle?: () => void;
  isPulsing?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, description, children, headerAccessory, isLocked, onLockToggle, isPulsing }) => {
  return (
    <section className={`flex flex-col gap-3 p-1 -m-1 transition-colors duration-300 ${isPulsing ? 'animate-pulse-bg rounded-lg' : ''}`}>
      <div className="flex justify-between items-center px-1 sm:px-0">
        <div className="flex items-center gap-3">
          {onLockToggle && (
            <button
              type="button"
              onClick={onLockToggle}
              title={isLocked ? 'Unlock Field' : 'Lock Field'}
              className="p-1 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-fuchsia-500"
              aria-label={`Lock or unlock the ${title} field`}
            >
              {isLocked 
                ? <LockIcon className="h-5 w-5 text-fuchsia-400 [filter:drop-shadow(0_0_3px_theme(colors.fuchsia.500/80))]" /> 
                : <UnlockIcon className="h-5 w-5 text-slate-500 hover:text-slate-300" />}
            </button>
          )}
          <div>
            <label className="text-gray-100 font-semibold text-lg [text-shadow:0_0_10px_theme(colors.purple.500/50)]">{title}</label>
            {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
          </div>
        </div>
        {headerAccessory}
      </div>
      {children}
    </section>
  );
};

export default Section;