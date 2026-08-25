import * as THREE from 'three';

export function initHeroParticles(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Create floating geometric shapes
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.7, 0.3, 16, 100),
    new THREE.SphereGeometry(1, 16, 16)
  ];
  
  const materials = [
    new THREE.MeshPhongMaterial({ color: 0xff7759, transparent: true, opacity: 0.7 }), // tf-coral
    new THREE.MeshPhongMaterial({ color: 0xff9680, transparent: true, opacity: 0.7 }), // tf-coral-light
    new THREE.MeshPhongMaterial({ color: 0xe85c3f, transparent: true, opacity: 0.7 }), // tf-coral-dark
    new THREE.MeshPhongMaterial({ color: 0xc9c9c9, transparent: true, opacity: 0.7 }), // graphite light
    new THREE.MeshPhongMaterial({ color: 0xfafafa, transparent: true, opacity: 0.7 })  // cloud
  ];
  
  const meshes: THREE.Mesh[] = [];
  for(let i = 0; i < 15; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.x = (Math.random() - 0.5) * 20;
    mesh.position.y = (Math.random() - 0.5) * 20;
    mesh.position.z = (Math.random() - 0.5) * 20;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    scene.add(mesh);
    meshes.push(mesh);
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);
  
  camera.position.z = 15;

  let animationFrameId: number;
  let isVisible = true;

  const tick = () => {
    if (!isVisible) return;
    
    meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        mesh.scale.set(0.4, 0.4, 0.4); 
    });
    
    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        tick();
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
