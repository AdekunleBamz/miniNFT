import React, { useRef, useState } from 'react';

/**
 * FileDropzone Component
 * Drag and drop area for file selection
 */
function FileDropzone({
  onFileSelect,
  accept = '*',
  maxSize, // in bytes
  multiple = false,
  className = '',
  ...props
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      // Validate type
      if (accept !== '*' && !accept.split(',').some(type => {
        const regex = new RegExp(type.replace('*', '.*'));
        return regex.test(file.type);
      })) {
        return false;
      }
      
      // Validate size
      if (maxSize && file.size > maxSize) {
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0 && onFileSelect) {
      onFileSelect(multiple ? validFiles : validFiles[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div
      className={`file-dropzone ${isDragOver ? 'file-dropzone--active' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload file"
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <div className="file-dropzone__content">
        <svg className="file-dropzone__icon" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="file-dropzone__text">
          Drag & drop files here, or click to select
        </p>
        <p className="file-dropzone__hint">
          {accept !== '*' ? `Accepts: ${accept}` : ''}
          {accept !== '*' && maxSize ? ' • ' : ''}
          {maxSize ? `Max size: ${(maxSize / 1024 / 1024).toFixed(1)}MB` : ''}
        </p>
      </div>
    </div>
  );
}

export default FileDropzone;
