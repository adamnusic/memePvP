import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { Song } from '@/lib/songs';
import Environment from './Environment';
import GameController from './GameController';
import { useXRStore } from '@/lib/xr-store';

type VRSceneProps = {
  song: Song;
};

export default function VRScene({ song }: VRSceneProps) {
  const [score, setScore] = useState(0);
  const setIsPresenting = useXRStore((state) => state.setIsPresenting);

  const handleScore = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <VRButton
        onSessionStart={() => setIsPresenting(true)}
        onSessionEnd={() => setIsPresenting(false)}
      />
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
    </div>
  );
}