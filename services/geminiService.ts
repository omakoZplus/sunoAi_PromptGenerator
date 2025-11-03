import { GoogleGenAI } from "@google/genai";
import { SunoPromptInputs } from '../types';
import { 
  EMPTY_FORM_STATE,
  MUSICAL_GENRES,
  MOODS,
  INSTRUMENTS,
  VOCALS_OPTIONS,
  PRODUCTION_TECHNIQUES,
  SOUND_DESIGN_OPTIONS,
  VIBE_PRESETS,
  CHORD_PROGRESSIONS,
  SONG_STRUCTURE_TYPES
} from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSunoPrompt = async (inputs: SunoPromptInputs): Promise<string[]> => {
  const {
    genre,
    mood,
    instruments,
    vocals,
    theme,
    bpm,
    influences,
    techniques,
    soundDesign,
    lyrics,
    vibePreset,
    chords,
    songStructure,
    tempoChange,
    keyChange
  } = inputs;

  const lyricsAreMeaningful = lyrics && lyrics.trim() !== '' && !lyrics.startsWith("[Verse 1]");
  const chordsAreMeaningful = chords && chords !== 'None';
  
  const structureDescription = songStructure
    .map(item => `- ${item.type}: ${item.instructions || 'Standard execution'}`)
    .join('\n');


  const promptToGemini = `
    You are an expert prompt engineer for the Suno AI music generation service, specializing in crafting vivid and effective prompts.
    Your task is to synthesize the user's creative inputs into 3 distinct, cohesive, and powerful prompt variations for Suno AI. Each variation should offer a slightly different creative interpretation or focus.

    **Output Format:**
    You MUST return a single, valid JSON object with a single key "variations". The value of "variations" must be an array of 3 strings.
    Example: {"variations": ["prompt text 1...", "prompt text 2...", "prompt text 3..."]}
    Do not include any other text, explanations, or markdown formatting outside of this JSON object.

    **Prompt Structure Rules for Each Variation:**
    1. Start each variation with the BPM, formatted exactly as '[BPM: ${bpm}]'. For example, if the BPM is 120, start the prompt with '[BPM: 120]'.
    2. Immediately after the BPM tag, continue with the core musical descriptors: genre, mood, and vocals.
    3. Describe the overall theme and feeling.
    4. List the key instruments to be featured.
    5. On 'Style Influences': If an artist's name is provided, translate it into a description of their vibe, style, and sound withoutusing their name. For example, for 'Nujabes', you would describe it as 'a mellow, jazzy, boom-bap hip hop vibe'. If the input is already a description, use it directly.
    6. On 'Vibe Preset': If one is provided, translate its core aesthetic and feeling into descriptive musical terms. For example, for 'UNDERTALE', describe it as 'a blend of chiptune nostalgia, orchestral emotion, and quirky electronic beats'. For 'Cowboy Bebop', describe it as 'a cool, improvisational jazz fusion with bluesy undertones and a space-western feel'. **CRITICALLY, DO NOT mention the names of the games, anime, or source material in the final generated prompt.** Integrate these translated descriptions naturally into the overall theme and style.
    7. Detail the desired production techniques and sound design elements.
    8. If a chord progression is selected, mention it conceptually (e.g., 'featuring a classic pop anthem chord progression').
    9. If a song structure is provided, describe it clearly in the prompt (e.g., 'The song begins with a quiet intro, builds into a powerful chorus...'). Use the user's instructions for each section.
    10. If a tempo or key change is requested, describe it at an appropriate point in the song (e.g., 'the song builds to a dramatic key change in the final chorus' or 'it slows down for the bridge').
    11. If lyrics are provided (and are not the default example), include them at the end under a "[Lyrics]" tag.

    **User's Creative Inputs:**
    - BPM: ${bpm}
    - Musical Genre: ${genre}
    - Mood/Emotion: ${mood}
    - Vocals: ${vocals}
    - Theme/Scenario: ${theme}
    - Key Instruments: ${instruments.join(', ')}
    - Style Influences: ${influences}
    - Vibe Preset: ${vibePreset}
    - Key Chord Progression: ${chordsAreMeaningful ? chords : 'Not specified'}
    - Production Techniques/Styles: ${techniques.join(', ')}
    - Key VST/Sound Design: ${soundDesign.join(', ')}
    - Song Structure: ${songStructure.length > 0 ? `\n${structureDescription}` : 'Not specified'}
    - Tempo Change Requested: ${tempoChange}
    - Key Change (Modulation) Requested: ${keyChange}
    - Lyrics: ${lyricsAreMeaningful ? `\n[Lyrics]\n${lyrics}` : ''}

    Generate the JSON output now.
    `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptToGemini,
        config: {
          responseMimeType: "application/json",
        }
    });
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    if (result && Array.isArray(result.variations)) {
      return result.variations;
    }
    throw new Error("Invalid JSON response format from Gemini.");
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    return ["Error: Could not generate prompt variations. Please check your connection and try again."];
  }
};


