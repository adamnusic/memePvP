import { create } from 'zustand';

interface XRState {
  isVRMode: boolean;
  setVRMode: (enabled: boolean) => void;
}

export const useXRStore = create<XRState>((set) => ({
  isVRMode: false,
  setVRMode: (enabled) => set({ isVRMode: enabled }),
}));