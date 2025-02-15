import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, Interactive } from '@react-three/xr';
import { Song } from '@/lib/songs';
import Environment from './Environment';
import GameController from './GameController';

type VRSceneProps = {
  song: Song;
};

export default function VRScene({ song }: VRSceneProps) {
  const [score, setScore] = useState(0);

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
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        gl={{ 
          antialias: true,
          xr: {
            enabled: true,
            frameRate: 90
          }
        }}
      >
        <Environment />
        <GameController 
          songUrl={song.url} 
          onScore={handleScore}
        />
      </Canvas>
    </div>
  );
}