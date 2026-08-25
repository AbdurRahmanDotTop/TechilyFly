import * as THREE from 'three';

export function initProcessStream(containerId: string) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as any).connection;
  const isSlowNetwork = connection && (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType));

  if (prefersReducedMotion || isSlowNetwork) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, stream: THREE.Points;
  let isPlaying = false;
  let animationId: number;

  function init() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(container) container.appendChild(renderer.domElement);

    // Create flowing data stream
    const streamGeometry = new THREE.BufferGeometry();
    const streamPositions = [];
    const streamColors = [];
    
    for(let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 50;
      streamPositions.push(x, y, z);
      
      // Alternate between tf-coral and tf-cloud
      if (Math.random() > 0.5) {
        streamColors.push(1.0, 0.467, 0.349); // tf-coral
      } else {
        streamColors.push(0.98, 0.98, 0.98); // tf-cloud
      }
    }
    
    streamGeometry.setAttribute('position', new THREE.Float32BufferAttribute(streamPositions, 3));
    streamGeometry.setAttribute('color', new THREE.Float32BufferAttribute(streamColors, 3));
    
    const streamMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });
    
    stream = new THREE.Points(streamGeometry, streamMaterial);
    scene.add(stream);

    window.addEventListener('resize', onWindowResize);
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      isPlaying = false;
      cancelAnimationFrame(animationId);
    } else {
      if (!isPlaying) {
        isPlaying = true;
        animate();
      }
    }
  }

  function animate() {
    if (!isPlaying) return;
    animationId = requestAnimationFrame(animate);
    
    if (stream) {
      const positions = stream.geometry.attributes.position.array as Float32Array;
      for(let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.01;
        positions[i + 1] += Math.cos(Date.now() * 0.001 + i) * 0.01;
      }
      stream.geometry.attributes.position.needsUpdate = true;
      stream.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!renderer) init();
        isPlaying = true;
        animate();
      } else {
        isPlaying = false;
        cancelAnimationFrame(animationId);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(container);
}
