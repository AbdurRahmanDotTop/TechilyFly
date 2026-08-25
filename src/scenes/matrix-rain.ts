export function initMatrixRain(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  // Characters - using katakana + latin
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');
  
  const fontSize = 14;
  let columns = width / fontSize;
  
  let drops: number[] = [];
  for(let x = 0; x < columns; x++) {
    drops[x] = Math.random() * -100; // Start off-screen randomly
  }

  let animationFrameId: number;
  let isVisible = true;

  const draw = () => {
    if (!isVisible) return;

    // Black background with opacity to create trail effect
    ctx.fillStyle = 'rgba(33, 33, 33, 0.04)'; // Graphite base
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#FF7759'; // TF Coral for the text
    ctx.font = `${fontSize}px "Geist Mono", monospace`;
    
    for(let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      
      // Add slight highlight to lead character
      if (Math.random() > 0.95) {
        ctx.fillStyle = '#FF9680'; // Lighter coral for some chars
      } else {
        ctx.fillStyle = '#FF7759'; // Base coral mostly
      }

      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if(drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      
      drops[i]++;
    }
    
    // Throttle frame rate for matrix effect
    setTimeout(() => {
      animationFrameId = requestAnimationFrame(draw);
    }, 50);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        draw();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });
  }, { threshold: 0 });

  observer.observe(canvas);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = width / fontSize;
    drops = [];
    for(let x = 0; x < columns; x++) {
      drops[x] = 1;
    }
  });
}
