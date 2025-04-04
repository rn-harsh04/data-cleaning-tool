/* eslint-disable no-unused-vars */
// src/App.jsx
import React, { useState } from 'react';
import FileUpload from './FileUpload';

const App = () => {
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setMessage(`File "${file.name}" uploaded successfully!`);
    } else {
      setMessage('No file selected.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Automated Data Cleaning Tool</h1>
      <FileUpload onFileChange={handleFileChange} />
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default App;