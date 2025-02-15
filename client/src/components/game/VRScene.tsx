import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { create } from 'zustand';
import { Song } from '@/lib/songs';
import Environment from './Environment';
import GameController from './GameController';

type VRSceneProps = {
  song: Song;
};

// Create a proper VR store with required XR state
interface XRState {
  session: XRSession | null;
  isPresenting: boolean;
}

const useXRStore = create<XRState>(() => ({
  session: null,
  isPresenting: false,
}));

export default function VRScene({ song }: VRSceneProps) {
  const [score, setScore] = useState(0);

  const handleScore = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <>
      <VRButton />
      <div className="absolute top-4 left-4 text-white text-2xl font-bold z-10">
        Score: {score}
      </div>

      <Canvas>
        <XR>
          <Environment />
          <GameController 
            songUrl={song.url} 
            onScore={handleScore}
          />
        </XR>
      </Canvas>
    </>
  );
}