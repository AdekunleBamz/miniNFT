import { useEffect, useCallback } from 'react';

function Modal({ isOpen, onClose, title, children, size = 'medium' }) {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large',
    full: 'modal-full'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal ${sizeClasses[size]}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'primary' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <p className="modal-message">{message}</p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          {cancelText}
        </button>
        <button className={`btn btn-${variant}`} onClick={() => { onConfirm(); onClose(); }}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default Modal;
