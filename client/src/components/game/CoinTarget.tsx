import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

type CoinTargetProps = {
  position: [number, number, number];
  onHit: () => void;
};

export default function CoinTarget({ position, onHit }: CoinTargetProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.z += 0.1;

      if (meshRef.current.position.z > 5) {
        onHit();
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[1, 1, 0.1, 32]} />
      <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}
