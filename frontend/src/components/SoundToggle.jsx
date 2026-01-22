import { useSound } from '../hooks';

function SoundToggle() {
  const { isEnabled, toggleSound } = useSound();

  return (
    <button
      className="sound-toggle"
      onClick={toggleSound}
      aria-label={`${isEnabled ? 'Mute' : 'Unmute'} sounds`}
      title={`${isEnabled ? 'Mute' : 'Unmute'} sounds`}
    >
      <span className="sound-toggle-icon">
        {isEnabled ? '🔊' : '🔇'}
      </span>
    </button>
  );
}

export default SoundToggle;
