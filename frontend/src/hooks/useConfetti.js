import { useCallback, useRef } from 'react';

const CONFETTI_COLORS = ['#7b3fe4', '#00d4ff', '#ff6b6b', '#00ff88', '#ffd93d', '#ff85a1'];

function createConfettiPiece(container) {
  const piece = document.createElement('div');
  piece.className = 'confetti-piece';
  piece.style.setProperty('--confetti-color', CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]);
  piece.style.left = `${Math.random() * 100}%`;
  piece.style.animationDuration = `${2 + Math.random() * 2}s`;
  piece.style.animationDelay = `${Math.random() * 0.5}s`;
  
  const size = 8 + Math.random() * 8;
  piece.style.width = `${size}px`;
  piece.style.height = `${size}px`;
  
  // Random shape
  const shapes = ['circle', 'square', 'triangle'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  piece.dataset.shape = shape;
  
  container.appendChild(piece);
  
  return piece;
}

export function useConfetti() {
  const containerRef = useRef(null);

  const fire = useCallback((options = {}) => {
    const { count = 50, duration = 3000 } = options;
    
    // Create container if not exists
    let container = document.querySelector('.confetti-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'confetti-container';
      document.body.appendChild(container);
    }
    containerRef.current = container;
    
    // Create confetti pieces
    const pieces = [];
    for (let i = 0; i < count; i++) {
      pieces.push(createConfettiPiece(container));
    }
    
    // Cleanup after animation
    setTimeout(() => {
      pieces.forEach(piece => piece.remove());
      if (container.children.length === 0) {
        container.remove();
      }
    }, duration);
  }, []);

  const fireFromCenter = useCallback(() => {
    fire({ count: 80, duration: 3500 });
  }, [fire]);

  const fireFromSides = useCallback(() => {
    fire({ count: 40, duration: 3000 });
  }, [fire]);

  return {
    fire,
    fireFromCenter,
    fireFromSides,
  };
}

export default useConfetti;
