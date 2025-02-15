import { useRef, useEffect, useState } from 'react';
import { Mesh, Texture } from 'three';
import { useFrame } from '@react-three/fiber';
import { getRandomCoinTexture } from '@/lib/coinAssets';

type CoinTargetProps = {
  position: [number, number, number];
  onHit: () => void;
};

export default function CoinTarget({ position, onHit }: CoinTargetProps) {
  const meshRef = useRef<Mesh>(null);
  const [texture, setTexture] = useState<Texture | null>(null);

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
    if (meshRef.current) {
      // Rotate around Y axis for spinning animation
      meshRef.current.rotation.y += 0.02;
      // Move coin towards player
      meshRef.current.position.z += 0.1;

      if (meshRef.current.position.z > 5) {
        onHit();
      }
    }
  });

  return (
    <>
      {/* Add ambient light for global illumination */}
      <ambientLight intensity={0.5} />

      {/* Add point light to illuminate the coin */}
      <pointLight position={[position[0], position[1], position[2] - 2]} intensity={1.5} />

      <mesh 
        ref={meshRef} 
        position={position}
        // Rotate 90 degrees around X axis to face the camera
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onHit();
        }}
      >
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial 
          color="#DDDDDD" // Reduced from pure white to a light gray
          metalness={0.2} // Keep low metalness for texture visibility
          roughness={0.3} // Keep low roughness for shine
          map={texture}
          // Enable double-sided rendering
          side={2}
          // Adjust emission for balanced visibility
          emissive="#404040"
          emissiveIntensity={0.6}
        />
      </mesh>
    </>
  );
}