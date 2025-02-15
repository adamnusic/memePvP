import { useEffect, useState } from "react";
import { useParams } from "wouter";
import GameScene from "@/components/game/GameScene";
import { songs } from "@/lib/songs";
import { Button } from "@/components/ui/button";

export default function Game() {
  const { songId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [debug, setDebug] = useState<string>('Waiting to start...');
  const song = songs.find(s => s.id === songId);

  const handleStartGame = async () => {
    try {
      setDebug('Initializing audio context...');
      // Initialize audio context on user interaction
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
          <h1 className="text-3xl font-bold mb-4">{song.title}</h1>
          <p className="mb-8">Use your mouse to click the coins and score points!</p>
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

  return <GameScene song={song} />;
}