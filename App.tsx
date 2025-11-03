
import React, { useState, useCallback, useEffect } from 'react';
import { SunoPromptInputs } from './types';
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
  getSuggestedSoundDesigns
} from './services/geminiService';
import Section from './components/Section';
import MultiSelectButtons from './components/MultiSelectButtons';
import ClipboardIcon from './components/icons/ClipboardIcon';
import MagicWandIcon from './components/icons/MagicWandIcon';
import SearchableMultiSelect from './components/SearchableMultiSelect';

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
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleVibePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    setInputs(prev => {
      const newInputs: SunoPromptInputs = { ...prev, vibePreset: presetName };

      if (presetName && VIBE_PRESET_CONFIG[presetName]) {
        const config = VIBE_PRESET_CONFIG[presetName];

        // Always handle genre and mood the same way (overwrite if not locked)
        if (!lockedFields.genre && config.genre) {
          newInputs.genre = config.genre;
        }
        if (!lockedFields.mood && config.mood) {
          newInputs.mood = config.mood;
        }
        
        // Handle multi-select fields based on the mode
        if (presetMode === 'overwrite') {
          if (!lockedFields.instruments) {
            newInputs.instruments = [...config.instruments];
          }
          if (!lockedFields.techniques) {
            newInputs.techniques = [...config.techniques];
          }
          if (!lockedFields.soundDesign) {
            newInputs.soundDesign = [...config.soundDesign];
          }
        } else { // 'merge' mode
          if (!lockedFields.instruments) {
            newInputs.instruments = Array.from(new Set([...prev.instruments, ...config.instruments]));
          }
          if (!lockedFields.techniques) {
            newInputs.techniques = Array.from(new Set([...prev.techniques, ...config.techniques]));
          }
          if (!lockedFields.soundDesign) {
            newInputs.soundDesign = Array.from(new Set([...prev.soundDesign, ...config.soundDesign]));
          }
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
    setLockedFields(prev => ({ ...prev, [field]: !prev[field] }));
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
                // Fix for TypeScript error on line 115: Type 'string | string[]' is not assignable to type 'string & string[]'.
                // This is a common TypeScript issue with dynamic keys on objects with heterogenous property types.
                // We cast to `any` to inform TypeScript that we are sure the types will match.
                (currentLockedInputs as any)[key] = inputs[key];
            }
        });

        const inspiredInputs = await inspireSunoInputs(currentLockedInputs);
        setInputs(prev => ({ ...prev, ...inspiredInputs }));
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

  const glassPanelStyles = "bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl shadow-black/50 shadow-[0_0_25px_theme(colors.purple.900/50)]";
  const inputStyles = "w-full bg-slate-900/70 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none transition-all duration-300 placeholder:text-slate-500";


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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Musical Genre" isLocked={!!lockedFields.genre} onLockToggle={() => handleLockToggle('genre')}>
                  <select name="genre" value={inputs.genre} onChange={handleInputChange} className={inputStyles} title="Select the primary genre for your music. This sets the foundation for the song's style.">
                    {MUSICAL_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Section>
                <Section title="Mood / Emotion" isLocked={!!lockedFields.mood} onLockToggle={() => handleLockToggle('mood')}>
                  <select name="mood" value={inputs.mood} onChange={handleInputChange} className={inputStyles} title="Choose the emotional tone or feeling you want to convey.">
                    {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Section>
              </div>

              <Section title="Style Influences" description="Artists, bands, or descriptive vibes." isLocked={!!lockedFields.influences} onLockToggle={() => handleLockToggle('influences')}>
                <input type="text" name="influences" value={inputs.influences} onChange={handleInputChange} className={inputStyles} title="Mention artists or bands. The AI will capture their vibe and style, not use their names directly." />
              </Section>

              <Section 
                title="Vibe Preset" 
                description="Use the toggle to merge with or overwrite your current selections." 
                isLocked={!!lockedFields.vibePreset} 
                onLockToggle={() => handleLockToggle('vibePreset')}
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
                 <select name="vibePreset" value={inputs.vibePreset} onChange={handleVibePresetChange} className={inputStyles} title="Select a stylistic preset. This will add related instruments and techniques for you to customize.">
                    <option value="">None</option>
                    {VIBE_PRESETS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
              </Section>

              <Section title="Key Chord Progressions" description="Optional harmonic structure." isLocked={!!lockedFields.chords} onLockToggle={() => handleLockToggle('chords')}>
                  <select name="chords" value={inputs.chords} onChange={handleInputChange} className={inputStyles} title="Select a chord progression to guide the song's harmony.">
                    {CHORD_PROGRESSIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Section>
              
              <Section title="Key Instruments" description="Select one or more instruments to feature." isLocked={!!lockedFields.instruments} onLockToggle={() => handleLockToggle('instruments')}>
                 <div className="p-4 bg-black/30 rounded-lg border border-slate-700/80 space-y-4" title="Select the main instruments. This helps define the song's instrumentation.">
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
                <Section title="Vocals" isLocked={!!lockedFields.vocals} onLockToggle={() => handleLockToggle('vocals')}>
                  <select name="vocals" value={inputs.vocals} onChange={handleInputChange} className={inputStyles} title="Specify the type of vocals, or choose instrumental if you don't want any.">
                    {VOCALS_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </Section>
                <Section title="BPM" isLocked={!!lockedFields.bpm} onLockToggle={() => handleLockToggle('bpm')}>
                  <input type="number" name="bpm" value={inputs.bpm} onChange={handleInputChange} className={inputStyles} placeholder="e.g., 120" title="Set the Beats Per Minute (BPM) to control the tempo of the song."/>
                </Section>
              </div>

              <Section title="Theme / Scenario" description="Describe the story, setting, or feeling." isLocked={!!lockedFields.theme} onLockToggle={() => handleLockToggle('theme')}>
                <textarea name="theme" value={inputs.theme} onChange={handleInputChange} rows={3} className={`${inputStyles} resize-y`} title="Describe the story, setting, or feeling of your song. Be descriptive for better results."/>
              </Section>
              
              <Section title="Production Techniques" isLocked={!!lockedFields.techniques} onLockToggle={() => handleLockToggle('techniques')}>
                <div className="p-4 bg-black/30 rounded-lg border border-slate-700/80 space-y-4" title="Select production styles to influence the song's structure and sound.">
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

               <Section title="Sound Design" isLocked={!!lockedFields.soundDesign} onLockToggle={() => handleLockToggle('soundDesign')}>
                <div className="p-4 bg-black/30 rounded-lg border border-slate-700/80 space-y-4" title="Choose sound design elements for specific textures and effects.">
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

              <Section 
                title="Lyrics" 
                description="Use tags like [Verse 1], [Chorus], etc."
                headerAccessory={
                  <button 
                    type="button" 
                    onClick={handleClearLyrics}
                    className="text-sm font-medium text-slate-400 hover:text-fuchsia-400 px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500"
                    title="Clear the content of the lyrics text area."
                  >
                    Clear Lyrics
                  </button>
                }
              >
                <textarea name="lyrics" value={inputs.lyrics} onChange={handleInputChange} rows={5} className={`${inputStyles} font-mono text-sm resize-y`} title="Enter your lyrics. Use tags like [Verse], [Chorus] to structure them. Leave empty if you want AI-generated lyrics based on the theme."/>
              </Section>
            </form>
          </div>

          <div className="space-y-8 lg:sticky lg:top-8 self-start mt-8 lg:mt-0">
            <div className={`${glassPanelStyles} p-6`}>
              <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
                <button type="button" onClick={handleGenerate} disabled={isLoading || isInspiring} className="w-full flex-grow text-lg font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 disabled:from-fuchsia-800 disabled:to-purple-800 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-purple-500/50 animate-pulse-glow" title="Generate three creative prompt variations based on your inputs.">
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
                    <button title="Inspire Me! Generate a random set of inputs for any unlocked fields." type="button" onClick={handleInspireMe} disabled={isLoading || isInspiring} className="flex-1 sm:flex-none text-lg font-bold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-fuchsia-400 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 disabled:cursor-not-allowed disabled:opacity-50">
                      {isInspiring ? (
                        <svg className="animate-spin h-6 w-6 text-fuchsia-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : <MagicWandIcon className="h-6 w-6" />}
                    </button>
                    <button type="button" onClick={handleClearForm} className="flex-1 sm:flex-none text-sm font-bold bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 text-white py-4 px-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50" title="Reset all input fields and locks to their default state.">
                      Clear All
                    </button>
                </div>
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
                          <p className="text-slate-300 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
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
    </div>
  );
};

export default App;
