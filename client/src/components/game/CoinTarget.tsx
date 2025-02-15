import { useRef, useState } from 'react';
import { Mesh, Texture } from 'three';
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
      meshRef.current.rotation.y += 0.02;
      meshRef.current.position.z += 0.1;

      if (meshRef.current.position.z > 5) {
        // Reset combo when coin is missed
        soundStore.resetCombo();
        onHit();
      }
    }
  });

  // Render the coin mesh
  const CoinMesh = () => (
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
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[position[0], position[1], position[2] - 2]} intensity={1.5} />

      {!isSliced ? (
        isVR ? (
          <Interactive onSelect={handleHit}>
            <CoinMesh />
          </Interactive>
        ) : (
          <CoinMesh />
        )
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