import React, { useState } from 'react';
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
    <nav className="l-mobileTopNav"><div aria-expanded="false" aria-label="expand sidebar" className="collapseIcon js-toggleSidebarMobile collapseIcon-is-collapsed js-interactiveElement" role="button" tabindex="0"><i aria-hidden="true" class="fa fa-chevron-left collapseIcon--leftArrow"></i><i aria-hidden="true" className="fa fa-bars collapseIcon--hamburger"></i><i aria-hidden="true" className="fa fa-chevron-right collapseIcon--rightArrow"></i></div><div className="logo"><a aria-label="Gradescope: Back to Home" href="/"><img alt="Gradescope" src="https://cdn.gradescope.com/assets/logo/logo_endorsed-ea37018bcd9aefba905d7cf51c16e0979ca8d5eb43fae7c26a66230fc01e285b.svg"/></a></div></nav>
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