export const inspireSunoInputs = async (lockedInputs: Partial<SunoPromptInputs> = {}): Promise<Partial<SunoPromptInputs>> => {
  const lockedFields = Object.keys(lockedInputs);
  const fieldsToGenerate = Object.keys(EMPTY_FORM_STATE).filter(field => !lockedFields.includes(field) && field !== 'lyrics');

  if (fieldsToGenerate.length === 0) {
    return {};
  }
  
  const promptToGemini = `
    You are a creative music producer and expert in music theory. Your task is to generate a cohesive and compelling set of parameters for a song, but you must respect the fields the user has "locked".

    **Locked Fields (DO NOT CHANGE OR RE-GENERATE THESE VALUES):**
    ${lockedFields.length > 0 ? JSON.stringify(lockedInputs, null, 2) : "None. Generate all fields."}

    **Your Task:**
    Generate values for the following unlocked fields, ensuring they are musically cohesive with the locked fields above:
    - ${fieldsToGenerate.join('\n- ')}

    **Output Format:**
    You MUST return a single, valid JSON object containing ONLY the keys for the fields you generated.
    Example: If you are asked to generate 'genre' and 'mood', your output should be {"genre": "...", "mood": "..."}.
    Do not include the locked fields in your JSON response.

    **Constraints & Guidelines for Generation (apply only to unlocked fields):**
    - 'genre': Choose one from: ${MUSICAL_GENRES.join(', ')}
    - 'mood': Choose one that fits the other parameters from: ${MOODS.join(', ')}
    - 'instruments': Choose 2 to 5 that fit the genre from: ${INSTRUMENTS.join(', ')}
    - 'vocals': Choose one from: ${VOCALS_OPTIONS.join(', ')}
    - 'theme': Create a short, descriptive theme (1-2 sentences) that matches the other parameters.
    - 'bpm': Choose a number string between 70 and 180 that is appropriate (e.g. "120").
    - 'influences': Provide 1-2 artist names or a short descriptive phrase.
    - 'techniques': Choose 2-4 from: ${PRODUCTION_TECHNIQUES.join(', ')}
    - 'soundDesign': Choose 1-3 from: ${SOUND_DESIGN_OPTIONS.join(', ')}
    - 'vibePreset': Choose 0 or 1 that complements the idea from: ${VIBE_PRESETS.join(', ')}. Or return "".
    - 'chords': Choose one from: ${CHORD_PROGRESSIONS.join(', ')}
    - 'lyrics': ALWAYS return an empty string "".
    - 'songStructure': Create a plausible song structure as an array of objects. Each object must have "id" (string, can be a placeholder like "1"), "type" (string from ${SONG_STRUCTURE_TYPES.join(', ')}), and "instructions" (string, short description). Generate 3-5 sections. Can be an empty array [].
    - 'tempoChange': (boolean) true or false.
    - 'keyChange': (boolean) true or false.

    Generate the JSON output now for the unlocked fields only.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptToGemini,
        config: {
          responseMimeType: "application/json",
        }
    });
    const jsonString = response.text.trim();
    // The result will be a partial object, which is what we want.
    const result: Partial<SunoPromptInputs> = JSON.parse(jsonString);

    // Basic validation to ensure we don't return unexpected fields
     const validatedResult: Partial<SunoPromptInputs> = {};
    for (const key of fieldsToGenerate) {
      if (result.hasOwnProperty(key)) {
        (validatedResult as any)[key] = (result as any)[key];
      }
    }
    
    // Ensure lyrics is always empty as requested
    if (validatedResult.hasOwnProperty('lyrics')) {
      validatedResult.lyrics = '';
    }

    // Ensure generated song structure has unique IDs
    if (validatedResult.songStructure && Array.isArray(validatedResult.songStructure)) {
      validatedResult.songStructure = validatedResult.songStructure.map((item, index) => ({
        ...item,
        id: `${Date.now()}-${index}` // Overwrite any incoming ID with a guaranteed unique one
      }));
    }

    return validatedResult;
  } catch (error) {
    console.error("Error generating inspiration with Gemini:", error);
    throw new Error("Could not generate inspiration from Gemini.");
  }
};

export const getSuggestedInstruments = async (genre: string, mood: string): Promise<string[]> => {
  if (!genre) return [];

  const promptToGemini = `
    You are a music expert and producer. Based on the following musical genre and mood, suggest 5 to 7 key instruments that would be a great fit.

    Genre: "${genre}"
    Mood: "${mood}"

    **Constraints:**
    1. You MUST choose instruments ONLY from the following list: ${INSTRUMENTS.join(', ')}.
    2. Your response MUST be a single, valid JSON object with a single key "instruments", which is an array of strings.
    Example: {"instruments": ["Piano", "Acoustic Guitar", "Violin", "Cello", "Drums"]}
    3. Do not include any other text, explanations, or markdown formatting outside of this JSON object.

    Generate the JSON output now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptToGemini,
      config: {
        responseMimeType: "application/json",
      }
    });
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.instruments)) {
      // Filter to ensure all returned instruments are in the master list, preventing hallucinations.
      return result.instruments.filter((instrument: unknown) => 
        typeof instrument === 'string' && INSTRUMENTS.includes(instrument)
      );
    }
    throw new Error("Invalid JSON response format from Gemini for instrument suggestions.");
  } catch (error) {
    console.error("Error generating instrument suggestions with Gemini:", error);
    return []; // Return empty array on error to avoid crashing the UI
  }
};

