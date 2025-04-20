import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';

interface ThreeMFViewerProps {
  modelUrl: string;
  width?: number;
  height?: number;
}

const ThreeMFViewer: React.FC<ThreeMFViewerProps> = ({ modelUrl, width = 512, height = 512 }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Add stronger directional lighting for better contrast
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Lower intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(50, 50, 100);
    scene.add(directionalLight);

    // Optional: add a backlight for edge highlighting
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-50, -50, -100);
    scene.add(backLight);

    let model: THREE.Object3D | null = null;
    const loader = new ThreeMFLoader();
    loader.load(
      modelUrl,
      (object: THREE.Object3D) => {
        model = object;
        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model?.position.sub(center);

        // Detect theme and set model color for dark mode
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
          model?.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => {
                  if ((mat as THREE.MeshStandardMaterial).color) {
                    (mat as THREE.MeshStandardMaterial).color.set('#3DDA83');
                  }
                });
              } else if ((mesh.material as THREE.MeshStandardMaterial).color) {
                (mesh.material as THREE.MeshStandardMaterial).color.set('#3DDA83');
              }
            }
          });
        }
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading 3MF model:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (model) scene.remove(model);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [modelUrl, width, height]);

  return <div ref={mountRef} style={{ width: '100%', height: '50vh', display: 'block' }}><h2>3D Model Viewer</h2></div>;
};

export default ThreeMFViewer;
