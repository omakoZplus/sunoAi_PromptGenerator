import React from 'react';

interface MultiSelectButtonsProps {
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

const MultiSelectButtons: React.FC<MultiSelectButtonsProps> = ({ options, selectedOptions, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedOptions.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500 ${
              isSelected
                ? 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-md shadow-fuchsia-500/20'
                : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60 hover:border-slate-500 hover:text-white'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default MultiSelectButtons;