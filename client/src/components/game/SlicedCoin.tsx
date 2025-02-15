import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Texture, Vector3 } from 'three';

type SlicedCoinProps = {
  position: [number, number, number];
  texture: Texture | null;
  onComplete: () => void;
};

export default function SlicedCoin({ position, texture, onComplete }: SlicedCoinProps) {
  const leftHalfRef = useRef<Mesh>(null);
  const rightHalfRef = useRef<Mesh>(null);
  const startTime = useRef(Date.now());
  
  // Initial velocities for the halves
  const leftVelocity = new Vector3(-0.1, 0.05, 0);
  const rightVelocity = new Vector3(0.1, 0.05, 0);
  const rotationSpeed = 0.1;
  const gravity = -0.001;

  useFrame(() => {
    if (!leftHalfRef.current || !rightHalfRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    
    // Update left half
    leftHalfRef.current.position.x += leftVelocity.x;
    leftHalfRef.current.position.y += leftVelocity.y;
    leftHalfRef.current.rotation.z -= rotationSpeed;
    leftVelocity.y += gravity;

    // Update right half
    rightHalfRef.current.position.x += rightVelocity.x;
    rightHalfRef.current.position.y += rightVelocity.y;
    rightHalfRef.current.rotation.z += rotationSpeed;
    rightVelocity.y += gravity;

    // Complete animation after 1 second
    if (elapsed > 1) {
      onComplete();
    }
  });

  return (
    <group position={position}>
      {/* Left half */}
      <mesh ref={leftHalfRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32, 1, false, 0, Math.PI]} />
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
      
      {/* Right half */}
      <mesh ref={rightHalfRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32, 1, false, Math.PI, Math.PI]} />
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
