export function createLoop({ renderer, scene, camera, updatables = [] }) {
  let running = false;
  let last = performance.now();

  function frame(now) {
    if (!running) return;
    const delta = Math.min((now - last) / 1000, 0.1); // clamp big pauses
    last = now;

    for (const u of updatables) {
      if (typeof u.tick === "function") u.tick(delta);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    },
    stop() {
      running = false;
    },
    get isRunning() {
      return running;
    },
  };
}
