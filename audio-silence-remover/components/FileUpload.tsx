
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon } from './icons';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
}

export function FileUpload({ onFileChange }: FileUploadProps): React.ReactNode {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && (file.type === 'audio/wav' || file.type === 'audio/mpeg')) {
      onFileChange(file);
    } else {
      alert('WAV 또는 MP3 파일만 업로드할 수 있습니다.');
      onFileChange(null);
    }
  }, [onFileChange]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'}`}
    >
      <input
        type="file"
        accept="audio/wav,audio/mpeg"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
        <UploadCloudIcon className={`w-16 h-16 transition-colors duration-300 ${isDragging ? 'text-cyan-400' : 'text-slate-500'}`} />
        <p className="text-slate-300 text-lg">
          여기에 WAV 또는 MP3 파일을 드래그 앤 드롭하거나{' '}
          <span className="font-semibold text-cyan-400">클릭하여 선택하세요.</span>
        </p>
        <p className="text-sm text-slate-500">파일은 서버에 업로드되지 않으며, 모든 처리는 브라우저 내에서 이루어집니다.</p>
      </label>
    </div>
  );
}
