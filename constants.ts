import { SunoPromptInputs } from './types';

export const INSTRUMENT_CATEGORIES = {
  "Keyboards & Synths": ["Accordion", "Acoustic Piano", "Analog Synth", "Arpeggiator", "Celesta", "Electric Piano", "FM Synth", "Grand Piano", "Harpsichord", "Mellotron", "Modular Synth", "Organ", "Piano", "Sampler", "Synth Bass", "Synth Lead", "Synth Pad", "Synthesizer", "TB-303", "Theremin", "Vocal Chops"],
  "Guitars & Bass": ["Acoustic Guitar", "Banjo", "Bass Guitar", "Classical Guitar", "Electric Guitar", "Lute", "Mandolin", "Oud", "Shamisen", "Sitar", "Ukulele"],
  "Drums & Percussion": ["Acoustic Drums", "Beatboxing", "Bongos", "Cajon", "Congas", "Cowbell", "Cymbals", "Djembe", "Drum Machine", "Drums", "Glockenspiel", "Gong", "Maracas", "Marimba", "Steel Drums", "Tabla", "Tambourine", "Timpani", "TR-808", "TR-909", "Triangle", "Vibraphone", "Xylophone"],
  "Orchestral & Strings": ["Brass Section", "Cello", "Choir", "Double Bass", "French Horn", "Harp", "String Section", "Trombone", "Trumpet", "Tuba", "Viola", "Violin"],
  "Wind Instruments": ["Bagpipes", "Bassoon", "Clarinet", "Didgeridoo", "Flute", "Harmonica", "Oboe", "Piccolo", "Recorder", "Saxophone"],
  "World & Folk": ["Balafon", "Erhu", "Guzheng", "Handpan", "Kalimba", "Koto"],
  "Unique & Vocal": ["Operatic Vocals", "Scat Singing", "Turntables"]
};

export const INSTRUMENTS: string[] = Object.values(INSTRUMENT_CATEGORIES).flat().sort();


export const MUSICAL_GENRES: string[] = [
  "8-bit", "Acid Jazz", "Acoustic", "Afrobeat", "Alternative Rock", "Ambient", "Art Rock", "Baroque", "Bebop", "Bluegrass", "Blues", "Bossa Nova", "Breakbeat", "Chamber Music", "Chiptune", "Choir", "City Pop", "Classical", "Comedy Rock", "Contemporary", "Country", "Cumbia", "Dance", "Darkwave", "Death Metal", "Delta Blues", "Disco", "Doo-wop", "Downtempo", "Dream Pop", "Drill", "Drum and Bass", "Dub", "Dubstep", "EDM", "Electro Swing", "Electronic", "Emo", "Eurodance", "Experimental", "Flamenco", "Folk", "Funk", "Future Bass", "Garage Rock", "Glitch", "Gospel", "Gothic Rock", "Grime", "Grunge", "Hard Rock", "Hardcore", "Hardstyle", "Heavy Metal", "Hip Hop", "House", "IDM", "Indie", "Industrial", "J-Pop", "J-Rock", "Jazz", "Jungle", "K-Pop", "Kawaii Future Bass", "Latin", "Lo-fi Hip Hop", "Lofi", "Mambo", "Mariachi", "Medieval", "Metal", "Minimalist", "Motown", "Neo-soul", "New Wave", "Noise Rock", "Nu-Metal", "Opera", "Orchestral", "Phonk", "Polka", "Pop", "Post-Rock", "Power Metal", "Progressive Rock", "Psychedelic Rock", "Punk", "R&B", "Ragtime", "Reggae", "Reggaeton", "Renaissance", "Rock", "Salsa", "Samba", "Sea Shanty", "Shoegaze", "Ska", "Soul", "Stoner Rock", "Surf Rock", "Swing", "Symphonic Metal", "Synth-pop", "Synthwave", "Tango", "Techno", "Trance", "Trap", "Trip Hop", "Vaporwave", "Video Game Music", "World"
].sort();


