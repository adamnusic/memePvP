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
  const characterTexture = useLoader(TextureLoader, '/attached_assets/on1 7173_a.png');
  const floorTexture = useLoader(TextureLoader, '/attached_assets/4483_a.png');
  const floorNormalMap = useLoader(TextureLoader, '/attached_assets/4483_n.png');

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
              mat.map = characterTexture;
              mat.needsUpdate = true;
            });
          } else {
            child.material.map = characterTexture;
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
  }, [fbx, characterTexture]);

  useEffect(() => {
    // Scale and position adjustments
    if (groupRef.current) {
      groupRef.current.scale.set(0.02, 0.02, 0.02); // Scale down the model
      groupRef.current.position.set(0, 0, -3); // Position it closer to camera (was -5)
      groupRef.current.rotation.set(0, 0, 0); // Reset rotation to face camera
    }
  }, []);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  // Configure floor textures
  if (floorTexture) {
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4); // Repeat the texture
  }

  if (floorNormalMap) {
    floorNormalMap.wrapS = THREE.RepeatWrapping;
    floorNormalMap.wrapT = THREE.RepeatWrapping;
    floorNormalMap.repeat.set(4, 4); // Match the diffuse texture repeat
  }

  return (
    <group ref={groupRef}>
      {/* Dance Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          map={floorTexture}
          normalMap={floorNormalMap}
          normalScale={[0.5, 0.5]} // Adjust the intensity of the normal map
          side={THREE.DoubleSide}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Character Model */}
      <primitive object={fbx} />
    </group>
  );
}