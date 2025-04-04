// src/components/DataCleaningOptions.jsx
import React from 'react';

const DataCleaningOptions = ({ onCleanData }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <button
        onClick={onCleanData}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Clean Data
      </button>
    </div>
  );
};

export default DataCleaningOptions;