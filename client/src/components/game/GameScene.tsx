import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Song } from '@/lib/songs';
import Environment from './Environment';
import GameController from './GameController';
import VideoBackground from './VideoBackground';

type GameSceneProps = {
  song: Song;
};

export default function GameScene({ song }: GameSceneProps) {
  const [score, setScore] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleScore = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <VideoBackground />
      <div className="absolute top-4 left-4 text-white text-2xl font-bold z-10 bg-black/50 p-2 rounded">
        Score: {score}
      </div>
      <div className="absolute top-16 left-4 text-white text-sm z-10 bg-black/50 p-2 rounded">
        {debugInfo}
      </div>

      <Canvas
        camera={{ position: [0, 2, 8], fov: 75 }}
        gl={{ antialias: true }}
      >
        <Environment />
        <GameController 
          songUrl={song.url} 
          onScore={handleScore}
          onDebugUpdate={setDebugInfo}
        />
      </Canvas>
    </div>
  );
}