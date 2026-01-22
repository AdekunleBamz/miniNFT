import { useState, useEffect, useCallback } from 'react';

export function useClipboard(timeout = 2000) {
  const [copiedText, setCopiedText] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      setIsCopied(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (isCopied && timeout) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [isCopied, timeout]);

  const reset = useCallback(() => {
    setCopiedText(null);
    setIsCopied(false);
  }, []);

  return { 
    copy, 
    copiedText, 
    isCopied, 
    reset 
  };
}

export default useClipboard;