export const getSuggestedTechniques = async (genre: string, mood: string): Promise<string[]> => {
  if (!genre) return [];

  const promptToGemini = `
    You are a music production expert. Based on the following musical genre and mood, suggest 5 to 7 relevant production techniques.

    Genre: "${genre}"
    Mood: "${mood}"

    **Constraints:**
    1. You MUST choose techniques ONLY from the following list: ${PRODUCTION_TECHNIQUES.join(', ')}.
    2. Your response MUST be a single, valid JSON object with a single key "techniques", which is an array of strings.
    Example: {"techniques": ["Sidechain Compression", "Heavy Reverb", "Lush Harmonies"]}
    3. Do not include any other text, explanations, or markdown formatting outside of this JSON object.

    Generate the JSON output now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptToGemini,
      config: {
        responseMimeType: "application/json",
      }
    });
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.techniques)) {
      // Filter to ensure all returned items are in the master list
      return result.techniques.filter((technique: unknown) =>
        typeof technique === 'string' && PRODUCTION_TECHNIQUES.includes(technique)
      );
    }
    throw new Error("Invalid JSON response format from Gemini for technique suggestions.");
  } catch (error) {
    console.error("Error generating technique suggestions with Gemini:", error);
    return [];
  }
};

export const getSuggestedSoundDesigns = async (genre: string, mood: string): Promise<string[]> => {
  if (!genre) return [];

  const promptToGemini = `
    You are a sound design expert. Based on the following musical genre and mood, suggest 3 to 5 key sound design elements or VSTs.

    Genre: "${genre}"
    Mood: "${mood}"

    **Constraints:**
    1. You MUST choose elements ONLY from the following list: ${SOUND_DESIGN_OPTIONS.join(', ')}.
    2. Your response MUST be a single, valid JSON object with a single key "soundDesigns", which is an array of strings.
    Example: {"soundDesigns": ["Vinyl Crackle", "808 Sub Bass", "Serum"]}
    3. Do not include any other text, explanations, or markdown formatting outside of this JSON object.

    Generate the JSON output now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptToGemini,
      config: {
        responseMimeType: "application/json",
      }
    });
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.soundDesigns)) {
      // Filter to ensure all returned items are in the master list
      return result.soundDesigns.filter((design: unknown) =>
        typeof design === 'string' && SOUND_DESIGN_OPTIONS.includes(design)
      );
    }
    throw new Error("Invalid JSON response format from Gemini for sound design suggestions.");
  } catch (error) {
    console.error("Error generating sound design suggestions with Gemini:", error);
    return [];
  }
};

