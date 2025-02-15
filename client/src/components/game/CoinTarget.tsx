import { useRef, useEffect, useState } from 'react';
import { Mesh, Texture } from 'three';
import { useFrame } from '@react-three/fiber';
import { getRandomCoinTexture } from '@/lib/coinAssets';
import SlicedCoin from './SlicedCoin';
import { useSoundStore, playHitSound } from './SoundManager';

type CoinTargetProps = {
  position: [number, number, number];
  onHit: () => void;
};

export default function CoinTarget({ position, onHit }: CoinTargetProps) {
  const meshRef = useRef<Mesh>(null);
  const [texture, setTexture] = useState<Texture | null>(null);
  const [isSliced, setIsSliced] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Load texture when component mounts
    getRandomCoinTexture()
      .then((loadedTexture) => {
        if (isMounted) {
          setTexture(loadedTexture);
        }
      })
      .catch((error) => {
        console.error('Error loading texture:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useFrame(() => {
    if (meshRef.current && !isSliced) {
      // Rotate around Y axis for spinning animation
      meshRef.current.rotation.y += 0.02;
      // Move coin towards player
      meshRef.current.position.z += 0.1;

      if (meshRef.current.position.z > 5) {
        onHit();
      }
    }
  });

  const handleHit = (e: any) => {
    e.stopPropagation();
    setIsSliced(true);

    // Increment combo and play appropriate sound
    const soundStore = useSoundStore.getState();
    playHitSound(soundStore.comboCount);
    soundStore.incrementCombo();

    // Delay the onHit callback until slicing starts
    setTimeout(onHit, 100);
  };

  return (
    <>
      {/* Add ambient light for global illumination */}
      <ambientLight intensity={0.5} />

      {/* Add point light to illuminate the coin */}
      <pointLight position={[position[0], position[1], position[2] - 2]} intensity={1.5} />

      {!isSliced ? (
        <mesh
          ref={meshRef}
          position={position}
          rotation={[Math.PI / 2, 0, 0]}
          onClick={handleHit}
        >
          <cylinderGeometry args={[1, 1, 0.1, 32]} />
          <meshStandardMaterial
            color="#DDDDDD"
            metalness={0.2}
            roughness={0.3}
            map={texture}
            side={2}
            emissive="#404040"
            emissiveIntensity={0.6}
          />
        </mesh>
      ) : (
        <SlicedCoin
          position={position}
          texture={texture}
          onComplete={() => setIsSliced(false)}
        />
      )}
    </>
  );
}