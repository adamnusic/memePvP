import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3 } from 'three';
import { useTexture } from '@react-three/drei';

type CoinExplosionProps = {
  position: [number, number, number];
  onComplete: () => void;
};

const PARTICLE_COUNT = 15;
const EXPLOSION_FORCE = 0.2;
const LIFETIME = 1000; // milliseconds

export default function CoinExplosion({ position, onComplete }: CoinExplosionProps) {
  const meshRef = useRef<InstancedMesh>(null);
  const startTime = useRef(Date.now());
  const particleVelocities = useRef<Vector3[]>([]);
  const tempObject = useRef(new Object3D());

  // Initialize particle velocities
  useEffect(() => {
    particleVelocities.current = Array(PARTICLE_COUNT)
      .fill(null)
      .map(() => new Vector3(
        (Math.random() - 0.5) * EXPLOSION_FORCE,
        (Math.random() - 0.5) * EXPLOSION_FORCE,
        (Math.random() - 0.5) * EXPLOSION_FORCE
      ));
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const elapsed = Date.now() - startTime.current;
    const progress = elapsed / LIFETIME;

    if (progress >= 1) {
      onComplete();
      return;
    }

    // Update each particle
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const velocity = particleVelocities.current[i];
      
      tempObject.current.position.set(
        position[0] + velocity.x * elapsed * 0.01,
        position[1] + velocity.y * elapsed * 0.01,
        position[2] + velocity.z * elapsed * 0.01
      );

      // Scale down particles over time
      const scale = 1 - progress;
      tempObject.current.scale.set(scale, scale, scale);
      
      tempObject.current.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.current.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFA500"
        emissiveIntensity={0.5}
        metalness={0.7}
        roughness={0.3}
      />
    </instancedMesh>
  );
}
