import * as THREE from "three";

export function initCapabilitiesHelix(containerId: string) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer;
  let particles: THREE.Points, linesMesh: THREE.LineSegments;
  let positions: Float32Array,
    velocities: { x: number; y: number; z: number }[];
  let isPlaying = false;
  let animationId: number;

  const particleCount = 120;
  const maxDistance = 45;

  function init() {
    scene = new THREE.Scene();

    // Use container rect instead of window to prevent overflow cropping
    const rect = container!.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.z = 150;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    if (container) container.appendChild(renderer.domElement);

    // Create the Plexus (Mixture of dots and lines)
    const pGeometry = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    velocities = [];

    const color1 = new THREE.Color(0xff7759); // tf-coral
    const color2 = new THREE.Color(0xfafafa); // tf-cloud

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 300;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 150;

      // Mix colors for variety
      const mixedColor = Math.random() > 0.4 ? color1 : color2;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      velocities.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3,
      });
    }

    pGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    particles = new THREE.Points(pGeometry, pMaterial);
    scene.add(particles);

    const lGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    lGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3),
    );

    const lMaterial = new THREE.LineBasicMaterial({
      color: 0xff7759,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    linesMesh = new THREE.LineSegments(lGeometry, lMaterial);
    scene.add(linesMesh);

    window.addEventListener("resize", onWindowResize);
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  function onWindowResize() {
    if (!camera || !renderer || !container) return;
    const rect = container!.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;
    camera.aspect = width / (height || 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
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

    let vertexpos = 0;
    let numConnected = 0;

    const linePositions = linesMesh.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      // update positions
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;

      // soft boundaries to bounce back
      if (positions[i * 3] < -150 || positions[i * 3] > 150)
        velocities[i].x *= -1;
      if (positions[i * 3 + 1] < -100 || positions[i * 3 + 1] > 100)
        velocities[i].y *= -1;
      if (positions[i * 3 + 2] < -75 || positions[i * 3 + 2] > 75)
        velocities[i].z *= -1;

      // check connections
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          linePositions[vertexpos++] = positions[i * 3];
          linePositions[vertexpos++] = positions[i * 3 + 1];
          linePositions[vertexpos++] = positions[i * 3 + 2];

          linePositions[vertexpos++] = positions[j * 3];
          linePositions[vertexpos++] = positions[j * 3 + 1];
          linePositions[vertexpos++] = positions[j * 3 + 2];
          numConnected++;
        }
      }
    }

    linesMesh.geometry.setDrawRange(0, numConnected * 2);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.position.needsUpdate = true;

    // Slowly rotate the whole network for extra dynamism
    scene.rotation.y += 0.001;
    scene.rotation.x += 0.0005;

    renderer.render(scene, camera);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!renderer) init();
          isPlaying = true;
          animate();
        } else {
          isPlaying = false;
          cancelAnimationFrame(animationId);
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(container);
}
