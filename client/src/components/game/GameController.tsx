import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { useXR } from '@react-three/xr';
import CoinTarget from './CoinTarget';
import { AudioAnalyzer } from './AudioAnalyzer';
import { useXRStore } from '@/lib/xr-store';

type GameControllerProps = {
  songUrl: string;
  onScore: (points: number) => void;
};

export default function GameController({ songUrl, onScore }: GameControllerProps) {
  const groupRef = useRef<Group>(null);
  const [coins, setCoins] = useState<{ id: number; position: [number, number, number] }[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyzerRef = useRef<AudioAnalyzer>();
  const { isPresenting } = useXRStore();

  useEffect(() => {
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer();
    }

    if (audioRef.current) {
      analyzerRef.current.connect(audioRef.current);
    }

    return () => {
      analyzerRef.current?.disconnect();
    };
  }, []);

  useFrame(() => {
    if (analyzerRef.current?.getBeatDetection()) {
      const newCoin = {
        id: Date.now(),
        position: [
          Math.random() * 4 - 2, // x: -2 to 2
          Math.random() * 2 + 1, // y: 1 to 3
          -20 // z: start far back
        ] as [number, number, number]
      };
      setCoins(prev => [...prev, newCoin]);
    }
  });

  const handleCoinHit = (coinId: number) => {
    setCoins(prev => prev.filter(coin => coin.id !== coinId));
    onScore(100);
  };

  useEffect(() => {
    if (isPresenting && audioRef.current) {
      audioRef.current.play();
      analyzerRef.current?.resume();
    }
  }, [isPresenting]);

  return (
    <group ref={groupRef}>
      <audio ref={audioRef} src={songUrl} loop={false} />

      {coins.map(coin => (
        <CoinTarget
          key={coin.id}
          position={coin.position}
          onHit={() => handleCoinHit(coin.id)}
        />
      ))}
    </group>
  );
}