export const suggestRhythmicFeel = async (genre: string, mood: string): Promise<string> => {
  if (!genre) return "";

  const promptToGemini = `
    You are a music production expert. Based on the following musical genre and mood, suggest ONE SINGLE rhythmic or melodic "feel".

    Genre: "${genre}"
    Mood: "${mood}"

    **Constraints:**
    1. You MUST choose ONE SINGLE technique ONLY from the following list: ${PRODUCTION_TECHNIQUES.join(', ')}.
    2. Your response MUST be a single, valid JSON object with a single key "technique", which is a string.
    Example: {"technique": "Syncopated Rhythm"}
    3. Do not include any other text, explanations, or markdown formatting outside of this JSON object.

    Generate the JSON output now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptToGemini,
      config: {
        responseMimeType: "application/json",
      }
    });
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && typeof result.technique === 'string' && PRODUCTION_TECHNIQUES.includes(result.technique)) {
      return result.technique;
    }
    return ""; // Return empty string if validation fails
  } catch (error) {
    console.error("Error generating rhythmic feel suggestion with Gemini:", error);
    return "";
  }
};


export const expandTheme = async (currentTheme: string): Promise<string> => {
  const promptToGemini = `
    You are a creative writer specializing in music concepts. Expand the following simple musical theme into a more vivid and descriptive scenario (2-3 sentences) suitable for a music generation prompt. Make it evocative and inspiring.
    
    Original theme: "${currentTheme}"
    
    Your response should be only the expanded theme text, with no extra formatting or explanations.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptToGemini,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error expanding theme:", error);
    throw new Error("Could not expand theme.");
  }
};

export const generateLyrics = async (theme: string, mood: string, genre: string): Promise<string> => {
  const promptToGemini = `
    You are a talented songwriter. Write a full set of song lyrics based on the following musical concept.
    The lyrics should be structured with tags like [Verse 1], [Chorus], [Verse 2], [Bridge], [Outro].
    The tone should match the mood and genre.

    - Genre: ${genre}
    - Mood: ${mood}
    - Theme: ${theme}

    Your response should contain ONLY the generated lyrics text.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using a more powerful model for creative writing
      contents: promptToGemini,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating lyrics:", error);
    throw new Error("Could not generate lyrics.");
  }
};

export const deconstructVibe = async (text: string): Promise<Partial<SunoPromptInputs>> => {
  const promptToGemini = `
    You are a music analysis expert. Analyze the following text and deconstruct it into its core musical components.
    Your response MUST be a single, valid JSON object.
    For each key, you MUST select values ONLY from the provided lists. If a component is not clear from the text, omit its key from your response.

    Text to analyze: "${text}"

    **JSON Schema and Allowed Values:**
    - "genre": (string) Choose ONE from this list: ${MUSICAL_GENRES.join(', ')}
    - "mood": (string) Choose ONE from this list: ${MOODS.join(', ')}
    - "instruments": (string array) Choose up to 5 from this list: ${INSTRUMENTS.join(', ')}
    - "techniques": (string array) Choose up to 4 from this list: ${PRODUCTION_TECHNIQUES.join(', ')}
    - "soundDesign": (string array) Choose up to 3 from this list: ${SOUND_DESIGN_OPTIONS.join(', ')}
    - "vocals": (string) Choose ONE from this list: ${VOCALS_OPTIONS.join(', ')}
    - "bpm": (string) A single number representing the tempo (e.g., "120").
    - "influences": (string) A short descriptive phrase or artist names found in the text.
    - "theme": (string) A short, one-sentence summary of the theme described in the text.

    Generate the JSON object now.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptToGemini,
      config: {
        responseMimeType: "application/json",
      }
    });
    const jsonString = response.text.trim();
    const result: Partial<SunoPromptInputs> = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error("Error deconstructing vibe:", error);
    throw new Error("Could not deconstruct vibe.");
  }
};