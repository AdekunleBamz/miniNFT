import { useState, useCallback } from 'react';

/**
 * Enhanced hook for copying text to clipboard with status feedback
 * @param {Object} options - Configuration options
 * @returns {Object} - Copy function and status
 */
function useCopyToClipboard({ resetDelay = 2000 } = {}) {
  const [status, setStatus] = useState('idle'); // idle | copying | success | error
  const [copiedText, setCopiedText] = useState(null);

  const copy = useCallback(async (text) => {
    if (!text || typeof text !== 'string') {
      console.warn('useCopyToClipboard: Invalid text provided');
      return false;
    }

    setStatus('copying');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopiedText(text);
      setStatus('success');

      if (resetDelay > 0) {
        setTimeout(() => {
          setStatus('idle');
          setCopiedText(null);
        }, resetDelay);
      }

      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      setStatus('error');
      
      setTimeout(() => setStatus('idle'), resetDelay);
      return false;
    }
  }, [resetDelay]);

  const reset = useCallback(() => {
    setStatus('idle');
    setCopiedText(null);
  }, []);

  return {
    copy,
    reset,
    status,
    copiedText,
    isCopying: status === 'copying',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
}

export default useCopyToClipboard;
