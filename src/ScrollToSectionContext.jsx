// src/ScrollToSectionContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  const [sectionToScroll, setSectionToScroll] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (sectionToScroll && location.pathname === '/') {
      const el = document.getElementById(sectionToScroll);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setSectionToScroll(null); // Reset
      }
    }
  }, [location, sectionToScroll]);

  return (
    <ScrollContext.Provider value={{ setSectionToScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};
console.log("ScrollProvider loaded");

export const useScroll = () => useContext(ScrollContext);
