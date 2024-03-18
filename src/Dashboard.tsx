import React, { useState } from 'react';
import DashboardNav from './components/DashboardNav';
import "./style/Dashboard.css";

const Dashboard = () => {
  const [cachedFiles, setCachedFiles] = useState<string[]>([
    'http://example.com/file1.pdf',
    'http://example.com/file2.pdf',
    'http://example.com/file3.pdf',
    // Add more cached files as needed
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file.name + ' selected');
      // Here you would typically handle the file upload process
      // and upon completion, add the file URL to the cachedFiles state.
    }
  };

  const handleFileClick = (fileName: string) => {
    console.log(fileName + ' clicked');
    // Here you would handle the file opening or any other action
  };

  return (
    <>
    <DashboardNav />
    <div className="dashboard">
      <div className="cached-files-grid">
        <div className="cached-file-item upload-box" onClick={() => document.getElementById('file-upload')!.click()}>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <div className="upload-content">
            <span className="upload-icon">+</span>
            <span className="upload-text">Upload Document</span>
          </div>
        </div>
        {cachedFiles.map((fileName, index) => (
          <div
            key={index}
            className="cached-file-item"
            onClick={() => handleFileClick(fileName)}
            style={{ backgroundImage: `url(${fileName})` }}
          >
            <div className="file-overlay">
              <span className="file-title">File Title</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
