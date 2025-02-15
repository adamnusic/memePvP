import { useEffect, useState } from "react";
import { useParams } from "wouter";
import VRScene from "@/components/game/VRScene";
import { songs } from "@/lib/songs";
import { Button } from "@/components/ui/button";

export default function Game() {
  const { songId } = useParams();
  const [isVRSupported, setIsVRSupported] = useState(false);
  const song = songs.find(s => s.id === songId);

  useEffect(() => {
    async function checkVRSupport() {
      if ('xr' in navigator) {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        setIsVRSupported(supported);
      }
    }
    checkVRSupport();
  }, []);

  if (!song) {
    return <div>Song not found</div>;
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
