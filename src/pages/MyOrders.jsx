import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../supabaseClient';
import { getOrCreateUserSessionId } from '../utils/userSession';
import html2pdf from 'html2pdf.js';
import { assets } from '../assets/assets';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to generate PDF using html2pdf.js

  const generatePDF = (order) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="
        font-family: 'Amiri', serif;
        padding: 30px;
        background: #f8f9fa;
        color: #333;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      ">
        <!-- Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="/logo1.png" alt="Logo" style="width: 120px; height: auto;" />
        </div> 
  
        <!-- Header -->
        <h1 style="font-size: 26px; font-weight: bold; text-align: center; margin-bottom: 5px; color: #d32f2f;">فاتورة الطلب</h1>
        <h2 style="font-size: 18px; text-align: center; color: #555;">Atelier: ${order.atelier}</h2>
  
        <!-- Order Details -->
        <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <p style="font-size: 16px; text-align: right; margin: 5px 0;"><strong>رقم الطلب:</strong> ${order.id}</p>
          <p style="font-size: 16px; text-align: right; margin: 5px 0;"><strong>الاسم:</strong> ${order.client.firstName} ${order.client.lastName}</p>
          <p style="font-size: 16px; text-align: right; margin: 5px 0;"><strong>الهاتف:</strong> ${order.client.phone}</p>
          <p style="font-size: 16px; text-align: right; margin: 5px 0;"><strong>العنوان:</strong> ${order.client.address || order.client.stopDesk}</p>
          <p style="font-size: 18px; font-weight: bold; text-align: right; margin-top: 10px; color: #d32f2f;">
            <strong>المجموع الكلي:</strong> ${order.total} دج
          </p>
        </div>
  
        <!-- Products Table -->
        <h3 style="font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px;">المنتجات المطلوبة</h3>
        <table style="
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 10px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        ">
          <thead>
            <tr style="background: #d32f2f; color: white;">
              <th style="padding: 12px; text-align: center;">رقم</th>
              <th style="padding: 12px; text-align: center;">المنتج</th>
              <th style="padding: 12px; text-align: center;">السعر</th>
              <th style="padding: 12px; text-align: center;">الكمية</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
              .map(
                (product, index) => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 12px; text-align: center;">${index + 1}</td>
                <td style="padding: 12px; text-align: right;">${product.name}</td>
                <td style="padding: 12px; text-align: center;">${product.price} دج</td>
                <td style="padding: 12px; text-align: center;">${product.quantity}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
  
        <!-- Footer -->
        <p style="font-size: 18px; font-weight: bold; text-align: center; color: #555; margin-top: 20px;">
          شكرًا لاختياركم ورشتنا!
        </p>
      </div>
    `;
  
    // Generate and download the PDF
    html2pdf()
      .set({
        margin: 10,
        filename: `فاتورة_الطلب_${order.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();
  };
  

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
                <button
                  onClick={() => generatePDF(order)}
                  className='bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition'
                >
                  تحميل الفاتورة (PDF)
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;  