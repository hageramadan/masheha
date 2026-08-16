'use client';

import { useState } from 'react';
import { FaUpload, FaTrash, FaFileAlt } from 'react-icons/fa';

interface BookingLicenseUploadProps {
  onFileSelect: (file: File | null) => void;
  fileName: string;
  error?: string;
}

export default function BookingLicenseUpload({
  onFileSelect,
  fileName,
  error,
}: BookingLicenseUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        رخصة القيادة *
        <span className="block text-sm font-normal text-gray-500 mt-1">
          أرفق صورة الرخصة - سارية المفعول
        </span>
      </h2>

      {!fileName ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : error
              ? 'border-red-500'
              : 'border-gray-300 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            id="license-upload"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">
            اسحب الملف هنا أو <span className="text-primary font-bold">اختر ملف</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            PDF, PNG or JPG (MAX 5 MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <FaFileAlt className="text-primary text-xl" />
            <span className="text-gray-700">{fileName}</span>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <FaTrash />
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}