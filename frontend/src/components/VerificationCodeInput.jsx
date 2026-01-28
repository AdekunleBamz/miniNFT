import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * VerificationCodeInput Component
 * A multi-input verification code/OTP field with keyboard and paste support.
 */
function VerificationCodeInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  label = 'Verification code',
  helperText = 'Enter the code we sent you',
  className = '',
  disabled = false,
  ...props
}) {
  const [code, setCode] = useState(() => Array.from({ length }, () => ''));
  const inputRefs = useRef([]);

  const normalizedValue = useMemo(() => value.slice(0, length), [value, length]);

  useEffect(() => {
    if (normalizedValue) {
      const next = Array.from({ length }, (_, idx) => normalizedValue[idx] || '');
      setCode(next);
    }
  }, [normalizedValue, length]);

  useEffect(() => {
    if (!normalizedValue) {
      setCode(Array.from({ length }, () => ''));
    }
  }, [normalizedValue, length]);

  const focusIndex = (index) => {
    const target = inputRefs.current[index];
    if (target) target.focus();
  };

  const emitChange = (nextCode) => {
    const nextValue = nextCode.join('');
    onChange?.(nextValue);
    if (nextValue.length === length && !nextCode.includes('')) {
      onComplete?.(nextValue);
    }
  };

  const handleInputChange = (event, index) => {
    const rawValue = event.target.value;
    const nextChar = rawValue.slice(-1);
    const updated = [...code];

    if (!nextChar) {
      updated[index] = '';
      setCode(updated);
      emitChange(updated);
      return;
    }

    if (!/^[0-9a-zA-Z]$/.test(nextChar)) {
      return;
    }

    updated[index] = nextChar;
    setCode(updated);
    emitChange(updated);

    if (index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      if (code[index]) {
        const updated = [...code];
        updated[index] = '';
        setCode(updated);
        emitChange(updated);
      } else if (index > 0) {
        focusIndex(index - 1);
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      focusIndex(index - 1);
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\s+/g, '')
      .split('')
      .filter((char) => /^[0-9a-zA-Z]$/.test(char))
      .slice(0, length)
      .join('');

    if (!pasted) return;

    const updated = Array.from({ length }, (_, idx) => pasted[idx] || '');
    setCode(updated);
    emitChange(updated);

    const nextIndex = Math.min(pasted.length, length - 1);
    focusIndex(nextIndex);
  };

  return (
    <div className={`verification-code ${className}`} {...props}>
      <div className="verification-code__header">
        <span className="verification-code__label">{label}</span>
        {helperText && <span className="verification-code__helper">{helperText}</span>}
      </div>
      <div
        className="verification-code__inputs"
        style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }}
        onPaste={handlePaste}
      >
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            className="verification-code__input"
            value={digit}
            onChange={(event) => handleInputChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            disabled={disabled}
            aria-label={`${label} digit ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default VerificationCodeInput;
