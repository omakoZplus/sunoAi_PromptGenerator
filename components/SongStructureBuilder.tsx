import React, { useState } from 'react';
import { SongStructureItem } from '../types';
import { SONG_STRUCTURE_TYPES } from '../constants';
import PlusCircleIcon from './icons/PlusCircleIcon';
import TrashIcon from './icons/TrashIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import ChevronsUpDownIcon from './icons/ChevronsUpDownIcon';

interface SongStructureBuilderProps {
  structure: SongStructureItem[];
  setStructure: (structure: SongStructureItem[]) => void;
}

const SongStructureBuilder: React.FC<SongStructureBuilderProps> = ({ structure, setStructure }) => {
  const [newSectionType, setNewSectionType] = useState<string>(SONG_STRUCTURE_TYPES[0]);

  const handleAddSection = () => {
    if (newSectionType) {
      const newItem: SongStructureItem = {
        id: Date.now().toString(),
        type: newSectionType,
        instructions: '',
      };
      setStructure([...structure, newItem]);
    }
  };

  const handleRemoveSection = (id: string) => {
    setStructure(structure.filter(item => item.id !== id));
  };

  const handleInstructionChange = (id: string, value: string) => {
    setStructure(structure.map(item => item.id === id ? { ...item, instructions: value } : item));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === structure.length - 1) return;

    const newStructure = [...structure];
    const item = newStructure.splice(index, 1)[0];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newStructure.splice(newIndex, 0, item);
    setStructure(newStructure);
  };

  const inputStyles = "w-full bg-slate-800/60 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all duration-300 placeholder:text-slate-500";
  const buttonStyles = "p-1.5 rounded-md text-slate-400 hover:bg-slate-700/60 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-4">
      {structure.length > 0 && (
        <div className="space-y-3">
          {structure.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-slate-700/80 animate-fade-in">
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => handleMoveSection(index, 'up')} disabled={index === 0} className={buttonStyles} title="Move section up">
                  <ArrowUpIcon className="h-4 w-4" />
                </button>
                <ChevronsUpDownIcon className="h-4 w-4 text-slate-600" />
                <button type="button" onClick={() => handleMoveSection(index, 'down')} disabled={index === structure.length - 1} className={buttonStyles} title="Move section down">
                  <ArrowDownIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-grow space-y-2">
                <span className="font-semibold text-fuchsia-300/80">{item.type}</span>
                <input
                  type="text"
                  value={item.instructions}
                  onChange={(e) => handleInstructionChange(item.id, e.target.value)}
                  placeholder={`e.g., quiet, build intensity, acoustic only...`}
                  className={inputStyles}
                />
              </div>
              <button type="button" onClick={() => handleRemoveSection(item.id)} className={`${buttonStyles} self-start`} title="Remove section">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <select
          value={newSectionType}
          onChange={(e) => setNewSectionType(e.target.value)}
          className={`${inputStyles} flex-grow`}
        >
          {SONG_STRUCTURE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center justify-center gap-2 text-sm font-bold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-slate-300 hover:text-white py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Add Section
        </button>
      </div>
    </div>
  );
};

export default SongStructureBuilder;
