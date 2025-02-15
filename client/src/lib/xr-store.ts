import { create } from 'zustand';

interface XRState {
  isPresenting: boolean;
  setIsPresenting: (presenting: boolean) => void;
  session: XRSession | null;
  setSession: (session: XRSession | null) => void;
}

export const useXRStore = create<XRState>((set) => ({
  isPresenting: false,
  setIsPresenting: (presenting) => set({ isPresenting: presenting }),
  session: null,
  setSession: (session) => set({ session }),
}));