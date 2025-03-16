import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className='flex'>
      <AdminSidebar />
      <div className='flex-1 p-6'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;