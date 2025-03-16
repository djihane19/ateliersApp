import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiBox, 
  FiUsers, 
  FiSettings, 
  FiBell, 
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import supabase from '../../supabaseClient'; // Import Supabase client

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      // Sign out with Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate('/admin/login'); // Redirect to the login page
    } catch (error) {
      console.error('Error logging out:', error.message);
      alert('Une erreur est survenue lors de la déconnexion. Veuillez réessayer.');
    }
  };

  const sidebarWidth = isSidebarOpen ? 'w-64' : 'w-16';
  const ChevronIcon = isSidebarOpen ? FiChevronLeft : FiChevronRight;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div 
        className={`${sidebarWidth} bg-gray-800 text-white h-screen transition-all duration-300 flex flex-col`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg self-end m-2"
        >
          <ChevronIcon className="h-6 w-6" />
        </button>

        {/* Logo/Title */}
        <h1 className={`text-2xl font-bold px-4 mb-6 ${!isSidebarOpen && 'hidden'}`}>
          Admin Panel
        </h1>

        {/* Menu Items */}
        <ul className="flex-1">
          <NavItem to="/admin/dashboard" icon={<FiHome />} text="Tableau de bord" isSidebarOpen={isSidebarOpen} />
          <NavItem to="/admin/orders" icon={<FiShoppingBag />} text="Commandes" isSidebarOpen={isSidebarOpen} />
          <NavItem to="/admin/products" icon={<FiBox />} text="Produits" isSidebarOpen={isSidebarOpen} />
          <NavItem to="/admin/notifications" icon={<FiBell />} text="Notifications" isSidebarOpen={isSidebarOpen} />
          <NavItem to="/admin/settings" icon={<FiSettings />} text="Paramètres" isSidebarOpen={isSidebarOpen} />
        </ul>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition"
          >
            <FiLogOut className="h-6 w-6" />
            <span className={`${!isSidebarOpen && 'hidden'}`}>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, text, isSidebarOpen }) => (
  <li className="mb-2 px-2">
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition group"
    >
      <span className="h-6 w-6">{icon}</span>
      <span className={`${!isSidebarOpen && 'hidden'}`}>{text}</span>
      {!isSidebarOpen && (
        <span className="absolute left-16 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          {text}
        </span>
      )}
    </Link>
  </li>
);

export default AdminSidebar;