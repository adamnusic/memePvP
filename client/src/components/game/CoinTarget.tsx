import { useRef, useEffect, useState } from 'react';
import { Mesh, Texture } from 'three';
import { useFrame } from '@react-three/fiber';
import { getRandomCoinTexture } from '@/lib/coinAssets';
import CoinExplosion from './CoinExplosion';

type CoinTargetProps = {
  position: [number, number, number];
  onHit: () => void;
};

export default function CoinTarget({ position, onHit }: CoinTargetProps) {
  const meshRef = useRef<Mesh>(null);
  const [texture, setTexture] = useState<Texture | null>(null);
  const [isExploding, setIsExploding] = useState(false);

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
    if (meshRef.current && !isExploding) {
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
    setIsExploding(true);
    // Delay the onHit callback until explosion starts
    setTimeout(onHit, 100);
  };

  return (
    <>
      {/* Add ambient light for global illumination */}
      <ambientLight intensity={0.5} />

      {/* Add point light to illuminate the coin */}
      <pointLight position={[position[0], position[1], position[2] - 2]} intensity={1.5} />

      {!isExploding ? (
        <mesh 
          ref={meshRef} 
          position={position}
          // Rotate 90 degrees around X axis to face the camera
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
        <CoinExplosion
          position={position}
          onComplete={() => setIsExploding(false)}
        />
      )}
    </>
  );
}