import { useThree, useLoader } from '@react-three/fiber';
import { VideoTexture, LinearFilter, RGBFormat } from 'three';
import { useEffect, useRef } from 'react';

export default function Environment() {
  const { scene } = useThree();
  const videoRef = useRef<HTMLVideoElement>();
  const textureRef = useRef<VideoTexture>();

  // Set background to null to allow video to show through
  scene.background = null;

  useEffect(() => {
    // Create and setup video element
    const video = document.createElement('video');
    video.src = '/attached_assets/F4LL3N.mp4';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    // Create video texture
    const texture = new VideoTexture(video);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.format = RGBFormat;

    videoRef.current = video;
    textureRef.current = texture;

    // Start playing video
    video.play().catch(err => 
      console.error("Error playing video texture:", err)
    );

    return () => {
      video.pause();
      video.src = '';
      texture.dispose();
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <gridHelper args={[100, 100]} />

      {/* Ground plane with video texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial 
          map={textureRef.current}
          transparent={true}
          opacity={0.3}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
    </>
  );
}