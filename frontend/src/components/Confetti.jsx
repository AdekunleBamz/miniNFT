/**
 * Confetti animation component for celebrations
 */
import React, { useEffect, useRef, useCallback } from 'react';

export function Confetti({ 
  active = false, 
  duration = 3000,
  particleCount = 100,
  spread = 70,
  origin = { x: 0.5, y: 0.5 },
  colors = ['#7b3fe4', '#00d4ff', '#00ff88', '#f59e0b', '#ff4757'],
  onComplete
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const createParticle = useCallback(() => {
    const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
    const velocity = 10 + Math.random() * 10;
    
    return {
      x: origin.x * window.innerWidth,
      y: origin.y * window.innerHeight,
      vx: Math.sin(angle) * velocity,
      vy: -Math.cos(angle) * velocity - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'square' : 'circle',
    };
  }, [spread, origin, colors]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.3; // gravity
      particle.rotation += particle.rotationSpeed;
      particle.opacity -= 0.01;

      if (particle.opacity <= 0) return false;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;

      if (particle.shape === 'square') {
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      return true;
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, createParticle);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup after duration
    const timeout = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      onComplete?.();
    }, duration);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timeout);
    };
  }, [active, particleCount, duration, createParticle, animate, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}

export function ConfettiButton({ children, onClick, ...props }) {
  const [showConfetti, setShowConfetti] = React.useState(false);

  const handleClick = (e) => {
    setShowConfetti(true);
    onClick?.(e);
  };

  return (
    <>
      <button onClick={handleClick} {...props}>
        {children}
      </button>
      <Confetti
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </>
  );
}

export function useConfettiEffect() {
  const [isActive, setIsActive] = React.useState(false);

  const trigger = useCallback((options = {}) => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), options.duration || 3000);
  }, []);

  const Component = useCallback(
    (props) => <Confetti active={isActive} {...props} />,
    [isActive]
  );

  return { trigger, Component, isActive };
}

export default Confetti;
