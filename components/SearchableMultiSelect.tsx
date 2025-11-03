import React, { useState, useMemo } from 'react';
import MultiSelectButtons from './MultiSelectButtons';
import SearchIcon from './icons/SearchIcon';

interface SearchableMultiSelectProps {
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({ options, selectedOptions, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) {
      return options;
    }
    return options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  return (
    <div className="p-2">
      <div className="relative mb-3">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </span>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900/70 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all duration-300 placeholder:text-slate-500"
        />
      </div>
      <div className="max-h-48 overflow-y-auto pr-2">
        <MultiSelectButtons
          options={filteredOptions}
          selectedOptions={selectedOptions}
          onToggle={onToggle}
        />
      </div>
    </div>
  );
};

export default SearchableMultiSelect;