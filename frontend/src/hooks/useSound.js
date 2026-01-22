import { useState, useCallback } from 'react';

const SOUND_ENABLED_KEY = 'mininft-sound-enabled';

const SOUNDS = {
  mint: '/sounds/mint.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
};

export function useSound() {
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SOUND_ENABLED_KEY);
      return saved !== 'false';
    }
    return true;
  });

  const toggleSound = useCallback(() => {
    setIsEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem(SOUND_ENABLED_KEY, String(newValue));
      return newValue;
    });
  }, []);

  const play = useCallback((soundName) => {
    if (!isEnabled) return;
    
    const soundUrl = SOUNDS[soundName];
    if (!soundUrl) return;
    
    try {
      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Ignore errors (e.g., user hasn't interacted with page yet)
      });
    } catch {
      // Ignore errors
    }
  }, [isEnabled]);

  const playMint = useCallback(() => play('mint'), [play]);
  const playSuccess = useCallback(() => play('success'), [play]);
  const playError = useCallback(() => play('error'), [play]);
  const playClick = useCallback(() => play('click'), [play]);
  const playHover = useCallback(() => play('hover'), [play]);

  return {
    isEnabled,
    toggleSound,
    play,
    playMint,
    playSuccess,
    playError,
    playClick,
    playHover,
  };
}

export default useSound;
