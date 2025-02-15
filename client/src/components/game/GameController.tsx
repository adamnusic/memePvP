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
    console.log('Initializing audio system...');

    if (!analyzerRef.current) {
      console.log('Creating new AudioAnalyzer');
      analyzerRef.current = new AudioAnalyzer();
    }

    const audio = new Audio();
    audio.src = songUrl;
    audio.crossOrigin = "anonymous";
    audio.volume = 1.0; // Ensure volume is up

    audio.addEventListener('loadstart', () => {
      console.log('Audio loading started');
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });

    audio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and ready to play');
      // Initialize analyzer after audio is loaded
      if (audioRef.current && analyzerRef.current) {
        try {
          console.log('Connecting audio analyzer...');
          analyzerRef.current.connect(audioRef.current);
          analyzerRef.current.resume();
          audioRef.current.play()
            .then(() => console.log('Audio playback started'))
            .catch(e => console.error('Audio play error:', e));
        } catch (error) {
          console.error('Error initializing audio:', error);
        }
      }
    });

    audioRef.current = audio;

    return () => {
      console.log('Cleaning up audio resources');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      analyzerRef.current?.disconnect();
    };
  }, [songUrl]);

  useFrame(() => {
    if (analyzerRef.current?.getBeatDetection()) {
      console.log('Beat detected!');
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