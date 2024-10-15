import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Footer2 from './Footer2';

const ResponsiveFooter = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  // Function to handle screen resize
  const handleResize = () => {
    setIsMobile(window.innerWidth < 700);
  };

  // Listen for window resize events
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Conditionally render Footer or Footer2 based on screen size
  return isMobile ? <Footer2 /> : <Footer/>;
};

export default ResponsiveFooter;
