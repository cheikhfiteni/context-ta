import React, { useState } from 'react';
import testData from './lib/temp-file-data.ts';
import "./style/Dashboard.css";

const Dashboard = () => {
  const [cachedFiles, setCachedFiles] = useState<string[]>([
    // Assuming these are the names or URLs of the cached PDF files
    'cached_file_1.pdf',
    'cached_file_2.pdf',
    'cached_file_3.pdf',
    // Add more cached files as needed
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log('File selected:', file.name);
      // Perform further actions like updating state or uploading the file
    }
  };

  const handleFileClick = (fileName: string) => {
    console.log('File clicked:', fileName);
    // Perform further actions like opening the file or displaying its content
  };

  return (
    <div className="dashboard">
      <h1>Upload PDF</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
      />
      <div className="cached-files-grid">
        {cachedFiles.map((fileName, index) => (
          <div
            key={index}
            className="cached-file-item"
            onClick={() => handleFileClick(fileName)}
          >
            {fileName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;