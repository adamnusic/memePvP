import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR, Controllers, Hands, useXR } from '@react-three/xr';
import { Song } from '@/lib/songs';
import Environment from './Environment';
import GameController from './GameController';
import VideoBackground from './VideoBackground';
import { RayGrab } from '@react-three/xr';

type VRSceneProps = {
  song: Song;
};

// Debug component to show controller status
function ControllerStatus() {
  const { player, controllers } = useXR();

  if (!player) return null;

  return (
    <group>
      {controllers.map((controller, i) => (
        <mesh key={i} position={controller.controller.position}>
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
    </group>
  );
}

export default function VRScene({ song }: VRSceneProps) {
  const [score, setScore] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const handleScore = (points: number) => {
    setScore(prev => prev + points);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <VRButton />
      <div className="absolute top-4 left-4 text-white text-2xl font-bold z-10 bg-black/50 p-2 rounded">
        Score: {score}
      </div>
      <div className="absolute top-16 left-4 text-white text-sm z-10 bg-black/50 p-2 rounded">
        {debugInfo}
      </div>

      <Canvas
        camera={{ position: [0, 1.6, 5.4], fov: 50 }}
        gl={{ 
          antialias: true,
          xrCompatible: true
        }}
      >
        <XR>
          <Controllers rayMaterial={{ color: 'blue' }} />
          <Hands />
          <ControllerStatus />
          <Environment />
          <GameController 
            songUrl={song.url} 
            onScore={handleScore}
            onDebugUpdate={setDebugInfo}
            isVR={true}
          />
        </XR>
      </Canvas>
    </div>
  );
}