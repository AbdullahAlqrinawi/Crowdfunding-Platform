import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
  if (!id) return;

  try {
    const res = await axios.get(`http://localhost:5000/api/users/${id}`);
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user)); 
  } catch (err) {
    console.error("Error fetching user", err);
  }
};


  useEffect(() => {
    fetchUser();
  }, []);

 const updateUser = async (formData) => {
  try {
    const token = getToken();
    const userId = getUserIdFromToken();
    const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUser(response.data.user);
    localStorage.setItem('user', JSON.stringify(response.data.user)); // تحديث Local Storage أيضًا
    fetchUser(); // تحديث سياق المستخدم
  } catch (error) {
    console.error("Error updating user", error);
  }
};


  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
