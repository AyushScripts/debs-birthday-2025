export function performUnfoldTransition(callback?: () => void) {
  // Create 8 vertical strips (curtain effect)
  const stripCount = 8;
  const stripWidth = 100 / stripCount;
  const strips: HTMLElement[] = [];

  for (let i = 0; i < stripCount; i++) {
    const strip = document.createElement('div');
    strip.style.position = 'fixed';
    strip.style.left = `${i * stripWidth}%`;
    strip.style.top = '0';
    strip.style.width = `${stripWidth}%`;
    strip.style.height = '100%';
    strip.style.backgroundColor = '#f7cfd8';
    strip.style.zIndex = '9999';
      strip.style.transform = 'translateY(100%)';
      strip.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      document.body.appendChild(strip);
    strips.push(strip);
  }

  // Animate strips revealing from bottom to top with stagger
  // Leftmost strip (index 0) goes first, then rest follow
  setTimeout(() => {
    strips.forEach((strip, index) => {
      setTimeout(() => {
        strip.style.transform = 'translateY(0)';
      }, index * 60); // 60ms stagger between each strip (left to right)
    });
  }, 50);

  // After curtain is fully down, execute callback and pull curtain up
  const totalStaggerTime = (stripCount - 1) * 60; // Time for all strips to come down
  const transitionDuration = 800; // 0.8s per strip
  
  setTimeout(() => {
    if (callback) callback();
    
    // Pull curtain up (rightmost strip goes first, then leftmost)
    setTimeout(() => {
      // Reverse the order: start from last index (rightmost) to first (leftmost)
      for (let i = strips.length - 1; i >= 0; i--) {
        setTimeout(() => {
          strips[i].style.transform = 'translateY(100%)';
        }, (strips.length - 1 - i) * 60);
      }
    }, 200);

    // Clean up after all strips are pulled up
    setTimeout(() => {
      strips.forEach(strip => strip.remove());
    }, totalStaggerTime + transitionDuration + 400);
  }, totalStaggerTime + transitionDuration + 200);
}
