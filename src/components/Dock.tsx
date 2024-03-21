import React, { useEffect, useRef, useState } from 'react';
import Auth0Login from './Auth0Login';
import Auth0Logout from './Auth0Logout';
import { useAuth0 } from "@auth0/auth0-react";
import { getAPIRoutePrivate } from '../services/message.service';
import "../style/Dock.css";

interface DockProps {
  title: string;
  pageNumber: number;
  onMenuClick: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  // onFitToPage: () => void;
  // onRotate: () => void;
  onPrint: () => void;
  onMoreActions: () => void;
  onDownload: () => void;
  handlePageChange: (pageNumber: number) => void;
}

const SLICE_LENGTH = 53;
const INACTIVITY_TIMEOUT = 3000;

const Dock: React.FC<DockProps> = ({
  title,
  onMenuClick,
  onZoomIn,
  onZoomOut,
  // onFitToPage,
  // onRotate,
  onPrint,
  onMoreActions,
  onDownload,
  handlePageChange,
  pageNumber
}) => {

  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isInactive, setIsInactive] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null); 
  let inactivityTimer: any = null;

  useEffect(() => {
    console.log('isAuthenticated:', isAuthenticated);
    // You can also log it when it changes to false specifically
    if (!isAuthenticated) {
      console.log('User has logged out.');
      setShowLogin(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Set up the initial inactivity timer
    inactivityTimer = setTimeout(setInactive, INACTIVITY_TIMEOUT); // 5 seconds of inactivity

    // Add mousemove event listener to the dock element to reset the timer on interaction
    const dockElement = dockRef.current;
    dockElement?.addEventListener('mousemove', resetInactivityTimer);

    // Clean up the timer and event listener on unmount
    return () => {
      clearTimeout(inactivityTimer);
      dockElement?.removeEventListener('mousemove', resetInactivityTimer);
    };
  }, []);


  const setInactive = () => {
    setIsInactive(true);
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    setIsInactive(false);
    inactivityTimer = setTimeout(setInactive, INACTIVITY_TIMEOUT); // 5 seconds of inactivity
  };


  // Toggle the display of the login button
  const handleMoreActionsClick = () => {
    onMoreActions();
    setShowLogin(!showLogin);
  };

  const handleApiCheck = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await getAPIRoutePrivate(token);
      console.log('API Data:', response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };


  const dockClass = isInactive ? 'dock inactive' : 'dock';

  return (
  <div id="toolbar" ref={dockRef} className={dockClass} style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div id="start" style={{ paddingLeft: '2ch', display: 'flex', alignItems: 'center' }}>
      <button onClick={onMenuClick} title="Open menu">Menu</button>
      {/* Change the font, and title up padding */}
      <span id="title" style={{ paddingLeft: '2ch' }}>{title.length > SLICE_LENGTH ? `${title.slice(0, SLICE_LENGTH)}...` : title}</span>
    </div>
    <div id="center" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>

    <input type="number" style={{width:'4em', backgroundColor: "#ffff"}} value={pageNumber} aria-label="Page number" onChange={(e) => handlePageChange(parseInt(e.target.value))} />
      <button onClick={onZoomOut} title="Zoom Out" style={{borderRadius: '50%', padding: '5px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg 
          fill="none"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          >
            <path
              fill="currentColor"
              d="M4 12a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1z"
            />
          </svg>
      </button>
      {/* Accidentally gave it carving which is cool */}
      <input type="text" style={{width:'2.6em', backgroundColor: "#ffff"}} value="100%" aria-label="Zoom level" readOnly />
      <button onClick={onZoomIn} title="Zoom In" style={{borderRadius: '50%', padding: '5px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg
          fill="currentColor"
          viewBox="0 0 16 16"
          height="1.4em"
          width="1.4em"
        >
          <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z" />
        </svg>
      </button>
      {/* <button onClick={onFitToPage} title="Fit to page">Fit to page</button>
      <button onClick={onRotate} title="Rotate counterclockwise">Rotate counterclockwise</button> */}
    </div>
    <div id="end" style={{ display: 'flex', alignItems: 'center', paddingRight: '20px', gap: '10px' }}>
    <button onClick={handleApiCheck} title="Check API">Check API</button>
    {showLogin ? (
      isAuthenticated ? <Auth0Logout /> : <Auth0Login />
    ) : (
      <>
      {/* To make this code more maintainable on refactor have this pull from list and render each segment */}
        <button onClick={onDownload} title="Download" style={{borderRadius: '50%', padding: '5px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            height="1.4em"
            width="1.4em"
          >
            <path d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7 7-7z" />
          </svg>
        </button>
        <button onClick={onPrint} title="Print" style={{borderRadius: '50%', padding: '5px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg
              viewBox="0 0 1024 1024"
              fill="currentColor"
              height="1.4em"
              width="1.4em"
            >
              <path d="M732 120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v148h440V120zm120 212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM664 844H360V568h304v276zm164-360c0 4.4-3.6 8-8 8h-40c-4.4 0-8-3.6-8-8v-40c0-4.4 3.6-8 8-8h40c4.4 0 8 3.6 8 8v40z" />
            </svg>
          </button>
      </>
      )}
      <button onClick={handleMoreActionsClick} title="More actions" style={{borderRadius: '50%', padding: '5px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </button>
    </div>
  </div>
);
};
export default Dock;