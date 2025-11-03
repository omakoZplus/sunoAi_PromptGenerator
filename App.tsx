import React, { useState, useCallback, useEffect } from 'react';
import { SunoPromptInputs, SongStructureItem } from './types';
import { 
  MUSICAL_GENRES, 
  MOODS, 
  INSTRUMENTS, 
  VOCALS_OPTIONS, 
  PRODUCTION_TECHNIQUES, 
  SOUND_DESIGN_OPTIONS,
  VIBE_PRESETS,
  VIBE_PRESET_CONFIG,
  CHORD_PROGRESSIONS,
  INITIAL_FORM_STATE,
  EMPTY_FORM_STATE,
  TERMS_TO_EXCLUDE 
} from './constants';
import { 
  generateSunoPrompt, 
  inspireSunoInputs, 
  getSuggestedInstruments,
  getSuggestedTechniques,
  getSuggestedSoundDesigns,
  deconstructVibe,
  expandTheme,
  generateLyrics,
  suggestRhythmicFeel
} from './services/geminiService';
import Section from './components/Section';
import MultiSelectButtons from './components/MultiSelectButtons';
import ClipboardIcon from './components/icons/ClipboardIcon';
import MagicWandIcon from './components/icons/MagicWandIcon';
import SearchableMultiSelect from './components/SearchableMultiSelect';
import SaveIcon from './components/icons/SaveIcon';
import UploadIcon from './components/icons/UploadIcon';
import ShareIcon from './components/icons/ShareIcon';
import VibeDeconstructorIcon from './components/icons/VibeDeconstructorIcon';
import ExpandIcon from './components/icons/ExpandIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import SongStructureBuilder from './components/SongStructureBuilder';
import MusicNoteIcon from './components/icons/MusicNoteIcon';
import LockIcon from './components/icons/LockIcon';
import UnlockIcon from './components/icons/UnlockIcon';


type LockableFields = Omit<SunoPromptInputs, 'lyrics'>;

