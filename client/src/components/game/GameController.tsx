import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import CoinTarget from './CoinTarget';
import { AudioAnalyzer } from './AudioAnalyzer';

type GameControllerProps = {
  songUrl: string;
  onScore: (points: number) => void;
  onDebugUpdate: (message: string) => void;
};

export default function GameController({ songUrl, onScore, onDebugUpdate }: GameControllerProps) {
  const groupRef = useRef<Group>(null);
  const [coins, setCoins] = useState<{ id: number; position: [number, number, number] }[]>([]);
  const audioRef = useRef<HTMLAudioElement>();
  const analyzerRef = useRef<AudioAnalyzer>();
  const { camera } = useThree();

  useEffect(() => {
    console.log('Starting audio initialization...');
    onDebugUpdate('Starting audio initialization...');

    const initAudio = async () => {
      try {
        // Create new audio element
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = songUrl;
        audio.volume = 1.0;

        console.log('Created audio element with URL:', songUrl);
        onDebugUpdate('Loading audio file...');

        // Create analyzer if it doesn't exist
        if (!analyzerRef.current) {
          console.log('Creating new AudioAnalyzer');
          analyzerRef.current = new AudioAnalyzer();
        }

        // Set up audio element event listeners
        audio.addEventListener('loadstart', () => {
          console.log('Audio loading started');
          onDebugUpdate('Loading audio...');
        });

        audio.addEventListener('error', (e) => {
          const error = e.currentTarget as HTMLAudioElement;
          console.error('Audio loading error:', error.error);
          onDebugUpdate(`Error loading audio: ${error.error?.message || 'Unknown error'}`);
        });

        audio.addEventListener('canplaythrough', async () => {
          console.log('Audio loaded and ready to play');
          onDebugUpdate('Audio loaded, initializing...');
          try {
            if (analyzerRef.current) {
              const connected = await analyzerRef.current.connect(audio);
              if (connected) {
                console.log('Starting audio playback...');
                onDebugUpdate('Starting playback...');
                await audio.play();
                console.log('Audio playback started successfully');
                onDebugUpdate('Game running');
              }
            }
          } catch (error) {
            console.error('Error starting audio playback:', error);
            onDebugUpdate(`Error starting playback: ${error}`);
          }
        });

        audioRef.current = audio;

      } catch (error) {
        console.error('Error in audio initialization:', error);
        onDebugUpdate(`Audio initialization failed: ${error}`);
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
  }, [songUrl, onDebugUpdate]);

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