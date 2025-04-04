// src/components/FileUpload.jsx
import React from 'react';

const FileUpload = ({ onFileChange }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <input
        type="file"
        accept=".csv, .json"
        onChange={onFileChange}
        className="border border-gray-300 p-2 rounded"
      />
      <p className="mt-2 text-gray-600">Upload your dataset (CSV or JSON)</p>
    </div>
  );
};

export default FileUpload;