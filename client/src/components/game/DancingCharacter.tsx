import { useEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { AnimationMixer, Group, LoopRepeat, TextureLoader, Vector3 } from 'three';
import * as THREE from 'three';

type DancingCharacterProps = {
  onHit: () => void;
};

export default function DancingCharacter({ onHit }: DancingCharacterProps) {
  const groupRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const targetPosition = useRef(new Vector3(0, -0.5, -0.5));
  const velocity = useRef(new Vector3());
  const boundingBox = useRef(new THREE.Box3());

  // Load the FBX model and its animations
  const fbx = useLoader(FBXLoader, '/attached_assets/Wave Hip Hop Dance.fbx');
  const texture = useLoader(TextureLoader, '/attached_assets/on1 7173_a.png');

  useEffect(() => {
    if (fbx && fbx.animations.length) {
      const mixer = new AnimationMixer(fbx);
      mixerRef.current = mixer;

      // Apply texture to all meshes in the model
      fbx.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.map = texture;
              mat.needsUpdate = true;
            });
          } else {
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      });

      // Play the first animation
      const action = mixer.clipAction(fbx.animations[0]);
      action.setLoop(LoopRepeat, Infinity);
      action.play();

      return () => {
        mixer.stopAllAction();
      };
    }
  }, [fbx, texture]);

  useEffect(() => {
    // Scale and position adjustments
    if (groupRef.current) {
      groupRef.current.scale.set(0.02, 0.02, 0.02);
      groupRef.current.position.set(0, -0.5, -0.5);
      groupRef.current.rotation.set(0, 0, 0);
    }
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    // Update bounding box
    boundingBox.current.setFromObject(groupRef.current);

    // Dodge logic - move away from incoming coins
    const dodgeSpeed = 2;
    const maxOffset = 2;  // Maximum distance to move left/right
    const returnSpeed = 1;

    // Random dodge movement
    if (Math.random() < 0.02) {  // 2% chance per frame to change direction
      targetPosition.current.x = (Math.random() - 0.5) * maxOffset * 2;
    }

    // Smooth movement towards target
    const currentPos = groupRef.current.position;
    velocity.current.x += (targetPosition.current.x - currentPos.x) * dodgeSpeed * delta;
    velocity.current.x *= 0.95; // Damping

    // Apply movement
    currentPos.x += velocity.current.x * delta;

    // Keep within bounds
    currentPos.x = Math.max(-maxOffset, Math.min(maxOffset, currentPos.x));
  });

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
}