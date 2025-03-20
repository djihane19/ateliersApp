import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../../supabaseClient'; // Import Supabase client

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch orders with status "en cours" from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders') // Ensure this matches your table name
          .select('*')
          .eq('status', 'en cours'); // Filter orders by status

        if (error) {
          throw error;
        }

        // Sort orders by ID in descending order (most recent first)
        const sortedData = data.sort((a, b) => b.id - a.id);

        setNotifications(sortedData || []);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setNotifications([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrders();
  }, []);

  // Mark notification as read
  const markAsRead = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'lu' }) // Update status to "lu" (read)
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Remove the notification from the local state
      setNotifications((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Error marking order as read:', error.message);
    }
  };

  // Handle viewing order details
  const handleViewDetails = (order) => {
    navigate(`/admin/orders/${order.id || 'unknown'}`, { state: { order } });
  };

  if (loading) {
    return <div className='text-center py-10'>جاري التحميل...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className='text-center py-10'>
        <h1 className='text-3xl font-bold mb-6'>Notifications</h1>
        <p className='text-gray-600 mb-4'>Aucune nouvelle notification</p>
        <Link
          to='/admin/orders'
          className='bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition'
        >
          Voir toutes les commandes
        </Link>
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6'>
      <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Notifications</h1>
      <div className='space-y-4'>
        {notifications.map((order) => (
          <div
            key={order.id}
            className='bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-blue-500'
          >
            <div className='flex-1'>
              <h2 className='text-lg sm:text-xl font-semibold'>Nouvelle Commande #{order.id}</h2>
              <p className='text-sm sm:text-base text-gray-600'>
                Client: {order.client.firstName} {order.client.lastName}
              </p>
              <p className='text-sm sm:text-base text-gray-600'>Total: {order.total} DA</p>
              <p className='text-sm sm:text-base text-gray-600'>Statut: {order.status}</p>
            </div>
            <div className='flex gap-2 sm:gap-4 mt-4 sm:mt-0'>
              {/* Mark as Read Button (Icon on Mobile) */}
              <button
                onClick={() => markAsRead(order.id)}
                className='bg-gray-200 text-gray-700 p-2 sm:py-2 sm:px-4 rounded-lg hover:bg-gray-300 transition flex items-center'
              >
                <svg
                  className='w-5 h-5 sm:hidden'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                <span className='hidden sm:inline'>Marquer comme lu</span>
              </button>

              {/* View Details Button (Icon on Mobile) */}
              <button
                onClick={() => handleViewDetails(order)}
                className='bg-blue-500 text-white p-2 sm:py-2 sm:px-4 rounded-lg hover:bg-blue-600 transition flex items-center'
              >
                <svg
                  className='w-5 h-5 sm:hidden'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z'
                  />
                </svg>
                <span className='hidden sm:inline'>Voir les détails</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;