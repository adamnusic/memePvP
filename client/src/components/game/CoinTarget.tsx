import { useRef, useState } from 'react';
import { Mesh, Texture, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Interactive } from '@react-three/xr';
import { getRandomCoinTexture } from '@/lib/coinAssets';
import SlicedCoin from './SlicedCoin';
import { useSoundStore, playHitSound } from './SoundManager';

type CoinTargetProps = {
  position: [number, number, number];
  onHit: () => void;
  isVR?: boolean;
};

export default function CoinTarget({ position, onHit, isVR = false }: CoinTargetProps) {
  const meshRef = useRef<Mesh>(null);
  const [texture, setTexture] = useState<Texture | null>(null);
  const [isSliced, setIsSliced] = useState(false);
  const soundStore = useSoundStore();
  const startTime = useRef(Date.now());
  const initialPosition = useRef(new Vector3(...position));

  // Load texture when component mounts
  useState(() => {
    let isMounted = true;
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
  });

  const handleHit = () => {
    console.log("Coin hit!"); // Debug log
    if (!isSliced) {
      setIsSliced(true);
      playHitSound(soundStore.comboCount);
      soundStore.incrementCombo();
      setTimeout(onHit, 100);
    }
  };

  // Move coin and handle rotation
  useFrame(() => {
    if (meshRef.current && !isSliced) {
      // Update rotation
      meshRef.current.rotation.y += 0.02;

      // Calculate new position
      const elapsed = (Date.now() - startTime.current) / 1000;
      const speed = 5; // Increased from 2 to 5 for faster movement
      meshRef.current.position.z = initialPosition.current.z + (elapsed * speed);

      // Check if coin has moved too far
      if (meshRef.current.position.z > 5) {
        soundStore.resetCombo();
        onHit();
      }
    }
  });

  if (isSliced) {
    return (
      <SlicedCoin
        position={position}
        texture={texture}
        onComplete={onHit}
      />
    );
  }

  // VR mode with Interactive wrapper
  if (isVR) {
    return (
      <Interactive onSelect={handleHit}>
        <group>
          <pointLight position={[0, 0, -2]} intensity={1.5} />
          <mesh
            ref={meshRef}
            position={position}
            rotation={[Math.PI / 2, 0, 0]}
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
        </group>
      </Interactive>
    );
  }

  // Browser mode
  return (
    <group onClick={handleHit}>
      <pointLight position={[0, 0, -2]} intensity={1.5} />
      <mesh
        ref={meshRef}
        position={position}
        rotation={[Math.PI / 2, 0, 0]}
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
    </group>
  );
}