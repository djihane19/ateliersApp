import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
   

const AdminLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-10 p-6"> {/* Adjust margin-left based on sidebar width */}
         <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;