export const MOODS: string[] = [
  "Relaxing", "Epic", "Happy", "Sad", "Energetic", "Melancholic", "Hopeful", "Dark", "Peaceful", "Mysterious", "Romantic", "Uplifting", "Anxious", "Calm", "Chaotic", "Cinematic", "Dreamy", "Eerie", "Euphoric", "Gloomy", "Groovy", "Intense", "Joyful", "Nostalgic", "Ominous", "Playful", "Powerful", "Serene", "Somber", "Spiritual", "Suspenseful", "Tense", "Thoughtful", "Triumphant", "Whimsical"
];

export const VOCALS_OPTIONS: string[] = [
  "[instrumental]", "[no vocals]", "Male Vocals", "Female Vocals", "Choir", "Operatic Vocals", "Whispering", "Spoken Word", "Rap", "Screaming", "Vocal Chops", "Harmonized Vocals", "Children's Choir", "Robot Voice"
];

export const CHORD_PROGRESSIONS: string[] = [
  "None",
  "I-V-vi-IV (Pop Anthem)",
  "vi-IV-I-V (Sensitive Pop)",
  "I-IV-V-I (Classic Rock)",
  "ii-V-I (Jazz Standard)",
  "i-VI-III-VII (Epic Minor)",
  "i-VII-VI-V (Andalusian Cadence)",
  "I-vi-ii-V (Doo-Wop)",
  "I-IV-I-V (12-Bar Blues)",
].sort();

export const PRODUCTION_TECHNIQUES: string[] = [
  "Ambient Textures", "Arpeggiated", "Atmospheric", "Call and Response", "Catchy Melodies", "Clean Production", "Counterpoint Melody", "Crisp Mix", "Dissonant Chords", "Driving Rhythm", "Dynamic Builds", "Echo Delay", "Ethereal Pads", "Flanger", "Foley Sounds", "Gated Reverb", "Glitchy Vocals", "Granular Synthesis", "Gritty Distortion", "Heavy Autotune", "Heavy Reverb", "Intricate Arrangements", "Lo-fi Aesthetic", "Lush Harmonies", "Minimalist Repetition", "Orchestral Swells", "Panning Effects", "Phasing", "Polyrhythmic", "Punchy Drums", "Reverse Cymbals", "Sidechain Compression", "Slick Bassline", "Slow Tempo", "Stereo Widening", "Syncopated Rhythm", "Tape Saturation", "Twangy Guitar", "Upbeat Tempo", "Wall of Sound", "Warm Analog Synths"
].sort();

export const SOUND_DESIGN_OPTIONS: string[] = [
  "808 Sub Bass", "Ambient Soundscapes", "Arp Sequence", "Arturia Piano", "Bandpass Filter", "Bitcrushed", "Diva", "Field Recordings", "FM Synthesis Pad", "FM8", "Found Sounds", "Glitch Effects", "Granular Texture", "Industrial Noise", "Kontakt Noire Piano", "Low-pass Filter Sweep", "Massive X", "Mastering", "Moog Subsquent", "Nature Sounds", "Nexus 4", "Noise Gate", "Omnisphere", "Pluck Synth", "Reese Bass", "Reverb Tail", "Reverse Reverb", "Risers/Sweeps", "Serum", "Spire", "Subtractive Synthesis", "Supersaw Lead", "Trance Gate", "Vinyl Crackle", "Warped Vocal Sample", "Wavetable Synthesis", "Wobbly Bass"
].sort();

export const VIBE_PRESETS: string[] = [
  // New Genre/Mood Presets
  "80s Synthwave Rider", "Acoustic Coffeehouse", "Dark Techno Club", "Epic Cinematic Trailer", "Lofi Chill", "Reggaeton Beach Party", "Trap Banger",
  // Games
  "UNDERTALE", "Stardew Valley", "Final Fantasy", "The Legend of Zelda", "Cyberpunk 2077", "DOOM", "Persona 5", "Celeste", "Minecraft", "Red Dead Redemption 2", "The Witcher 3", "Skyrim", "NieR: Automata", "Hollow Knight",
  // Anime / Cartoons / Movies
  "Dragon Ball Z", "Dragon Ball Z Dokkan Battle", "Studio Ghibli", "Cowboy Bebop", "Samurai Champloo", "Steven Universe", "Adventure Time", "Attack on Titan", "Naruto", "JoJo's Bizarre Adventure", "Looney Tunes", "Blade Runner", "Chainsaw Man", "Ghost in the Shell"
].sort();

