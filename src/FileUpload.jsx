import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [processedData, setProcessedData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("❌ Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadMessage("✅ " + response.data.message);
      setProcessedData(response.data.data);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMessage("❌ Error uploading file.");
    }
  };

  const handleDownload = () => {
    if (!processedData) return;

    const blob = new Blob([processedData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "processed_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          📊 Data Cleaning Tool
        </h2>

        <label className="block w-full text-center cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">
          <input type="file" accept=".csv, .json" onChange={handleFileChange} className="hidden" />
          {file ? `📁 ${file.name}` : "Select a CSV or JSON file"}
        </label>

        <button
          onClick={handleUpload}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Upload & Process
        </button>

        {uploadMessage && (
          <p className="mt-2 text-center font-medium text-gray-700">{uploadMessage}</p>
        )}

        {processedData && (
          <button
            onClick={handleDownload}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
          >
             Download Processed File
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
