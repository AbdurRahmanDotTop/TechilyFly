import * as THREE from 'three';

export function initProcessStream(containerId: string) {
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
  
  // Create flowing data stream
  const streamGeometry = new THREE.BufferGeometry();
  const streamPositions = [];
  const streamColors = [];
  
  for(let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 50;
      
      streamPositions.push(x, y, z);
      
      // HSL for Coral spectrum: Coral is #FF7759
      // Let's create a range around Coral
      const color = new THREE.Color();
      const h = 0.03 + (Math.random() * 0.05); // Red-orange hue
      const s = 0.8 + (Math.random() * 0.2); 
      const l = 0.5 + (Math.random() * 0.2);
      color.setHSL(h, s, l);
      
      streamColors.push(color.r, color.g, color.b);
  }
  
  streamGeometry.setAttribute('position', new THREE.Float32BufferAttribute(streamPositions, 3));
  streamGeometry.setAttribute('color', new THREE.Float32BufferAttribute(streamColors, 3));
  
  const streamMaterial = new THREE.PointsMaterial({ 
      size: 0.1, 
      vertexColors: true,
      transparent: true,
      opacity: 0.6
  });
  
  const stream = new THREE.Points(streamGeometry, streamMaterial);
  scene.add(stream);
  
  camera.position.z = 20;
  
  let animationFrameId: number;
  let isVisible = true;

  function animate() {
      if (!isVisible) return;
      
      const positions = stream.geometry.attributes.position.array as Float32Array;
      for(let i = 0; i < positions.length; i += 3) {
          positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
          positions[i + 1] += Math.cos(Date.now() * 0.001 + i) * 0.01;
      }
      stream.geometry.attributes.position.needsUpdate = true;
      
      stream.rotation.y += 0.002;
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