export const VIBE_PRESET_CONFIG: Record<string, {
  genre: string;
  mood: string;
  instruments: string[];
  techniques: string[];
  soundDesign: string[];
}> = {
  // New Genre/Mood Presets
  "Lofi Chill": {
    genre: "Lo-fi Hip Hop",
    mood: "Relaxing",
    instruments: ["Electric Piano", "Drum Machine", "Synth Bass", "Sampler", "Acoustic Guitar"],
    techniques: ["Slow Tempo", "Lo-fi Aesthetic", "Minimalist Repetition", "Sidechain Compression"],
    soundDesign: ["Vinyl Crackle", "Warped Vocal Sample", "Reverb Tail"],
  },
  "80s Synthwave Rider": {
    genre: "Synthwave",
    mood: "Nostalgic",
    instruments: ["Analog Synth", "Drum Machine", "Synth Bass", "Arpeggiator", "Electric Guitar"],
    techniques: ["Driving Rhythm", "Gated Reverb", "Warm Analog Synths", "Upbeat Tempo"],
    soundDesign: ["FM Synthesis Pad", "Reverb Tail", "Risers/Sweeps"],
  },
  "Epic Cinematic Trailer": {
    genre: "Orchestral",
    mood: "Epic",
    instruments: ["Brass Section", "String Section", "Timpani", "Choir", "Gong"],
    techniques: ["Orchestral Swells", "Dynamic Builds", "Wall of Sound", "Intricate Arrangements"],
    soundDesign: ["Risers/Sweeps", "808 Sub Bass", "Reverse Cymbals"],
  },
  "Acoustic Coffeehouse": {
    genre: "Acoustic",
    mood: "Hopeful",
    instruments: ["Acoustic Guitar", "Piano", "Cajon", "Double Bass", "Cello"],
    techniques: ["Clean Production", "Lush Harmonies", "Slow Tempo", "Catchy Melodies"],
    soundDesign: ["Reverb Tail", "Kontakt Noire Piano", "Field Recordings"],
  },
  "Dark Techno Club": {
    genre: "Techno",
    mood: "Intense",
    instruments: ["Drum Machine", "Synth Bass", "Synthesizer", "Sampler", "TB-303"],
    techniques: ["Driving Rhythm", "Minimalist Repetition", "Sidechain Compression", "Syncopated Rhythm"],
    soundDesign: ["Industrial Noise", "Low-pass Filter Sweep", "Reese Bass"],
  },
  "Trap Banger": {
    genre: "Trap",
    mood: "Energetic",
    instruments: ["TR-808", "Synth Lead", "Sampler", "Synth Pad", "Vocal Chops"],
    techniques: ["Heavy Autotune", "Syncopated Rhythm", "Upbeat Tempo", "Slick Bassline"],
    soundDesign: ["808 Sub Bass", "Risers/Sweeps", "Warped Vocal Sample"],
  },
  "Reggaeton Beach Party": {
    genre: "Reggaeton",
    mood: "Happy",
    instruments: ["Drum Machine", "Synth Bass", "Synthesizer", "Marimba", "Brass Section"],
    techniques: ["Driving Rhythm", "Syncopated Rhythm", "Upbeat Tempo", "Catchy Melodies"],
    soundDesign: ["Nexus 4", "Risers/Sweeps", "Reverb Tail"],
  },
  // Games
  "UNDERTALE": {
    genre: "Video Game Music",
    mood: "Nostalgic",
    instruments: ["Piano", "Synthesizer", "String Section", "Acoustic Drums", "Synth Lead"],
    techniques: ["Catchy Melodies", "Dynamic Builds", "Minimalist Repetition", "Arpeggiated"],
    soundDesign: ["Bitcrushed", "Wavetable Synthesis"],
  },
  "Stardew Valley": {
    genre: "Folk",
    mood: "Peaceful",
    instruments: ["Acoustic Guitar", "Flute", "Piano", "String Section", "Marimba"],
    techniques: ["Lush Harmonies", "Slow Tempo", "Catchy Melodies", "Clean Production"],
    soundDesign: ["Nature Sounds", "Reverb Tail"],
  },
  "Final Fantasy": {
    genre: "Orchestral",
    mood: "Epic",
    instruments: ["Orchestral", "Choir", "Piano", "Harp", "Timpani"],
    techniques: ["Orchestral Swells", "Dynamic Builds", "Intricate Arrangements", "Counterpoint Melody"],
    soundDesign: ["Ethereal Pads", "Reverb Tail"],
  },
  "The Legend of Zelda": {
    genre: "Orchestral",
    mood: "Triumphant",
    instruments: ["Orchestral", "Flute", "Harp", "French Horn", "Timpani"],
    techniques: ["Orchestral Swells", "Catchy Melodies", "Dynamic Builds"],
    soundDesign: ["Ambient Soundscapes", "Risers/Sweeps"],
  },
  "Cyberpunk 2077": {
    genre: "Synthwave",
    mood: "Dark",
    instruments: ["Synthesizer", "Drum Machine", "Synth Bass", "Sampler", "Electric Guitar"],
    techniques: ["Driving Rhythm", "Gritty Distortion", "Sidechain Compression", "Syncopated Rhythm"],
    soundDesign: ["Industrial Noise", "Glitch Effects", "Reese Bass", "Subtractive Synthesis"],
  },
  "DOOM": {
    genre: "Heavy Metal",
    mood: "Intense",
    instruments: ["Electric Guitar", "Drum Machine", "Synth Bass", "Modular Synth"],
    techniques: ["Gritty Distortion", "Driving Rhythm", "Polyrhythmic", "Wall of Sound"],
    soundDesign: ["Industrial Noise", "Bitcrushed", "Glitch Effects"],
  },
  "Persona 5": {
    genre: "Acid Jazz",
    mood: "Groovy",
    instruments: ["Bass Guitar", "Electric Guitar", "Drums", "Piano", "String Section"],
    techniques: ["Funk", "Slick Bassline", "Catchy Melodies", "Upbeat Tempo"],
    soundDesign: ["Clean Production", "Warped Vocal Sample"],
  },
  "Celeste": {
    genre: "Electronic",
    mood: "Hopeful",
    instruments: ["Piano", "Synthesizer", "Synth Pad", "Drum Machine", "Arpeggiator"],
    techniques: ["Atmospheric", "Dynamic Builds", "Ethereal Pads", "Catchy Melodies"],
    soundDesign: ["Granular Synthesis", "Reverb Tail"],
  },
  "Minecraft": {
    genre: "Ambient",
    mood: "Calm",
    instruments: ["Piano", "String Section", "Synth Pad", "Celesta"],
    techniques: ["Minimalist Repetition", "Slow Tempo", "Lush Harmonies"],
    soundDesign: ["Ambient Soundscapes", "Reverb Tail"],
  },
  "Red Dead Redemption 2": {
    genre: "Country",
    mood: "Somber",
    instruments: ["Acoustic Guitar", "Banjo", "Violin", "Harmonica", "Double Bass"],
    techniques: ["Folk", "Atmospheric", "Slow Tempo", "Clean Production"],
    soundDesign: ["Field Recordings", "Nature Sounds"],
  },
  "The Witcher 3": {
    genre: "Folk",
    mood: "Mysterious",
    instruments: ["Lute", "Viola", "Flute", "Choir", "Drums"],
    techniques: ["Medieval", "Orchestral Swells", "Ethereal Pads", "Lush Harmonies"],
    soundDesign: ["Ambient Soundscapes", "Foley Sounds"],
  },
  "Skyrim": {
    genre: "Orchestral",
    mood: "Epic",
    instruments: ["Choir", "Timpani", "French Horn", "Cello", "Brass Section"],
    techniques: ["Orchestral Swells", "Driving Rhythm", "Wall of Sound", "Dynamic Builds"],
    soundDesign: ["Reverb Tail", "Risers/Sweeps"],
  },
  "NieR: Automata": {
    genre: "Orchestral",
    mood: "Melancholic",
    instruments: ["String Section", "Choir", "Piano", "Acoustic Guitar", "Vocal Chops"],
    techniques: ["Ethereal Pads", "Dynamic Builds", "Lush Harmonies", "Intricate Arrangements"],
    soundDesign: ["Glitch Effects", "Reverb Tail", "Warped Vocal Sample"],
  },
  "Hollow Knight": {
    genre: "Chamber Music",
    mood: "Gloomy",
    instruments: ["Piano", "Violin", "Cello", "Harpsichord", "Choir"],
    techniques: ["Atmospheric", "Minimalist Repetition", "Counterpoint Melody", "Intricate Arrangements"],
    soundDesign: ["Heavy Reverb", "Reverb Tail"],
  },
  // Anime / Cartoons / Movies
  "Dragon Ball Z": {
    genre: "Hard Rock",
    mood: "Energetic",
    instruments: ["Electric Guitar", "Synth Lead", "Brass Section", "Drums", "Synth Bass"],
    techniques: ["Driving Rhythm", "Upbeat Tempo", "Catchy Melodies", "Punchy Drums"],
    soundDesign: ["Gritty Distortion", "Sidechain Compression"],
  },
  "Dragon Ball Z Dokkan Battle": {
    genre: "J-Rock",
    mood: "Triumphant",
    instruments: ["Synthesizer", "Electric Guitar", "Drum Machine", "Arpeggiator"],
    techniques: ["Electronic", "Upbeat Tempo", "Driving Rhythm", "Catchy Melodies"],
    soundDesign: ["Supersaw Lead", "Sidechain Compression"],
  },
  "Studio Ghibli": {
    genre: "Orchestral",
    mood: "Whimsical",
    instruments: ["Piano", "String Section", "Acoustic Guitar", "Flute", "Celesta"],
    techniques: ["Lush Harmonies", "Orchestral Swells", "Clean Production", "Catchy Melodies"],
    soundDesign: ["Ethereal Pads", "Reverb Tail"],
  },
  "Cowboy Bebop": {
    genre: "Bebop",
    mood: "Groovy",
    instruments: ["Saxophone", "Trumpet", "Double Bass", "Drums", "Piano"],
    techniques: ["Jazz", "Blues", "Slick Bassline", "Syncopated Rhythm"],
    soundDesign: ["Clean Production", "Tape Saturation"],
  },
  "Samurai Champloo": {
    genre: "Lo-fi Hip Hop",
    mood: "Relaxing",
    instruments: ["Sampler", "Turntables", "Drum Machine", "Flute", "Shamisen"],
    techniques: ["Minimalist Repetition", "Slow Tempo", "Sidechain Compression"],
    soundDesign: ["Vinyl Crackle", "Warped Vocal Sample"],
  },
  "Steven Universe": {
    genre: "Indie",
    mood: "Hopeful",
    instruments: ["Ukulele", "Piano", "Synth Pad", "Bass Guitar", "Acoustic Drums"],
    techniques: ["Pop", "Catchy Melodies", "Lush Harmonies", "Clean Production"],
    soundDesign: ["Warm Analog Synths", "Reverb Tail"],
  },
  "Adventure Time": {
    genre: "Alternative Rock",
    mood: "Playful",
    instruments: ["Ukulele", "Synthesizer", "Acoustic Guitar", "Vocal Chops"],
    techniques: ["Chiptune", "Lo-fi Aesthetic", "Catchy Melodies", "Upbeat Tempo"],
    soundDesign: ["Bitcrushed", "Glitchy Vocals"],
  },
  "Attack on Titan": {
    genre: "Symphonic Metal",
    mood: "Epic",
    instruments: ["Orchestral", "Choir", "Timpani", "Electric Guitar", "French Horn"],
    techniques: ["Wall of Sound", "Dynamic Builds", "Orchestral Swells", "Driving Rhythm"],
    soundDesign: ["Risers/Sweeps", "Heavy Reverb"],
  },
  "Naruto": {
    genre: "J-Rock",
    mood: "Energetic",
    instruments: ["Shamisen", "Flute", "Electric Guitar", "Drums", "String Section"],
    techniques: ["Driving Rhythm", "Catchy Melodies", "Upbeat Tempo"],
    soundDesign: ["Clean Production", "Punchy Drums"],
  },
  "JoJo's Bizarre Adventure": {
    genre: "Funk",
    mood: "Energetic",
    instruments: ["Electric Guitar", "Saxophone", "Synth Lead", "Drums", "Bass Guitar"],
    techniques: ["Rock", "Electronic", "Upbeat Tempo", "Driving Rhythm"],
    soundDesign: ["Gritty Distortion", "Punchy Drums"],
  },
  "Looney Tunes": {
    genre: "Orchestral",
    mood: "Chaotic",
    instruments: ["Xylophone", "Trombone", "Clarinet", "Timpani", "Brass Section"],
    techniques: ["Classical", "Dynamic Builds", "Polyrhythmic", "Upbeat Tempo"],
    soundDesign: ["Foley Sounds", "Panning Effects"],
  },
  "Blade Runner": {
    genre: "Synthwave",
    mood: "Dark",
    instruments: ["Analog Synth", "Synth Pad", "Drum Machine", "Saxophone", "Arpeggiator"],
    techniques: ["Atmospheric", "Slow Tempo", "Heavy Reverb", "Warm Analog Synths"],
    soundDesign: ["FM Synthesis Pad", "Reverb Tail", "Risers/Sweeps"],
  },
  "Chainsaw Man": {
    genre: "Industrial",
    mood: "Chaotic",
    instruments: ["Drum Machine", "Synth Bass", "Electric Guitar", "Sampler"],
    techniques: ["Noise Rock", "Gritty Distortion", "Driving Rhythm", "Minimalist Repetition"],
    soundDesign: ["Industrial Noise", "Glitch Effects", "Bitcrushed"],
  },
  "Ghost in the Shell": {
    genre: "Ambient",
    mood: "Mysterious",
    instruments: ["Synth Pad", "Choir", "Sampler", "Drum Machine", "Bells"],
    techniques: ["Atmospheric", "Ethereal Pads", "Slow Tempo", "Polyrhythmic"],
    soundDesign: ["Ambient Soundscapes", "Reverb Tail", "Granular Synthesis"],
  }
};


