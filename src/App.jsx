import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminProvider } from './context/AdminContext';

// Lazy load all pages
const Home = React.lazy(() => import('./pages/Home'));
const Collection = React.lazy(() => import('./pages/Collection'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Product = React.lazy(() => import('./pages/Product'));
const Cart = React.lazy(() => import('./pages/Cart'));
const AddEditProduct = React.lazy(() => import('./pages/AddEditProduct'));
const Moneat = React.lazy(() => import('./pages/Moneat'));
const Courva = React.lazy(() => import('./pages/Courva'));
const Rayma = React.lazy(() => import('./pages/Rayma'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const ChangePassword = React.lazy(() => import('./pages/ChangePassword'));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const Products = React.lazy(() => import('./pages/admin/Products'));
const Customers = React.lazy(() => import('./pages/admin/Customers'));
const Ateliers = React.lazy(() => import('./pages/admin/Ateliers'));
const Reports = React.lazy(() => import('./pages/admin/Reports'));
const Notifications = React.lazy(() => import('./pages/admin/Notifications'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));
const OrderDetails = React.lazy(() => import('./pages/admin/OrderDetails'));
const OrderDetail = React.lazy(() => import('./pages/OrderDetail'));
const MyOrders = React.lazy(() => import('./pages/MyOrders'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AdminProvider>
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        {/* Conditionally render Navbar */}
        {!isAdminRoute &&<Navbar />}  

        {/* Wrap Routes in Suspense for lazy loading */}
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>

        {/* Conditionally render Footer */}
        {!isAdminRoute && <Footer />}
      </div>
    </AdminProvider>
  );
};

export default App;