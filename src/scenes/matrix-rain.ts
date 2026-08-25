export function initMatrixRain(canvasId: string) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = (navigator as any).connection;
  const isSlowNetwork = connection && (connection.saveData || ['slow-2g', '2g', '3g'].includes(connection.effectiveType));

  if (prefersReducedMotion || isSlowNetwork) {
    return;
  }

  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const columns = Math.floor(width / 20);
  const drops: number[] = Array(columns).fill(1);
  const chars = "01".split('');

  let isPlaying = false;
  let interval: number;

  function draw() {
    if (!ctx) return;
    ctx.fillStyle = 'rgba(33, 33, 33, 0.1)'; // tf-graphite fade
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FF7759'; // tf-coral
    ctx.font = '15px "Geist Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * 20, drops[i] * 20);

      if (drops[i] * 20 > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  function start() {
    if (!isPlaying) {
      isPlaying = true;
      interval = window.setInterval(draw, 50);
    }
  }

  function stop() {
    if (isPlaying) {
      isPlaying = false;
      clearInterval(interval);
    }
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (isPlaying) start();
  });

  start();
}
