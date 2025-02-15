import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { useXRStore } from '@/lib/xr-store';
import { Song } from '@/lib/songs';
import Environment from './Environment';
import GameController from './GameController';

type VRSceneProps = {
  song: Song;
};

export default function VRScene({ song }: VRSceneProps) {
  const [score, setScore] = useState(0);
  const store = useXRStore();

  const handleScore = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <VRButton />
      <div className="absolute top-4 left-4 text-white text-2xl font-bold z-10">
        Score: {score}
      </div>

      <Canvas
        camera={{ position: [0, 1.5, 3] }}
        gl={{
          antialias: true,
          xr: { enabled: true }
        }}
      >
        <XR store={store}>
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