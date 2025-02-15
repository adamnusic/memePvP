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
    console.log('Starting audio initialization...');

    const initAudio = async () => {
      try {
        // Create new audio element
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = songUrl;
        audio.volume = 1.0;

        // Create analyzer if it doesn't exist
        if (!analyzerRef.current) {
          console.log('Creating new AudioAnalyzer');
          analyzerRef.current = new AudioAnalyzer();
        }

        // Set up audio element event listeners
        audio.addEventListener('loadstart', () => console.log('Audio loading started'));
        audio.addEventListener('error', (e) => console.error('Audio loading error:', e));

        audio.addEventListener('canplaythrough', async () => {
          console.log('Audio loaded and ready to play');
          try {
            if (analyzerRef.current) {
              const connected = await analyzerRef.current.connect(audio);
              if (connected) {
                console.log('Starting audio playback...');
                await audio.play();
                console.log('Audio playback started successfully');
              }
            }
          } catch (error) {
            console.error('Error starting audio playback:', error);
          }
        });

        audioRef.current = audio;

      } catch (error) {
        console.error('Error in audio initialization:', error);
      }
    };

    initAudio();

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
      console.log('Beat detected - spawning coin!');
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
          onHit={() => {
            setCoins(prev => prev.filter(c => c.id !== coin.id));
            onScore(100);
          }}
        />
      ))}
    </group>
  );
}