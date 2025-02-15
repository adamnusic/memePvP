import { create } from 'zustand';

type SoundStore = {
  comboCount: number;
  incrementCombo: () => void;
  resetCombo: () => void;
};

// Create a store to manage combo state
export const useSoundStore = create<SoundStore>((set) => ({
  comboCount: 0,
  incrementCombo: () => set((state) => ({ comboCount: state.comboCount + 1 })),
  resetCombo: () => set({ comboCount: 0 }),
}));

// Sound cache to prevent reloading
const soundCache = new Map<string, HTMLAudioElement>();

const SOUND_FILES = [
  '/attached_assets/Bing_fx_pitch_+0.wav',
  '/attached_assets/Bing_fx_pitch_+1.wav',
  '/attached_assets/Bing_fx_pitch_+2.wav',
  '/attached_assets/Bing_fx_pitch_+3.wav',
  '/attached_assets/Bing_fx_pitch_+4.wav',
  '/attached_assets/Bing_fx_pitch_+5.wav',
];

// Preload all sounds
export const preloadSounds = () => {
  SOUND_FILES.forEach(soundUrl => {
    if (!soundCache.has(soundUrl)) {
      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      soundCache.set(soundUrl, audio);
    }
  });
};

export const playHitSound = (comboCount: number) => {
  // Get the appropriate sound based on combo count
  const soundIndex = Math.min(comboCount, SOUND_FILES.length - 1);
  const soundUrl = SOUND_FILES[soundIndex];
  
  // Get or create the audio element
  let audio = soundCache.get(soundUrl);
  if (!audio) {
    audio = new Audio(soundUrl);
    audio.volume = 0.5;
    soundCache.set(soundUrl, audio);
  }

  // Reset and play the sound
  audio.currentTime = 0;
  audio.play().catch(err => console.error('Error playing sound:', err));
};

// Initialize sound preloading
preloadSounds();
