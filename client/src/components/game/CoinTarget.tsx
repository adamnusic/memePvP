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

  const handleHit = (e: any) => {
    e?.stopPropagation();
    setIsSliced(true);
    playHitSound(soundStore.comboCount);
    soundStore.incrementCombo();
    setTimeout(onHit, 100);
  };

  // Move coin and handle rotation
  useFrame(() => {
    if (meshRef.current && !isSliced) {
      // Update rotation
      meshRef.current.rotation.y += 0.02;

      // Calculate new position
      const elapsed = (Date.now() - startTime.current) / 1000;
      const speed = 2; // Adjust this value to control coin speed
      meshRef.current.position.z = initialPosition.current.z + (elapsed * speed);

      // Check if coin has moved too far
      if (meshRef.current.position.z > 5) {
        soundStore.resetCombo();
        onHit();
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[position[0], position[1], position[2] - 2]} intensity={1.5} />

      {!isSliced ? (
        isVR ? (
          <Interactive onSelect={handleHit}>
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
          </Interactive>
        ) : (
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
        )
      ) : (
        <SlicedCoin
          position={position}
          texture={texture}
          onComplete={onHit}
        />
      )}
    </>
  );
}