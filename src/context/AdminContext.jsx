import React,{ createContext, useContext, useState, useEffect } from 'react';
import supabase from '../../supabaseClient'; // Import Supabase client

// Create the context
const AdminContext = createContext();

// Create the provider component
export const AdminProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check if admin is logged in on page load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdminLoggedIn(!!user); // Set to true if user exists
    };

    checkSession();
  }, []);

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, setIsAdminLoggedIn }}>
      {children}
    </AdminContext.Provider>
  );
};

// Export the context and a custom hook for using it
export const useAdmin = () => useContext(AdminContext);

// Export AdminContext explicitly
export { AdminContext };