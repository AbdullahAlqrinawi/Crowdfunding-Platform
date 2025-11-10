'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logo } from "../../assets";
import { useUser } from '../../components/project/UserContext';

export default function SimpleNavbar() {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useUser(); 

  const handleNavigation = (path) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 150);
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-1 bg-indigo-500 z-50 animate-pulse"></div>
      )}
      <nav className="bg-primary py-4">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => handleNavigation('/')}
            >
              <img 
                src={logo} 
                alt="sparkit" 
                className="w-32 h-auto object-contain p-0 m-0 hover:opacity-80 transition-opacity" 
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}