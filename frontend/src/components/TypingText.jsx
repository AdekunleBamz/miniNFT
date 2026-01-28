import { useState, useEffect, useRef } from 'react';

/**
 * Typing text animation component
 */
function TypingText({ 
  text = '',
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseTime = 2000,
  loop = false,
  cursor = true,
  cursorChar = '|',
  onComplete,
  className = ''
}) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleTyping = () => {
      if (isPaused) {
        timeoutRef.current = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseTime);
        return;
      }

      if (isDeleting) {
        if (displayText.length === 0) {
          setIsDeleting(false);
          if (!loop) {
            onComplete?.();
            return;
          }
        } else {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (displayText.length === text.length) {
          if (loop) {
            setIsPaused(true);
          } else {
            onComplete?.();
            return;
          }
        } else {
          timeoutRef.current = setTimeout(() => {
            setDisplayText(text.slice(0, displayText.length + 1));
          }, typingSpeed);
        }
      }
    };

    handleTyping();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isDeleting, isPaused, text, typingSpeed, deletingSpeed, pauseTime, loop]);

  return (
    <span className={`typing-text ${className}`}>
      {displayText}
      {cursor && <span className="typing-cursor">{cursorChar}</span>}
    </span>
  );
}

export function TypewriterWords({ words = [], ...props }) {
  const [wordIndex, setWordIndex] = useState(0);
  
  return (
    <TypingText 
      text={words[wordIndex] || ''} 
      loop={true}
      onComplete={() => setWordIndex((prev) => (prev + 1) % words.length)}
      {...props}
    />
  );
}

export default TypingText;
