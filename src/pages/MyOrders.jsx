// MyOrders.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabaseClient';
import { getOrCreateUserSessionId } from '../utils/userSession';

const GeneratePDF = lazy(() => import('./GeneratePDF'));

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders for the current user session
  const fetchOrders = async () => {
    try {
      const sessionId = getOrCreateUserSessionId();
      console.log('Session ID:', sessionId);

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('session_id', sessionId);

      if (error) {
        throw error;
      }

      setOrders(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setError('حدث خطأ أثناء جلب الطلبات. يرجى المحاولة مرة أخرى.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className='text-center py-10'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
        <p className='mt-4'>جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-10'>
        <h1 className='text-3xl font-bold mb-6'>طلباتي</h1>
        <p className='text-red-600 mb-4'>{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className='text-center py-10'>
        <h1 className='text-3xl font-bold mb-6'>طلباتي</h1>
        <p className='text-gray-600 mb-4'>لا توجد طلبات</p>
        <Link to='/collection' className='bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition'>
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>طلباتي</h1>
        <button
          onClick={fetchOrders}
          className='bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition'
        >
          تحديث الطلبات
        </button>
      </div>
      <div className='space-y-6'>
        {orders.map((order, index) => {
          const subtotal = order.products.reduce((total, product) => total + product.price * product.quantity, 0);

          return (
            <div key={index} className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-bold mb-4'>طلب #{index + 1}</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Client Information */}
                <div>
                  <h3 className='text-lg font-semibold mb-2'>معلومات العميل</h3>
                  <p><strong>الاسم:</strong> {order.client.firstName} {order.client.lastName}</p>
                  <p><strong>الهاتف:</strong> {order.client.phone}</p>
                  <p><strong>الولاية:</strong> {order.client.wilaya}</p>
                  <p><strong>البلدية:</strong> {order.client.commune}</p>
                  <p><strong>نوع التوصيل:</strong> {order.client.deliveryType}</p>
                  <p><strong>العنوان:</strong> {order.client.address || order.client.stopDesk}</p>
                  <p><strong>تاريخ الاستلام:</strong> {order.client.deliveryDate}</p>
                </div>

                {/* Order Information */}
                <div>
                  <h3 className='text-lg font-semibold mb-2'>معلومات الطلب</h3>
                  <p><strong>الحالة:</strong> {order.status}</p>
                  <p><strong>المجموع الجزئي:</strong> {subtotal} دج</p>
                  <p><strong>رسوم التوصيل:</strong> {order.deliveryFee} دج</p>
                  <p><strong>المجموع الكلي:</strong> {order.total} دج</p>
                </div>
              </div>

              {/* Products List */}
              <div className='mt-6'>
                <h3 className='text-lg font-semibold mb-4'>المنتجات المطلوبة</h3>
                {order.products.length === 0 ? (
                  <p className='text-gray-600'>لا توجد منتجات في هذا الطلب.</p>
                ) : (
                  order.products.map((product, idx) => (
                    <div key={idx} className='border-b py-4'>
                      <div className='flex items-start gap-4'>
                        <img src={product.image} alt={product.name} className='w-16 h-16 object-cover rounded-lg' />
                        <div className='flex-1'>
                          <h4 className='text-lg font-semibold'>{product.name}</h4>
                          <p className='text-gray-600'>{product.price} دج</p>
                          <div className='text-sm text-gray-500'>
                            <p>الحجم: {product.size}</p>
                            <div className='flex items-center gap-2'>
                              <p>اللون:</p>
                              <div
                                className='w-4 h-4 rounded-full border border-gray-300'
                                style={{ backgroundColor: product.color }}
                              />
                            </div>
                            <p>الكمية: {product.quantity}</p>
                            {product.selectedWidth && <p>العرض: ${product.selectedWidth}</p>}
                            {product.selectedHeight && <p>الطول: ${product.selectedHeight}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Generate PDF Button */}
              <div className='mt-6'>
                <Suspense fallback={<div>Loading...</div>}>
                  <GeneratePDF order={order} />
                </Suspense>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;  