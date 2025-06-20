
import React from 'react';

interface UploadFileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const UploadFileInput: React.FC<UploadFileInputProps> = ({ 
  fileInputRef,
  onChange,
  disabled
}) => {
  return (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      multiple
      className="hidden"
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default UploadFileInput;
