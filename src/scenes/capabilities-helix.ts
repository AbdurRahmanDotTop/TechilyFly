import * as THREE from 'three';

export function initCapabilitiesHelix(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);
  
  // Create DNA helix structure
  const helixGeometry = new THREE.BufferGeometry();
  const helixPositions = [];
  const helixColors = [];
  
  // Coral RGB values for tf-coral: #FF7759 (255, 119, 89) -> (1.0, 0.46, 0.35)
  // Cloud RGB values for tf-cloud: #FAFAFA (250, 250, 250) -> (0.98, 0.98, 0.98)
  
  for(let i = 0; i < 200; i++) {
      const angle = (i / 200) * Math.PI * 8;
      const x = Math.cos(angle) * 3;
      const y = (i / 200) * 20 - 10;
      const z = Math.sin(angle) * 3;
      
      helixPositions.push(x, y, z);
      
      if (i % 2 === 0) {
        helixColors.push(1.0, 0.46, 0.35); // Coral
      } else {
        helixColors.push(0.98, 0.98, 0.98); // Cloud
      }
  }
  
  helixGeometry.setAttribute('position', new THREE.Float32BufferAttribute(helixPositions, 3));
  helixGeometry.setAttribute('color', new THREE.Float32BufferAttribute(helixColors, 3));
  
  const helixMaterial = new THREE.PointsMaterial({ 
      size: 0.15, 
      vertexColors: true,
      transparent: true,
      opacity: 0.8
  });
  
  const helix = new THREE.Points(helixGeometry, helixMaterial);
  scene.add(helix);
  
  camera.position.z = 15;
  
  let animationFrameId: number;
  let isVisible = true;

  function animate() {
      if (!isVisible) return;
      helix.rotation.y += 0.005;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        animate();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });
  }, { threshold: 0 });

  observer.observe(container);

  window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
