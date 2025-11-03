export interface SongStructureItem {
  id: string;
  type: string;
  instructions: string;
}

export interface SunoPromptInputs {
  genre: string;
  mood: string;
  instruments: string[];
  vocals: string;
  theme: string;
  bpm: string;
  influences: string;
  techniques: string[];
  soundDesign: string[];
  lyrics: string;
  vibePreset: string;
  chords: string;
  // Advanced Composition
  songStructure: SongStructureItem[];
  tempoChange: boolean;
  keyChange: boolean;
}
