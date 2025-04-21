import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeMFViewerProps {
  modelUrl: string;
  width?: number;
  height?: number;
}

const ThreeMFViewer: React.FC<ThreeMFViewerProps> = ({ modelUrl, width = 512, height = 512 }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [color, setColor] = React.useState('#3DDA83');

  useEffect(() => {
    if (!mountRef.current) return;
    let controls: any = null;
    let loader: any = null;
    let model: THREE.Object3D | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let scene: THREE.Scene | null = null;
    let isMounted = true;

    (async () => {
      const OrbitControlsModule = await import('three/examples/jsm/controls/OrbitControls');
      const ThreeMFLoaderModule = await import('three/examples/jsm/loaders/3MFLoader');
      if (!isMounted) return;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 0, 100);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);

      controls = new OrbitControlsModule.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controlsRef.current = controls;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(50, 50, 100);
      scene.add(directionalLight);
      const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
      backLight.position.set(-50, -50, -100);
      scene.add(backLight);

      loader = new ThreeMFLoaderModule.ThreeMFLoader();
      loader.load(
        modelUrl,
        (object: THREE.Object3D) => {
          model = object;
          modelRef.current = model;
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model?.position.sub(center);
          model?.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => {
                  if ((mat as THREE.MeshStandardMaterial).color) {
                    (mat as THREE.MeshStandardMaterial).color.set(color);
                  }
                });
              } else if ((mesh.material as THREE.MeshStandardMaterial).color) {
                (mesh.material as THREE.MeshStandardMaterial).color.set(color);
              }
            }
          });
          scene.add(model);
        },
        undefined,
        (error: Error) => {
          console.error('Error loading 3MF model:', error);
        }
      );

      const animate = () => {
        if (!isMounted) return;
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();
    })();

    return () => {
      isMounted = false;
      if (model && scene) scene.remove(model);
      if (renderer && mountRef.current) {
        renderer.dispose();
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, width, height, color]);

  const handleResetView = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(0, 0, 100);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <div className='three-mf-viewer' style={{ position: 'relative', width, height }}>
      <h2>3D Model Viewer</h2>
      <div ref={mountRef} style={{ width, height }} />
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 2 }}>
        <button onClick={handleResetView} title='Reset camera position'>Reset View</button>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }} title='Change model color'>
          <span style={{ fontSize: 12 }}>Color</span>
          <input type='color' value={color} onChange={handleColorChange} />
        </label>
      </div>
      <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 12, zIndex: 2 }}>
        <span>Use mouse to rotate, scroll to zoom, right-click to pan.</span>
      </div>
    </div>
  );
};

export default ThreeMFViewer;
