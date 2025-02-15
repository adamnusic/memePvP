import { useEffect, useState } from "react";
import { useParams } from "wouter";
import VRScene from "@/components/game/VRScene";
import { songs } from "@/lib/songs";

export default function Game() {
  const { songId } = useParams();
  const [isVRSupported, setIsVRSupported] = useState(false);
  const song = songs.find(s => s.id === songId);

  useEffect(() => {
    async function checkVRSupport() {
      try {
        if ('xr' in navigator) {
          const supported = await navigator.xr?.isSessionSupported('immersive-vr');
          setIsVRSupported(!!supported);
        }
      } catch (error) {
        console.error('Error checking VR support:', error);
        setIsVRSupported(false);
      }
    }
    checkVRSupport();
  }, []);

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

  if (!isVRSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-center text-white p-8">
          <h1 className="text-3xl font-bold mb-4">VR Not Supported</h1>
          <p>Your browser or device does not support WebXR VR experiences.</p>
        </div>
      </div>
    );
  }

  return <VRScene song={song} />;
}