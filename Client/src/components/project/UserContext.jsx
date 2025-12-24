import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profileVersion, setProfileVersion] = useState(0); // For cache busting

  const getToken = () => localStorage.getItem("token");
  
  const getUserIdFromToken = () => {
    try {
      const token = getToken();
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch {
      return null;
    }
  };

  const fetchUser = async () => {
    const id = getUserIdFromToken();
    if (!id) {
      setUser(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`);
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user", err);
      setUser(null);
    }
  };

  // Watch for token changes and refetch user
  useEffect(() => {
    const token = getToken();
    
    if (token) {
      fetchUser();
    } else {
      setUser(null);
    }

    // Optional: Poll for token changes (in case of multiple tabs)
    const interval = setInterval(() => {
      const currentToken = getToken();
      const currentUserId = getUserIdFromToken();
      
      if (!currentToken && user) {
        // Token removed, clear user
        setUser(null);
      } else if (currentToken && currentUserId !== user?.id) {
        // Token changed to different user
        fetchUser();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Run once on mount, then poll for changes

  const updateUser = async (formData) => {
    try {
      const token = getToken();
      const userId = getUserIdFromToken();
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUser(response.data.user);
      // Increment version to bust cache only when profile actually updates
      setProfileVersion(prev => prev + 1);
    } catch (error) {
      console.error("Error updating user", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      fetchUser, 
      updateUser, 
      logout,
      profileVersion 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);