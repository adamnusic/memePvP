import { useEffect, useState } from "react";
import { useParams } from "wouter";
import GameScene from "@/components/game/GameScene";
import VRScene from "@/components/game/VRScene";
import { songs } from "@/lib/songs";
import { Button } from "@/components/ui/button";

export default function Game() {
  const { songId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [debug, setDebug] = useState<string>('Waiting to start...');
  const song = songs.find(s => s.id === songId);

  useEffect(() => {
    // Check if WebXR is supported
    if ('xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-vr')
        .then((supported: boolean) => setIsVRSupported(supported))
        .catch(() => setIsVRSupported(false));
    }
  }, []);

  const handleStartGame = async () => {
    try {
      setDebug('Initializing audio context...');
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      await audioContext.resume();
      setDebug('Audio context initialized successfully');
      setIsPlaying(true);
    } catch (error) {
      setDebug(`Error initializing audio: ${error}`);
      console.error('Error initializing audio:', error);
    }
  };

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-center text-white p-8">
          <h1 className="text-3xl font-bold mb-4">Song Not Found</h1>
          <p>The selected song could not be found.</p>
        </div>
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-center text-white p-8">
          <h1 className="text-3xl font-bold mb-4">Meme PvP</h1>
          <p className="mb-8">
            {isVRSupported
              ? 'Put on your VR headset and get ready to dance!'
              : 'Use your mouse to click the coins and score points!'}
          </p>
          <Button
            onClick={handleStartGame}
            className="bg-gradient-to-r from-yellow-400 to-orange-600 hover:opacity-90 mb-4"
          >
            Start Game
          </Button>
          <p className="text-sm text-gray-300">{debug}</p>
        </div>
      </div>
    );
  }

  return isVRSupported ? <VRScene song={song} /> : <GameScene song={song} />;
}