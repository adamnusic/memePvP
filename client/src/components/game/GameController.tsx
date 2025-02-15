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
  const audioRef = useRef<HTMLAudioElement>();
  const analyzerRef = useRef<AudioAnalyzer>();
  const { camera } = useThree();

  useEffect(() => {
    if (!analyzerRef.current) {
      analyzerRef.current = new AudioAnalyzer();
    }

    const audio = new Audio();
    audio.src = songUrl;
    audio.crossOrigin = "anonymous";

    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });

    audio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and can play');
      audio.play().catch(e => console.error('Play error:', e));
    });

    audioRef.current = audio;

    if (audioRef.current) {
      analyzerRef.current.connect(audioRef.current);
      analyzerRef.current.resume();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      analyzerRef.current?.disconnect();
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