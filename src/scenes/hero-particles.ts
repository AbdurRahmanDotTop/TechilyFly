import * as THREE from 'three';

export function initHeroParticles(containerId: string) {
  // Check for reduced motion or slow network
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as any).connection;
  const isSlowNetwork = connection && (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType));

  if (prefersReducedMotion || isSlowNetwork) {
    return; // Fallback to CSS gradients
  }

  const container = document.getElementById(containerId);
  if (!container) return;

  let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, particles: THREE.Points;
  let particleVelocities: number[] = [];
  let isPlaying = false;
  let animationId: number;

  function init() {
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if(container) container.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particleCount = 100;
    
    const positions = [];
    for (let i = 0; i < particleCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      particleVelocities.push(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xFF7759, // tf-coral
      size: 0.2, // Adjusted size for visibility
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

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
    
    if (particles) {
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += particleVelocities[i];
        positions[i + 1] += particleVelocities[i + 1];
        positions[i + 2] += particleVelocities[i + 2];

        // Wrap particles around screen boundaries
        if (positions[i] > 50) positions[i] = -50;
        if (positions[i] < -50) positions[i] = 50;
        if (positions[i + 1] > 50) positions[i + 1] = -50;
        if (positions[i + 1] < -50) positions[i + 1] = 50;
        if (positions[i + 2] > 50) positions[i + 2] = -50;
        if (positions[i + 2] < -50) positions[i + 2] = 50;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.001;
    }
    
    renderer.render(scene, camera);
  }

  init();
  isPlaying = true;
  animate();
}
