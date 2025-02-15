import { useEffect, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { AnimationMixer, Group, LoopRepeat, TextureLoader } from 'three';
import * as THREE from 'three';

export default function DancingCharacter() {
  const groupRef = useRef<Group>(null);
  const mixerRef = useRef<AnimationMixer | null>(null);

  // Load the FBX model and its animations
  const fbx = useLoader(FBXLoader, '/attached_assets/Wave Hip Hop Dance.fbx');
  const texture = useLoader(TextureLoader, '/attached_assets/on1 7173_a.png');

  useEffect(() => {
    if (fbx && fbx.animations.length) {
      // Create a new animation mixer
      const mixer = new AnimationMixer(fbx);
      mixerRef.current = mixer;

      // Apply texture to all meshes in the model
      fbx.traverse((child) => {
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
      groupRef.current.scale.set(0.02, 0.02, 0.02); // Scale down the model
      groupRef.current.position.set(0, -0.5, -0.5); // Position much closer to camera and slightly lower
      groupRef.current.rotation.set(0, Math.PI, 0); // Rotate 180 degrees around Y axis to face camera
    }
  }, []);

  // Update animation on each frame
  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
}