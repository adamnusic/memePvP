import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import CoinTarget from './CoinTarget';
import { AudioAnalyzer } from './AudioAnalyzer';

type GameControllerProps = {
  songUrl: string;
  onScore: (points: number) => void;
};

export default function GameController({ songUrl, onScore }: GameControllerProps) {
  const groupRef = useRef<Group>(null);
  const [coins, setCoins] = useState<{ id: number; position: [number, number, number] }[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyzerRef = useRef<AudioAnalyzer>();
  const { camera } = useThree();

  useEffect(() => {
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer();
    }

    const audio = new Audio(songUrl);
    audioRef.current = audio;
    audio.play();

    if (audioRef.current) {
      analyzerRef.current.connect(audioRef.current);
      analyzerRef.current.resume();
    }

    return () => {
      analyzerRef.current?.disconnect();
      audio.pause();
    };
  }, [songUrl]);

  useFrame(() => {
    if (analyzerRef.current?.getBeatDetection()) {
      const newCoin = {
        id: Date.now(),
        position: [
          Math.random() * 10 - 5, // x: -5 to 5
          Math.random() * 3 + 1,  // y: 1 to 4
          -15 // z: start far back
        ] as [number, number, number]
      };
      setCoins(prev => [...prev, newCoin]);
    }
  });

  const handleCoinHit = (coinId: number) => {
    setCoins(prev => prev.filter(coin => coin.id !== coinId));
    onScore(100);
  };

  return (
    <group ref={groupRef}>
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