export const INITIAL_FORM_STATE: SunoPromptInputs = {
  genre: "Lofi Hip Hop",
  mood: "Relaxing",
  instruments: ["Electric Piano", "Drum Machine", "Synth Bass", "Sampler"],
  vocals: "[instrumental]",
  theme: "A quiet, rainy night in a cozy city apartment, watching the world go by from the window.",
  bpm: "85",
  influences: "Nujabes, J Dilla",
  techniques: ["Slow Tempo", "Lo-fi Aesthetic", "Minimalist Repetition"],
  soundDesign: ["Vinyl Crackle", "Warped Vocal Sample"],
  lyrics: "[Verse 1]\nRaindrops on the glass...\n[Chorus]\nCity lights blur to a stream...",
  vibePreset: "",
  chords: "None",
};

export const EMPTY_FORM_STATE: SunoPromptInputs = {
  genre: MUSICAL_GENRES[0],
  mood: MOODS[0],
  instruments: [],
  vocals: VOCALS_OPTIONS[0],
  theme: '',
  bpm: '120',
  influences: '',
  techniques: [],
  soundDesign: [],
  lyrics: '',
  vibePreset: '',
  chords: 'None',
};

export const TERMS_TO_EXCLUDE: string = "bad quality, out of tune, noisy, low fidelity, amateur, abrupt ending, static, distortion, mumbling, gibberish vocals, excessive reverb, clashing elements, generic, uninspired, robotic, artificial sound, metallic, harsh, shrill, muddy, distorted bass, weak drums, lifeless, monotone, repetitive, boring, flat, lifeless, thin, hollow, overproduced, underproduced";