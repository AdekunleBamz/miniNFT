/**
 * Animation utility functions for MiniNFT
 */

// Easing functions
export const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeOutElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: t => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

/**
 * Animate a value from start to end over duration
 */
export function animate({ from, to, duration = 300, easing = 'easeOutQuad', onUpdate, onComplete }) {
  const startTime = performance.now();
  const easingFn = typeof easing === 'function' ? easing : easings[easing] || easings.linear;

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);
    const currentValue = from + (to - from) * easedProgress;

    onUpdate?.(currentValue);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  }

  requestAnimationFrame(tick);
}

/**
 * Animate multiple properties simultaneously
 */
export function animateMultiple({ properties, duration = 300, easing = 'easeOutQuad', onUpdate, onComplete }) {
  const startTime = performance.now();
  const easingFn = typeof easing === 'function' ? easing : easings[easing] || easings.linear;

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);

    const values = {};
    for (const [key, { from, to }] of Object.entries(properties)) {
      values[key] = from + (to - from) * easedProgress;
    }

    onUpdate?.(values);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  }

  requestAnimationFrame(tick);
}

/**
 * Spring animation for natural motion
 */
export function spring({ from, to, stiffness = 100, damping = 10, mass = 1, onUpdate, onComplete }) {
  let velocity = 0;
  let current = from;
  const threshold = 0.01;

  function tick() {
    const displacement = current - to;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;
    
    velocity += acceleration * 0.016; // ~60fps
    current += velocity * 0.016;

    onUpdate?.(current);

    if (Math.abs(displacement) > threshold || Math.abs(velocity) > threshold) {
      requestAnimationFrame(tick);
    } else {
      onUpdate?.(to);
      onComplete?.();
    }
  }

  requestAnimationFrame(tick);
}

/**
 * Create a staggered animation for multiple elements
 */
export function stagger(items, { delay = 50, duration = 300, easing = 'easeOutQuad', onUpdate, onComplete }) {
  let completed = 0;

  items.forEach((item, index) => {
    setTimeout(() => {
      animate({
        from: 0,
        to: 1,
        duration,
        easing,
        onUpdate: (value) => onUpdate?.(item, value, index),
        onComplete: () => {
          completed++;
          if (completed === items.length) {
            onComplete?.();
          }
        },
      });
    }, index * delay);
  });
}

/**
 * Typewriter effect for text
 */
export function typewriter(text, { speed = 50, onUpdate, onComplete }) {
  let index = 0;

  function tick() {
    if (index <= text.length) {
      onUpdate?.(text.slice(0, index));
      index++;
      setTimeout(tick, speed);
    } else {
      onComplete?.();
    }
  }

  tick();
}

/**
 * Number counter animation
 */
export function countUp({ from = 0, to, duration = 1000, decimals = 0, onUpdate, onComplete }) {
  animate({
    from,
    to,
    duration,
    easing: 'easeOutQuad',
    onUpdate: (value) => onUpdate?.(value.toFixed(decimals)),
    onComplete,
  });
}

/**
 * Shake animation for error feedback
 */
export function shake(element, { intensity = 10, duration = 500 }) {
  const startTime = performance.now();
  const originalTransform = element.style.transform;

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = elapsed / duration;

    if (progress < 1) {
      const decay = 1 - progress;
      const x = Math.sin(progress * Math.PI * 8) * intensity * decay;
      element.style.transform = `${originalTransform} translateX(${x}px)`;
      requestAnimationFrame(tick);
    } else {
      element.style.transform = originalTransform;
    }
  }

  requestAnimationFrame(tick);
}

/**
 * Pulse animation for attention
 */
export function pulse(element, { scale = 1.1, duration = 300, times = 2 }) {
  let count = 0;

  function doPulse() {
    if (count < times) {
      element.style.transition = `transform ${duration / 2}ms ease-out`;
      element.style.transform = `scale(${scale})`;

      setTimeout(() => {
        element.style.transform = 'scale(1)';
        setTimeout(() => {
          count++;
          doPulse();
        }, duration / 2);
      }, duration / 2);
    }
  }

  doPulse();
}

/**
 * Fade in animation
 */
export function fadeIn(element, { duration = 300, from = 0, to = 1, onComplete }) {
  element.style.opacity = from;
  element.style.transition = `opacity ${duration}ms ease-out`;

  requestAnimationFrame(() => {
    element.style.opacity = to;
    setTimeout(onComplete, duration);
  });
}

/**
 * Fade out animation
 */
export function fadeOut(element, { duration = 300, from = 1, to = 0, onComplete }) {
  element.style.opacity = from;
  element.style.transition = `opacity ${duration}ms ease-out`;

  requestAnimationFrame(() => {
    element.style.opacity = to;
    setTimeout(onComplete, duration);
  });
}

/**
 * Slide animation
 */
export function slide(element, { direction = 'up', distance = 20, duration = 300, onComplete }) {
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const sign = direction === 'up' || direction === 'left' ? -1 : 1;
  
  element.style.transform = `translate${axis}(${sign * distance}px)`;
  element.style.opacity = '0';
  element.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;

  requestAnimationFrame(() => {
    element.style.transform = `translate${axis}(0)`;
    element.style.opacity = '1';
    setTimeout(onComplete, duration);
  });
}

export default {
  easings,
  animate,
  animateMultiple,
  spring,
  stagger,
  typewriter,
  countUp,
  shake,
  pulse,
  fadeIn,
  fadeOut,
  slide,
};
