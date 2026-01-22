import { useState, useRef, useCallback } from 'react';

const ImageUploader = ({ onUpload, maxSize = 5, accept = 'image/*' }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  
  const maxBytes = maxSize * 1024 * 1024;
  
  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return 'Please upload an image file';
    }
    if (file.size > maxBytes) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  };
  
  const processFile = useCallback(async (file) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    setUploading(true);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUploading(false);
    
    if (onUpload) {
      onUpload(file);
    }
  }, [onUpload, maxBytes]);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };
  
  const handleClick = () => {
    inputRef.current?.click();
  };
  
  const handleRemove = () => {
    setPreview(null);
    setError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  return (
    <div className="image-uploader">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="uploader-input"
      />
      
      {preview ? (
        <div className="uploader-preview">
          <img src={preview} alt="Preview" />
          <div className="uploader-preview-overlay">
            <button onClick={handleRemove} className="uploader-remove-btn">
              ✕ Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`uploader-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <div className="uploader-loading">
              <div className="uploader-spinner"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <div className="uploader-icon">📷</div>
              <p className="uploader-text">
                Drag & drop an image here, or click to select
              </p>
              <p className="uploader-hint">
                Max size: {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}
      
      {error && <div className="uploader-error">{error}</div>}
    </div>
  );
};

export default ImageUploader;
