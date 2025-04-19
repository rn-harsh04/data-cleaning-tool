import React, { useState, useRef } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [processedData, setProcessedData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const uploadTimeRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploadMessage("");
    setProcessedData(null);
    setDashboardData(null);
    setShowDashboard(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage("❌ Please select a file before uploading.");
      return;
    }

    uploadTimeRef.current = Date.now();
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadMessage("⏳ Processing your file...");
      const startTime = Date.now();
      
      const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const endTime = Date.now();
      const frontendTime = endTime - startTime;

      setUploadMessage("✅ " + response.data.message);
      setProcessedData(response.data.data);
      
      // Transform backend stats for dashboard
      const stats = response.data.stats;
      const missingValues = Object.entries(stats.original.missing_values)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, count]) => count > 0)
        .map(([col, count]) => ({
          column: col,
          before: count,
          after: stats.cleaned.missing_values[col],
          improvement: count - stats.cleaned.missing_values[col],
          dtype: stats.original.dtypes[col]
        }));

      setDashboardData({
        missingValues,
        columnTypes: Object.entries(stats.original.dtypes).map(([col, dtype]) => ({
          column: col,
          dtype: dtype
        })),
        summaryStats: {
          "Total Rows": {
            before: stats.original.shape[0],
            after: stats.cleaned.shape[0],
            unit: ""
          },
          "Duplicates Removed": {
            before: stats.original.duplicates,
            after: stats.cleaned.duplicates,
            unit: ""
          },
          "Total Missing Values": {
            before: Object.values(stats.original.missing_values).reduce((a, b) => a + b, 0),
            after: Object.values(stats.cleaned.missing_values).reduce((a, b) => a + b, 0),
            unit: ""
          }
        },
        performance: {
          readTime: stats.performance.read_time,
          processTime: stats.performance.process_time,
          totalTime: stats.performance.total_time,
          frontendTime: frontendTime
        }
      });
      
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadMessage("❌ Error uploading file: " + (error.response?.data?.detail || error.message));
    }
  };

  const handleDownload = () => {
    if (!processedData) return;

    const blob = new Blob([processedData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.[^/.]+$/, "") + "_cleaned.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          📊 Data Cleaning Tool
        </h2>

        <label className="block w-full text-center cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition duration-200">
          <input 
            type="file" 
            accept=".csv, .json" 
            onChange={handleFileChange} 
            className="hidden" 
          />
          {file ? `📁 ${file.name}` : "Select a CSV or JSON file"}
        </label>

        <button
          onClick={handleUpload}
          disabled={!file}
          className={`mt-4 w-full flex items-center justify-center px-4 py-2 text-white font-semibold rounded-lg transition duration-200 ${
            !file ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {uploadMessage.includes("Processing") ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Upload & Process"
          )}
        </button>

        {uploadMessage && (
          <p className={`mt-2 text-center font-medium ${
            uploadMessage.startsWith("✅") ? "text-green-600" : 
            uploadMessage.startsWith("❌") ? "text-red-600" : "text-blue-600"
          }`}>
            {uploadMessage}
          </p>
        )}

        {processedData && (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition duration-200"
            >
              {showDashboard ? "Hide Insights" : "Show Data Insights"}
            </button>
            
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200"
            >
              Download Processed File
            </button>
          </div>
        )}
      </div>

      {showDashboard && dashboardData && (
        <div className="mt-6 w-full max-w-4xl">
          <Dashboard data={dashboardData} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;