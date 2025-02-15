import { useEffect } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Color } from 'three';

// Define paths to our FBX models
const ROAD_MODELS = [
  '/attached_assets/Road_wood_1.fbx',
  '/attached_assets/Road_wood_2.fbx',
  '/attached_assets/Road_wood_3.fbx',
  '/attached_assets/Road_wood_4.fbx'
];

const LAMP_MODELS = [
  '/attached_assets/Lamp_1.fbx',
  '/attached_assets/Lamp_2.fbx',
  '/attached_assets/Lamp_3.fbx',
  '/attached_assets/Lamp_4.fbx'
];

export default function Environment() {
  const { scene } = useThree();

  // Load road sections
  const roadModels = ROAD_MODELS.map(path => useLoader(FBXLoader, path));
  const lampModels = LAMP_MODELS.map(path => useLoader(FBXLoader, path));

  useEffect(() => {
    // Set scene background to a dark color
    scene.background = new Color('#1a1a1a');

    // Position models in the scene
    roadModels.forEach((model, index) => {
      model.position.z = -index * 10; // Place roads one after another
      model.position.y = -2; // Lower the road slightly
      model.scale.set(0.05, 0.05, 0.05); // Scale down the models
      scene.add(model);
    });

    // Add lamps along the road
    lampModels.forEach((lamp, index) => {
      const side = index % 2 === 0 ? 1 : -1; // Alternate sides
      const position = Math.floor(index / 2);

      lamp.position.set(side * 3, -1.5, -position * 10);
      lamp.scale.set(0.05, 0.05, 0.05);
      lamp.rotation.y = side > 0 ? Math.PI : 0; // Face inward
      scene.add(lamp);
    });

    return () => {
      // Cleanup models when component unmounts
      roadModels.forEach(model => scene.remove(model));
      lampModels.forEach(model => scene.remove(model));
    };
  }, [scene, roadModels, lampModels]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <fog attach="fog" args={['#1a1a1a', 10, 50]} />
    </>
  );
}