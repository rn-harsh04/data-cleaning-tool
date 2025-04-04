// src/components/DataPreview.jsx
import React from 'react';

const DataPreview = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {data[0] && Object.keys(data[0]).map((key) => (
              <th key={key} className="border border-gray-300 p-2">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {Object.values(row).map((value, idx) => (
                <td key={idx} className="border border-gray-300 p-2">{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPreview;