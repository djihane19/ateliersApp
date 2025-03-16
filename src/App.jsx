import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddEditProduct from './pages/AddEditProduct';
import Moneat from './pages/Moneat';
import Courva from './pages/Courva';
import Rayma from './pages/Rayma';
import AdminLogin from './pages/AdminLogin';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/AdminOrders';
import Products from './pages/admin/Products';
import Customers from './pages/admin/Customers';
import Ateliers from './pages/admin/Ateliers';
import Reports from './pages/admin/Reports';
import Notifications from './pages/admin/Notifications';
import Settings from './pages/admin/Settings';
import AdminLayout from './components/AdminLayout';
import OrderDetails from './pages/admin/OrderDetails';
import OrderDetail from './pages/OrderDetail';
import MyOrders from './pages/MyOrders';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AdminProvider>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        {/* Conditionally render Navbar */}
         <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order-details/:orderId' element={<OrderDetail />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/atelier/Mo-Neat' element={<Moneat />} />
          <Route path='/atelier/Rayma' element={<Rayma />} />
          <Route path='/atelier/Courva' element={<Courva />} />

          {/* Admin Login */}
          <Route path='/admin/login' element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='orders' element={<AdminOrders />} />
            <Route path='products' element={<Products />} />
            <Route path='products/add' element={<AddEditProduct />} />
            <Route path='products/edit/:productId' element={<AddEditProduct />} />
            <Route path='customers' element={<Customers />} />
            <Route path='ateliers' element={<Ateliers />} />
            <Route path='reports' element={<Reports />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='settings' element={<Settings />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path='orders/:orderId' element={<OrderDetails />} />
          </Route>

          {/* 404 Page */}
          <Route path='*' element={<NotFound />} />
        </Routes>

        {/* Conditionally render Footer */}
        {!isAdminRoute && <Footer />}
      </div>
    </AdminProvider>
  );
};

export default App;