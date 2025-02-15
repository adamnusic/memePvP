import { create } from 'zustand';
import type { WebXRManager } from 'three';

interface XRState {
  xrManager: WebXRManager | null;
  setXRManager: (manager: WebXRManager) => void;
}

export const useXRStore = create<XRState>((set) => ({
  xrManager: null,
  setXRManager: (manager) => set({ xrManager: manager }),
}));