const App: React.FC = () => {
  const [inputs, setInputs] = useState<SunoPromptInputs>(INITIAL_FORM_STATE);
  const [lockedFields, setLockedFields] = useState<Partial<Record<keyof LockableFields, boolean>>>({});
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [activePromptIndex, setActivePromptIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInspiring, setIsInspiring] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedExclusions, setCopiedExclusions] = useState<boolean>(false);
  
  const [suggestedInstruments, setSuggestedInstruments] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [suggestedTechniques, setSuggestedTechniques] = useState<string[]>([]);
  const [isSuggestingTechniques, setIsSuggestingTechniques] = useState<boolean>(false);
  const [suggestedSoundDesigns, setSuggestedSoundDesigns] = useState<string[]>([]);
  const [isSuggestingSoundDesigns, setIsSuggestingSoundDesigns] = useState<boolean>(false);
  const [presetMode, setPresetMode] = useState<'overwrite' | 'merge'>('overwrite');

  const [pulsingField, setPulsingField] = useState<string | null>(null);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // Advanced Gemini Integrations State
  const [vibeInput, setVibeInput] = useState<string>('');
  const [isDeconstructing, setIsDeconstructing] = useState<boolean>(false);
  const [isExpandingTheme, setIsExpandingTheme] = useState<boolean>(false);
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState<boolean>(false);
  const [isSuggestingRhythmicFeel, setIsSuggestingRhythmicFeel] = useState<boolean>(false);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // On initial load, check for session in URL first, then local storage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionData = urlParams.get('session');
    let loaded = false;

    if (sessionData) {
      try {
        const decoded = atob(sessionData);
        const data = JSON.parse(decoded);
        if (data.inputs && data.lockedFields) {
          // Ensure structure is compatible
          const loadedInputs = { ...EMPTY_FORM_STATE, ...data.inputs };
          setInputs(loadedInputs);
          setLockedFields(data.lockedFields);
          loaded = true;
          showNotification("Session loaded from URL!");
        }
        window.history.replaceState(null, '', window.location.pathname);
      } catch (e) {
        console.error("Failed to load session from URL", e);
        showNotification("Error: Could not load session from URL.");
      }
    }

    if (!loaded) {
      try {
        const savedSession = localStorage.getItem('sunoPromptStudioSession');
        if (savedSession) {
          const data = JSON.parse(savedSession);
          if (data.inputs && data.lockedFields) {
             const loadedInputs = { ...EMPTY_FORM_STATE, ...data.inputs };
            setInputs(loadedInputs);
            setLockedFields(data.lockedFields);
          }
        }
      } catch (e) {
        console.error("Failed to load session from localStorage", e);
      }
    }
  }, []);

  // Effect to fetch suggestions when genre or mood changes
  const { genre, mood } = inputs;
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!genre) {
        setSuggestedInstruments([]);
        setSuggestedTechniques([]);
        setSuggestedSoundDesigns([]);
        return;
      }
      
      setIsSuggesting(true);
      setIsSuggestingTechniques(true);
      setIsSuggestingSoundDesigns(true);

      try {
        const [instrumentSuggestions, techniqueSuggestions, soundDesignSuggestions] = await Promise.all([
          getSuggestedInstruments(genre, mood),
          getSuggestedTechniques(genre, mood),
          getSuggestedSoundDesigns(genre, mood)
        ]);
        setSuggestedInstruments(instrumentSuggestions);
        setSuggestedTechniques(techniqueSuggestions);
        setSuggestedSoundDesigns(soundDesignSuggestions);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestedInstruments([]);
        setSuggestedTechniques([]);
        setSuggestedSoundDesigns([]);
      } finally {
        setIsSuggesting(false);
        setIsSuggestingTechniques(false);
        setIsSuggestingSoundDesigns(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimeout);
  }, [genre, mood]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setInputs(prev => ({ ...prev, [name]: checked }));
    } else {
        setInputs(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVibePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    setInputs(prev => {
      const newInputs: SunoPromptInputs = { ...prev, vibePreset: presetName };

      if (presetName && VIBE_PRESET_CONFIG[presetName]) {
        const config = VIBE_PRESET_CONFIG[presetName];

        if (!lockedFields.genre && config.genre) newInputs.genre = config.genre;
        if (!lockedFields.mood && config.mood) newInputs.mood = config.mood;
        
        if (presetMode === 'overwrite') {
          if (!lockedFields.instruments) newInputs.instruments = [...config.instruments];
          if (!lockedFields.techniques) newInputs.techniques = [...config.techniques];
          if (!lockedFields.soundDesign) newInputs.soundDesign = [...config.soundDesign];
        } else { // 'merge' mode
          if (!lockedFields.instruments) newInputs.instruments = Array.from(new Set([...prev.instruments, ...config.instruments]));
          if (!lockedFields.techniques) newInputs.techniques = Array.from(new Set([...prev.techniques, ...config.techniques]));
          if (!lockedFields.soundDesign) newInputs.soundDesign = Array.from(new Set([...prev.soundDesign, ...config.soundDesign]));
        }
      }
      return newInputs;
    });
  };

  const handleMultiSelectToggle = (category: keyof SunoPromptInputs, value: string) => {
    setInputs(prev => {
      const currentSelection = prev[category] as string[];
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter(item => item !== value)
        : [...currentSelection, value];
      return { ...prev, [category]: newSelection };
    });
  };

  const handleLockToggle = (field: keyof LockableFields) => {
    const isNowLocked = !lockedFields[field];
    setLockedFields(prev => ({ ...prev, [field]: isNowLocked }));
    if (isNowLocked) {
      setPulsingField(field);
      setTimeout(() => setPulsingField(null), 700);
    }
  };

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setGeneratedPrompts([]);
    try {
      const prompts = await generateSunoPrompt(inputs);
      setGeneratedPrompts(prompts);
      setActivePromptIndex(0);
    } catch (error) {
       setGeneratedPrompts(['An error occurred while generating the prompt.']);
    } finally {
      setIsLoading(false);
    }
  }, [inputs]);

  const handleClearForm = () => {
    setInputs(EMPTY_FORM_STATE);
    setGeneratedPrompts([]);
    setLockedFields({});
    setVibeInput('');
    showNotification("Form cleared.");
  };
  
  const handleClearLyrics = () => {
    setInputs(prev => ({ ...prev, lyrics: '' }));
  };
  
  const handleInspireMe = async () => {
    setIsInspiring(true);
    setGeneratedPrompts([]);
    try {
        const currentLockedInputs: Partial<SunoPromptInputs> = {};
        (Object.keys(lockedFields) as Array<keyof LockableFields>).forEach(key => {
            if (lockedFields[key]) {
                (currentLockedInputs as any)[key] = inputs[key];
            }
        });

        const inspiredInputs = await inspireSunoInputs(currentLockedInputs);
        setInputs(prev => ({ ...prev, ...inspiredInputs }));
        
        const changedKeys = Object.keys(inspiredInputs);
        setHighlightedFields(changedKeys);
        setTimeout(() => setHighlightedFields([]), 1500);

    } catch (error) {
        console.error("Failed to get inspiration:", error);
    } finally {
        setIsInspiring(false);
    }
  };

  const handleCopyToClipboard = (text: string, type: 'prompt' | 'exclusions') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'prompt') {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
      } else {
        setCopiedExclusions(true);
        setTimeout(() => setCopiedExclusions(false), 2000);
      }
    });
  };

  const handleSaveSession = () => {
    try {
      const sessionData = JSON.stringify({ inputs, lockedFields });
      localStorage.setItem('sunoPromptStudioSession', sessionData);
      showNotification("Session saved!");
    } catch (e) {
      console.error("Failed to save session", e);
      showNotification("Error: Could not save session.");
    }
  };

  const handleLoadSession = () => {
    try {
      const savedSession = localStorage.getItem('sunoPromptStudioSession');
      if (savedSession) {
        const data = JSON.parse(savedSession);
        if (data.inputs && data.lockedFields) {
          const loadedInputs = { ...EMPTY_FORM_STATE, ...data.inputs };
          setInputs(loadedInputs);
          setLockedFields(data.lockedFields);
          showNotification("Session loaded!");
        }
      } else {
        showNotification("No saved session found.");
      }
    } catch (e) {
      console.error("Failed to load session", e);
      showNotification("Error: Could not load session.");
    }
  };

  const handleShare = () => {
    try {
      const sessionData = JSON.stringify({ inputs, lockedFields });
      const encoded = btoa(sessionData);
      const url = `${window.location.origin}${window.location.pathname}?session=${encoded}`;
      navigator.clipboard.writeText(url);
      showNotification("Shareable link copied to clipboard!");
    } catch (e) {
      console.error("Failed to create share link", e);
      showNotification("Error creating share link.");
    }
  };

  const lockableFieldKeys = (Object.keys(EMPTY_FORM_STATE) as Array<keyof SunoPromptInputs>).filter(k => k !== 'lyrics');

  const handleLockAll = () => {
    const allLocked = lockableFieldKeys.reduce((acc, key) => {
      acc[key as keyof LockableFields] = true;
      return acc;
    }, {} as Partial<Record<keyof LockableFields, boolean>>);
    setLockedFields(allLocked);
    showNotification("All fields locked.");
  };

  const handleUnlockAll = () => {
    setLockedFields({});
    showNotification("All fields unlocked.");
  };

  const handleDeconstructVibe = async () => {
    if (!vibeInput.trim()) {
      showNotification("Please enter a vibe to analyze.");
      return;
    }
    setIsDeconstructing(true);
    setGeneratedPrompts([]);
    try {
      const deconstructed = await deconstructVibe(vibeInput);
      const updatedInputs: Partial<SunoPromptInputs> = {};
      
      (Object.keys(deconstructed) as Array<keyof SunoPromptInputs>).forEach(key => {
        if (!lockedFields[key as keyof LockableFields]) {
          (updatedInputs as any)[key] = deconstructed[key];
        }
      });

      setInputs(prev => ({ ...prev, ...updatedInputs }));
      showNotification("Vibe deconstructed!");
      
      const changedKeys = Object.keys(updatedInputs);
      setHighlightedFields(changedKeys);
      setTimeout(() => setHighlightedFields([]), 1500);

    } catch (error) {
      console.error("Failed to deconstruct vibe:", error);
      showNotification("Error: Could not analyze vibe.");
    } finally {
      setIsDeconstructing(false);
    }
  };

  const handleExpandTheme = async () => {
    if (!inputs.theme.trim()) {
      showNotification("Please enter a theme to expand.");
      return;
    }
    setIsExpandingTheme(true);
    try {
      const expanded = await expandTheme(inputs.theme);
      setInputs(prev => ({...prev, theme: expanded}));
      setHighlightedFields(['theme']);
      setTimeout(() => setHighlightedFields([]), 1500);
    } catch (error) {
      console.error("Failed to expand theme:", error);
      showNotification("Error: Could not expand theme.");
    } finally {
      setIsExpandingTheme(false);
    }
  };

  const handleGenerateLyrics = async () => {
    setIsGeneratingLyrics(true);
    try {
      const lyrics = await generateLyrics(inputs.theme, inputs.mood, inputs.genre);
      setInputs(prev => ({...prev, lyrics}));
    } catch (error) {
      console.error("Failed to generate lyrics:", error);
      showNotification("Error: Could not generate lyrics.");
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  const handleSuggestRhythmicFeel = async () => {
    setIsSuggestingRhythmicFeel(true);
    try {
      const feel = await suggestRhythmicFeel(inputs.genre, inputs.mood);
      if (feel && !inputs.techniques.includes(feel)) {
        setInputs(prev => ({
          ...prev,
          techniques: [...prev.techniques, feel]
        }));
        showNotification(`Added: ${feel}`);
      } else if (feel) {
        showNotification(`Already includes: ${feel}`);
      }
    } catch (error) {
      console.error("Failed to suggest rhythmic feel:", error);
      showNotification("Error: Could not get suggestion.");
    } finally {
      setIsSuggestingRhythmicFeel(false);
    }
  };

  const isAnyGeminiActionLoading = isLoading || isInspiring || isDeconstructing || isExpandingTheme || isGeneratingLyrics || isSuggestingRhythmicFeel;

  const glassPanelStyles = "bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl shadow-black/50 shadow-[0_0_25px_theme(colors.purple.900/50)]";
  const inputStyles = "w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all duration-300 placeholder:text-slate-500";
  const utilityButtonStyles = "flex items-center text-sm font-bold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-slate-300 hover:text-white py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed";
  const accessoryButtonStyles = "flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-fuchsia-400 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 px-2 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen text-white font-sans flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 [text-shadow:0_0_20px_theme(colors.fuchsia.500)]">SUNO</span>
            <span className="text-slate-300"> Prompt Studio</span>
          </h1>
          <p className="text-slate-400 mt-3 text-lg max-w-3xl mx-auto">Craft the perfect prompt to compose your next masterpiece with Suno AI.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          
          <div className={`${glassPanelStyles} p-6 sm:p-8 flex flex-col gap-8`}>
            <form className="space-y-8">
              <Section 
                title="Vibe Deconstructor"
                description="Describe a song, artist, or feeling to auto-fill the form."
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <textarea 
                    value={vibeInput} 
                    onChange={(e) => setVibeInput(e.target.value)} 
                    rows={1} 
                    className={`${inputStyles} resize-y flex-grow`}
                    placeholder="e.g., 'A melancholic piano melody like in a Studio Ghibli film' or a YouTube link..."
                  />
                  <button
                    type="button"
                    onClick={handleDeconstructVibe}
                    disabled={isAnyGeminiActionLoading}
                    className="flex items-center justify-center gap-2 text-sm font-bold bg-fuchsia-600/80 hover:bg-fuchsia-600 border border-fuchsia-500 text-white py-2 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeconstructing ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Analysing...
                      </>
                    ) : (
                      <>
                        <VibeDeconstructorIcon className="h-4 w-4" />
                        Analyze Vibe
                      </>
                    )}
                  </button>
                </div>
              </Section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Musical Genre" isLocked={!!lockedFields.genre} onLockToggle={() => handleLockToggle('genre')} isPulsing={pulsingField === 'genre'}>
                  <select name="genre" value={inputs.genre} onChange={handleInputChange} className={`${inputStyles} ${highlightedFields.includes('genre') ? 'animate-highlight-glow' : ''}`} title="Select the primary genre for your music. This sets the foundation for the song's style.">
                    {MUSICAL_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Section>
                <Section title="Mood / Emotion" isLocked={!!lockedFields.mood} onLockToggle={() => handleLockToggle('mood')} isPulsing={pulsingField === 'mood'}>
                  <select name="mood" value={inputs.mood} onChange={handleInputChange} className={`${inputStyles} ${highlightedFields.includes('mood') ? 'animate-highlight-glow' : ''}`} title="Choose the emotional tone or feeling you want to convey.">
                    {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Section>
              </div>

              <Section title="Style Influences" description="Artists, bands, or descriptive vibes." isLocked={!!lockedFields.influences} onLockToggle={() => handleLockToggle('influences')} isPulsing={pulsingField === 'influences'}>
                <input type="text" name="influences" value={inputs.influences} onChange={handleInputChange} className={`${inputStyles} ${highlightedFields.includes('influences') ? 'animate-highlight-glow' : ''}`} title="Mention artists or bands. The AI will capture their vibe and style, not use their names directly." />
              </Section>

              <Section 
                title="Vibe Preset" 
                description="Use the toggle to merge with or overwrite your current selections." 
                isLocked={!!lockedFields.vibePreset} 
                onLockToggle={() => handleLockToggle('vibePreset')}
                isPulsing={pulsingField === 'vibePreset'}
                headerAccessory={
                  <div className="flex items-center gap-2 text-xs bg-slate-900/80 p-1 rounded-lg border border-slate-700" title="Choose how a preset applies. 'Overwrite' replaces unlocked fields. 'Merge' adds to existing selections.">
                    <button 
                      type="button"
                      onClick={() => setPresetMode('overwrite')}
                      className={`px-2 py-1 rounded-md transition-colors duration-200 ${presetMode === 'overwrite' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
                    >
                      Overwrite
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPresetMode('merge')}
                      className={`px-2 py-1 rounded-md transition-colors duration-200 ${presetMode === 'merge' ? 'bg-fuchsia-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
                    >
                      Merge
                    </button>
                  </div>
                }
              >
                 <select name="vibePreset" value={inputs.vibePreset} onChange={handleVibePresetChange} className={`${inputStyles} ${highlightedFields.includes('vibePreset') ? 'animate-highlight-glow' : ''}`} title="Select a stylistic preset. This will add related instruments and techniques for you to customize.">
                    <option value="">None</option>
                    {VIBE_PRESETS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
              </Section>

               <Section 
                title="Song Structure" 
                description="Build the arrangement of your song section by section." 
                isLocked={!!lockedFields.songStructure} 
                onLockToggle={() => handleLockToggle('songStructure')} 
                isPulsing={pulsingField === 'songStructure'}
              >
                <div className={`p-4 bg-black/30 rounded-lg border border-slate-700/80 ${highlightedFields.includes('songStructure') ? 'animate-highlight-glow' : ''}`}>
                  <SongStructureBuilder 
                    structure={inputs.songStructure}
                    setStructure={(newStructure: SongStructureItem[]) => setInputs(prev => ({ ...prev, songStructure: newStructure }))}
                  />
                </div>
              </Section>

              <Section 
                title="Advanced Composition" 
                description="Add dynamic changes to the composition."
                isPulsing={pulsingField === 'tempoChange' || pulsingField === 'keyChange'}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-black/30 rounded-lg border border-slate-700/80">
                  <div className="flex items-center gap-3">
                     <button
                      type="button"
                      onClick={() => handleLockToggle('tempoChange')}
                      title={lockedFields.tempoChange ? 'Unlock Field' : 'Lock Field'}
                      className="p-1 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-fuchsia-500"
                    >
                      {lockedFields.tempoChange 
                        ? <LockIcon className="h-5 w-5 text-fuchsia-400 [filter:drop-shadow(0_0_3px_theme(colors.fuchsia.500/80))]" /> 
                        : <UnlockIcon className="h-5 w-5 text-slate-500 hover:text-slate-300" />}
                    </button>
                    <input type="checkbox" id="tempoChange" name="tempoChange" checked={inputs.tempoChange} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-fuchsia-600 focus:ring-fuchsia-500" />
                    <label htmlFor="tempoChange" className="text-slate-200">Suggest a Tempo Change</label>
                  </div>
                  <div className="flex items-center gap-3">
                     <button
                      type="button"
                      onClick={() => handleLockToggle('keyChange')}
                      title={lockedFields.keyChange ? 'Unlock Field' : 'Lock Field'}
                      className="p-1 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-fuchsia-500"
                    >
                      {lockedFields.keyChange 
                        ? <LockIcon className="h-5 w-5 text-fuchsia-400 [filter:drop-shadow(0_0_3px_theme(colors.fuchsia.500/80))]" /> 
                        : <UnlockIcon className="h-5 w-5 text-slate-500 hover:text-slate-300" />}
                    </button>
                    <input type="checkbox" id="keyChange" name="keyChange" checked={inputs.keyChange} onChange={handleInputChange} className="h-4 w-4 rounded bg-slate-700 border-slate-500 text-fuchsia-600 focus:ring-fuchsia-500" />
                    <label htmlFor="keyChange" className="text-slate-200">Suggest a Key Change</label>
                  </div>
                </div>
              </Section>
              
              <Section title="Key Instruments" description="Select one or more instruments to feature." isLocked={!!lockedFields.instruments} onLockToggle={() => handleLockToggle('instruments')} isPulsing={pulsingField === 'instruments'}>
                 <div className={`p-4 bg-black/30 rounded-lg border border-slate-700/80 space-y-4 ${highlightedFields.includes('instruments') ? 'animate-highlight-glow' : ''}`} title="Select the main instruments. This helps define the song's instrumentation.">
                    {isSuggesting && <div className="text-slate-400 text-sm p-2">Loading suggestions...</div>}
                    {!isSuggesting && suggestedInstruments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-md font-semibold text-fuchsia-300/80">Suggested for {inputs.genre}</h4>
                        <MultiSelectButtons 
                          options={suggestedInstruments} 
                          selectedOptions={inputs.instruments}
                          onToggle={(val) => handleMultiSelectToggle('instruments', val)}
                        />
                        <hr className="!my-4 border-slate-700" />
                      </div>
                    )}
                    <SearchableMultiSelect
                      options={INSTRUMENTS}
                      selectedOptions={inputs.instruments}
                      onToggle={(val) => handleMultiSelectToggle('instruments', val)}
                    />
                 </div>
              </Section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Section title="Key Chord Progressions" description="Optional harmonic structure." isLocked={!!lockedFields.chords} onLockToggle={() => handleLockToggle('chords')} isPulsing={pulsingField === 'chords'}>
                  <select name="chords" value={inputs.chords} onChange={handleInputChange} className={`${inputStyles} ${highlightedFields.includes('chords') ? 'animate-highlight-glow' : ''}`} title="Select a chord progression to guide the song's harmony.">
                    {CHORD_PROGRESSIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Section>
                <Section title="BPM" isLocked={!!lockedFields.bpm} onLockToggle={() => handleLockToggle('bpm')} isPulsing={pulsingField === 'bpm'}>
                  <input type="number" name="bpm" value={inputs.bpm} onChange={handleInputChange} className={`${inputStyles} ${highlightedFields.includes('bpm') ? 'animate-highlight-glow' : ''}`} placeholder="e.g., 120" title="Set the Beats Per Minute (BPM) to control the tempo of the song."/>
                </Section>
              </div>

              <Section 
                title="Theme / Scenario" 
                description="Describe the story, setting, or feeling." 
                isLocked={!!lockedFields.theme} 
                onLockToggle={() => handleLockToggle('theme')} 
                isPulsing={pulsingField === 'theme'}
                headerAccessory={
                  <button type="button" onClick={handleExpandTheme} disabled={isAnyGeminiActionLoading} className={accessoryButtonStyles}>
                     {isExpandingTheme ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : <ExpandIcon className="h-4 w-4" />}
                    <span>Expand</span>
                  </button>
                }
              >
                <textarea name="theme" value={inputs.theme} onChange={handleInputChange} rows={3} className={`${inputStyles} resize-y ${highlightedFields.includes('theme') ? 'animate-highlight-glow' : ''}`} title="Describe the story, setting, or feeling of your song. Be descriptive for better results."/>
              </Section>
              
               <Section 
                title="Production Techniques" 
                isLocked={!!lockedFields.techniques} 
                onLockToggle={() => handleLockToggle('techniques')} 
                isPulsing={pulsingField === 'techniques'}
                headerAccessory={
                   <button type="button" onClick={handleSuggestRhythmicFeel} disabled={isAnyGeminiActionLoading} className={accessoryButtonStyles}>
                     {isSuggestingRhythmicFeel ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : <MusicNoteIcon className="h-4 w-4" />}
                    <span>Suggest Rhythmic Feel</span>
                  </button>
                }
              >
                <div className={`p-4 bg-black/30 rounded-lg border border-slate-700/80 space-y-4 ${highlightedFields.includes('techniques') ? 'animate-highlight-glow' : ''}`} title="Select production styles to influence the song's structure and sound.">
                   {isSuggestingTechniques && <div className="text-slate-400 text-sm p-2">Loading suggestions...</div>}
                   {!isSuggestingTechniques && suggestedTechniques.length > 0 && (
                     <div className="space-y-2">
                       <h4 className="text-md font-semibold text-fuchsia-300/80">Suggested for {inputs.genre}</h4>
                       <MultiSelectButtons 
                         options={suggestedTechniques} 
                         selectedOptions={inputs.techniques}
                         onToggle={(val) => handleMultiSelectToggle('techniques', val)}
                       />
                       <hr className="!my-4 border-slate-700" />
                     </div>
                   )}
                   <SearchableMultiSelect
                      options={PRODUCTION_TECHNIQUES} 
                      selectedOptions={inputs.techniques}
                      onToggle={(val) => handleMultiSelectToggle('techniques', val)}
                    />
                </div>
              </Section>

               <Section title="Sound Design" isLocked={!!lockedFields.soundDesign} onLockToggle={() => handleLockToggle('soundDesign')} isPulsing={pulsingField === 'soundDesign'}>
                <div className={`p-4 bg-black/30 rounded-lg border border-slate-700/80 space-y-4 ${highlightedFields.includes('soundDesign') ? 'animate-highlight-glow' : ''}`} title="Choose sound design elements for specific textures and effects.">
                  {isSuggestingSoundDesigns && <div className="text-slate-400 text-sm p-2">Loading suggestions...</div>}
                  {!isSuggestingSoundDesigns && suggestedSoundDesigns.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-md font-semibold text-fuchsia-300/80">Suggested for {inputs.genre}</h4>
                      <MultiSelectButtons 
                        options={suggestedSoundDesigns} 
                        selectedOptions={inputs.soundDesign}
                        onToggle={(val) => handleMultiSelectToggle('soundDesign', val)}
                      />
                      <hr className="!my-4 border-slate-700" />
                    </div>
                  )}
                  <SearchableMultiSelect 
                      options={SOUND_DESIGN_OPTIONS} 
                      selectedOptions={inputs.soundDesign}
                      onToggle={(val) => handleMultiSelectToggle('soundDesign', val)}
                    />
                </div>
              </Section>
               <Section title="Vocals" isLocked={!!lockedFields.vocals} onLockToggle={() => handleLockToggle('vocals')} isPulsing={pulsingField === 'vocals'}>
                  <select name="vocals" value={inputs.vocals} onChange={handleInputChange} className={`${inputStyles} ${highlightedFields.includes('vocals') ? 'animate-highlight-glow' : ''}`} title="Specify the type of vocals, or choose instrumental if you don't want any.">
                    {VOCALS_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Section>
              <Section 
                title="Lyrics" 
                description="Use tags like [Verse 1], [Chorus], etc."
                headerAccessory={
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={handleGenerateLyrics} disabled={isAnyGeminiActionLoading} className={accessoryButtonStyles}>
                       {isGeneratingLyrics ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : <SparklesIcon className="h-4 w-4" />}
                      <span>Generate Lyrics</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleClearLyrics}
                      className="text-sm font-medium text-slate-400 hover:text-fuchsia-400 px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500"
                      title="Clear the content of the lyrics text area."
                    >
                      Clear
                    </button>
                  </div>
                }
              >
                <textarea name="lyrics" value={inputs.lyrics} onChange={handleInputChange} rows={5} className={`${inputStyles} font-mono text-sm resize-y`} title="Enter your lyrics. Use tags like [Verse], [Chorus] to structure them. Leave empty if you want AI-generated lyrics based on the theme."/>
              </Section>
            </form>
          </div>

          <div className="space-y-8 lg:sticky lg:top-8 self-start mt-8 lg:mt-0">
            <div className={`${glassPanelStyles} p-6`}>
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
                <button type="button" onClick={handleGenerate} disabled={isAnyGeminiActionLoading} className="w-full flex-grow text-lg font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 disabled:from-fuchsia-800 disabled:to-purple-800 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-purple-500/50 animate-pulse-glow" title="Generate three creative prompt variations based on your inputs.">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </div>
                  ) : 'Generate Prompt'}
                </button>
                <div className="w-full sm:w-auto flex items-center gap-4">
                    <button title="Inspire Me! Generate a random set of inputs for any unlocked fields." aria-label="Inspire Me. Generate random inputs for unlocked fields." type="button" onClick={handleInspireMe} disabled={isAnyGeminiActionLoading} className="flex-1 sm:flex-none text-lg font-bold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-fuchsia-400 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 disabled:cursor-not-allowed disabled:opacity-50">
                      {isInspiring ? (
                        <svg className="animate-spin h-6 w-6 text-fuchsia-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : <MagicWandIcon className="h-6 w-6" />}
                    </button>
                    <button type="button" onClick={handleClearForm} disabled={isAnyGeminiActionLoading} className="flex-1 sm:flex-none text-sm font-bold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-white py-4 px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50 disabled:opacity-50 disabled:cursor-not-allowed" title="Reset all input fields and locks to their default state.">
                      Clear All
                    </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-500/20 flex flex-wrap justify-center items-center gap-3">
                <button onClick={handleLockAll} disabled={isAnyGeminiActionLoading} className={utilityButtonStyles} title="Lock all fields to prevent changes from 'Inspire Me' or presets.">Lock All</button>
                <button onClick={handleUnlockAll} disabled={isAnyGeminiActionLoading} className={utilityButtonStyles} title="Unlock all fields.">Unlock All</button>
                <div className="h-6 w-px bg-slate-600 hidden sm:block"></div>
                <button onClick={handleSaveSession} disabled={isAnyGeminiActionLoading} className={utilityButtonStyles} title="Save the current form state to your browser's local storage."><SaveIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">Save</span></button>
                <button onClick={handleLoadSession} disabled={isAnyGeminiActionLoading} className={utilityButtonStyles} title="Load the last saved session from your browser."><UploadIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">Load</span></button>
                <button onClick={handleShare} disabled={isAnyGeminiActionLoading} className={utilityButtonStyles} title="Copy a shareable link to your clipboard."><ShareIcon className="h-5 w-5 sm:mr-2" /><span className="hidden sm:inline">Share</span></button>
              </div>
            </div>

            <div className={`${glassPanelStyles} p-0 overflow-hidden`}>
              <div className="relative">
                <div className="flex justify-between items-center p-4 border-b border-purple-500/20">
                    <h3 className="text-gray-100 font-semibold text-lg [text-shadow:0_0_10px_theme(colors.purple.500/50)]">Generated Prompt</h3>
                    <div className="flex rounded-lg bg-slate-900/80 p-1 border border-slate-700">
                        {generatedPrompts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActivePromptIndex(index)}
                            className={`px-3 py-1 text-xs font-medium rounded-md focus:outline-none transition-colors ${
                              activePromptIndex === index
                                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/20'
                                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                            }`}
                          >
                            V{index + 1}
                          </button>
                        ))}
                    </div>
                </div>

                <div className="relative min-h-[200px]">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full text-slate-400 p-4">Loading variations...</div>
                    ) : generatedPrompts.length > 0 ? (
                      <>
                        <div className="p-4 flex-grow overflow-y-auto" style={{minHeight: '150px'}}>
                          <p key={activePromptIndex} className="text-slate-300 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed animate-fade-in">
                            {generatedPrompts[activePromptIndex]}
                          </p>
                        </div>
                        <button 
                            onClick={() => handleCopyToClipboard(generatedPrompts[activePromptIndex], 'prompt')} 
                            className="absolute top-3 right-3 p-2 bg-slate-800/80 rounded-md hover:bg-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500" 
                            aria-label="Copy prompt"
                            title="Copy the currently selected prompt variation to your clipboard."
                        >
                            <ClipboardIcon className="h-5 w-5 text-slate-400" />
                        </button>
                        {copiedPrompt && <span className="absolute top-4 right-14 text-xs bg-green-500 text-white px-2 py-1 rounded-md shadow-lg">Copied!</span>}
                      </>
                    ) : (
                      <div className="flex items-center justify-center text-center h-full text-slate-500 p-4">Your generated prompt variations will appear here.</div>
                    )}
                </div>
              </div>
            </div>

            <div className={`${glassPanelStyles} p-0 overflow-hidden`}>
                <div className="p-4 border-b border-purple-500/20">
                    <h3 className="text-gray-100 font-semibold text-lg [text-shadow:0_0_10px_theme(colors.purple.500/50)]">Terms to Exclude</h3>
                    <p className="text-sm text-slate-400 mt-1">Copy for Suno's 'Negative Prompt' field.</p>
                </div>
                 <div className="relative" title="These are negative prompts to guide the AI away from undesirable sounds. Copy and paste these into Suno's 'Negative Prompt' field.">
                    <textarea readOnly value={TERMS_TO_EXCLUDE} rows={4} className="w-full bg-black/20 rounded-b-2xl p-4 text-slate-400 text-sm resize-none focus:outline-none" />
                     <button onClick={() => handleCopyToClipboard(TERMS_TO_EXCLUDE, 'exclusions')} className="absolute top-3 right-3 p-2 bg-slate-800/80 rounded-md hover:bg-slate-700/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500" aria-label="Copy exclusion terms" title="Copy the exclusion terms to your clipboard.">
                        <ClipboardIcon className="h-5 w-5 text-slate-300" />
                     </button>
                     {copiedExclusions && <span className="absolute top-4 right-14 text-xs bg-green-500 text-white px-2 py-1 rounded-md shadow-lg">Copied!</span>}
                 </div>
            </div>
          </div>
        </div>
      </div>
       {notification && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            {notification}
        </div>
      )}
    </div>
  );
};

export default App;