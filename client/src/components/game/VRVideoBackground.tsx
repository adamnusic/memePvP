import { useEffect, useState } from 'react';
import { VideoTexture, LinearFilter, RGBFormat } from 'three';
import { useThree } from '@react-three/fiber';

export default function VRVideoBackground() {
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);
  const { scene } = useThree();

  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/attached_assets/F4LL3N.mp4';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;

    // Create video texture when video is ready
    video.addEventListener('loadedmetadata', () => {
      const texture = new VideoTexture(video);
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;
      texture.format = RGBFormat;
      setVideoTexture(texture);
      video.play().catch(err => console.error("Error playing video:", err));
    });

    return () => {
      video.pause();
      video.src = '';
      if (videoTexture) {
        videoTexture.dispose();
      }
    };
  }, []);

  if (!videoTexture) return null;

  return (
    <mesh position={[0, 0, -30]} scale={[60, 35, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={videoTexture} opacity={0.6} transparent={true} />
    </mesh>
  );
}
