import { useEffect, useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import CoinTarget from './CoinTarget';
import { AudioAnalyzer } from './AudioAnalyzer';
import { useSoundStore } from './SoundManager';

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
  const lastSpawnTime = useRef(0);
  const { camera } = useThree();

  const MAX_COINS = 5; // Maximum number of coins allowed at once
  const SPAWN_COOLDOWN = 1000; // Minimum time between spawns in milliseconds

  useEffect(() => {
    console.log('Starting audio initialization...');
    onDebugUpdate('Starting audio initialization...');

    const initAudio = async () => {
      try {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = songUrl;
        audio.volume = 1.0;

        console.log('Created audio element with URL:', songUrl);
        onDebugUpdate('Loading audio file...');

        if (!analyzerRef.current) {
          console.log('Creating new AudioAnalyzer');
          analyzerRef.current = new AudioAnalyzer();
        }

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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      analyzerRef.current?.disconnect();
    };
  }, [songUrl, onDebugUpdate]);

  useFrame(() => {
    const currentTime = Date.now();

    // Only spawn if we're under the max limit and enough time has passed
    if (analyzerRef.current?.getBeatDetection() &&
      coins.length < MAX_COINS &&
      currentTime - lastSpawnTime.current > SPAWN_COOLDOWN) {
      console.log('Beat detected - spawning coin!');
      const newCoin = {
        id: Date.now(),
        position: [
          Math.random() * 6 - 3, // x: -3 to 3 (reduced range)
          Math.random() * 2 + 1,  // y: 1 to 3 (reduced range)
          -10 // z: start closer
        ] as [number, number, number]
      };
      setCoins(prev => [...prev, newCoin]);
      lastSpawnTime.current = currentTime;
    }

    // Clean up coins that are too far away and reset combo
    setCoins(prev => {
      const newCoins = prev.filter(coin => {
        const mesh = groupRef.current?.getObjectById(coin.id);
        const keepCoin = mesh ? mesh.position.z <= 5 : true;
        if (!keepCoin) {
          // Reset combo when a coin is missed
          useSoundStore.getState().resetCombo();
        }
        return keepCoin;
      });
      return newCoins;
    });
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