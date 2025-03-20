import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import algeriaCities from '../data/algeria_cities.json';

const Cart = () => {
  const {
    cart,
    cartCount,
    removeFromCart,
    currency,
    addOrder,
    getDeliveryFee,
    sessionId, // Access session_id from context
  } = useContext(ShopContext);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    commune: '',
    deliveryType: 'Stop Desk',
    stopDesk: '',
    address: '',
    deliveryDate: '',
  });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Extract unique wilayas correctly
  const uniqueWilayas = [...new Map(algeriaCities.map(item => [item.wilaya_code, item])).values()];

  // Filter communes based on selected wilaya
  const communes = algeriaCities.filter(item =>
    item.wilaya_code.toString() === orderDetails.wilaya
  );

  const handleWilayaChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      wilaya: e.target.value,
      commune: '',
    });
  };

  const calculatePrices = () => {
    const groupedProducts = cart.reduce((acc, item) => {
      const atelier = item.atelier || 'Unknown';
      if (!acc[atelier]) {
        acc[atelier] = [];
      }
      acc[atelier].push(item);
      return acc;
    }, {});

    let totalPrice = 0;
    let totalFee = 0;

    Object.keys(groupedProducts).forEach((atelier) => {
      const productsForAtelier = groupedProducts[atelier];
      const subtotal = productsForAtelier.reduce((total, item) => total + item.price * item.quantity, 0);
      const fee = getDeliveryFee(orderDetails.wilaya, orderDetails.deliveryType);
      totalPrice += subtotal + fee;
      totalFee += fee;
    });

    setCalculatedFee(totalFee);
    setTotalPrice(totalPrice);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(05|06|07)\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setOrderDetails(prev => ({ ...prev, phone: value })); // Always update the state

      if (!validatePhoneNumber(value)) {
        setErrors(prev => ({ ...prev, phone: 'يجب أن يبدأ رقم الهاتف بـ 05 أو 06 أو 07 وأن يحتوي على 10 أرقام بالضبط.' }));
      } else {
        setErrors(prev => ({ ...prev, phone: '' }));
      }
    } else {
      setOrderDetails(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    calculatePrices(); // Calculate final prices before submission

    // Group products by atelier
    const groupedProducts = cart.reduce((acc, item) => {
      const atelier = item.atelier || 'Unknown';
      if (!acc[atelier]) {
        acc[atelier] = [];
      }
      acc[atelier].push(item);
      return acc;
    }, {});

    // Create separate orders for each atelier
    try {
      for (const atelier of Object.keys(groupedProducts)) {
        const productsForAtelier = groupedProducts[atelier];

        const order = {
          session_id: sessionId, // Use session_id from context
          client: orderDetails,
          products: productsForAtelier.map(item => ({
            name: item.name,
            price: item.price,
            size: item.selectedSize,
            color: item.selectedColor,
            quantity: item.quantity,
            image: item.image[0],
            selectedWidth: item.selectedWidth || item.width,
            selectedHeight: item.selectedHeight || item.height,
            uniqueId: item.uniqueId,
          })),
          total: totalPrice, // You might want to calculate this per atelier
          status: 'en cours',
          atelier: atelier,
          deliveryFee: calculatedFee, // You might want to calculate this per atelier
        };

        await addOrder(order); // Add the order to Supabase
      }

      setOrderSuccess(true);
      setShowOrderForm(false);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  // Calculate initial subtotal without fee
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className='p-6' dir="rtl">
      <h1 className='text-3xl font-bold mb-6'>سلة التسوق</h1>
      {cartCount === 0 ? (
        <div className='text-center py-10'>
          <p className='text-gray-600 mb-4'>سلة التسوق فارغة </p>
          <Link to='/collection' className='bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition'>
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Product List */}
          <div className='md:col-span-2'>
            {cart.map((item, index) => (
              <div key={item.uniqueId || index} className='flex items-center border-b py-4'>
                <img src={item.image[0]} alt={item.name} className='w-24 h-24 object-cover rounded-lg' />
                <div className='ml-4 flex-1'>
                  <h2 className='text-xl font-semibold'>{item.name}</h2>
                  <p className='text-gray-600'>{item.price} {currency}</p>
                  <div className='text-sm text-gray-500'>
                    <p>الحجم: {item.size}</p>
                    <div className='flex items-center gap-2'>
                      <p>اللون: </p>
                      <div
                        className='w-4 h-4 rounded-full border border-gray-300'
                        style={{ backgroundColor: item.selectedColor }}
                      />
                    </div>
                    <p>الكمية: {item.quantity}</p>
                    {item.selectedWidth && <p>العرض: {item.selectedWidth}</p>}
                    {item.selectedHeight && <p>الطول: {item.selectedHeight}</p>}
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.uniqueId)}
                  className='text-red-500 hover:text-red-700 transition'
                >
                  إزالة
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className='bg-[#f8f8f8] p-6 rounded-lg'>
            <h2 className='text-xl font-bold mb-4'>ملخص الطلب</h2>
            <div className='space-y-4'>
              <p className='text-gray-600'>عدد المنتجات: {cartCount}</p>
              <p className='text-gray-600'>السعر قبل إضافة تكاليف التوصيل: {subtotal} {currency}</p>

              {orderSuccess ? (
                <>
                  <p className='text-gray-600'>رسوم التوصيل: {calculatedFee} {currency}</p>
                  <p className='text-gray-600 font-semibold'>المجموع الكلي: {totalPrice} {currency}</p>
                  <button
                    onClick={() => navigate('/my-orders')}
                    className='w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition'
                  >
                    عرض طلباتي
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowOrderForm(true)}
                  className='w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition'
                >
                  تأكيد الطلب
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Form */}
      {showOrderForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white p-6 rounded-lg w-full max-w-md'>
            <h2 className='text-xl font-bold mb-4'>نموذج الطلب</h2>

            <form onSubmit={handleOrderSubmit}>
              {/* Nom et prénom */}
              <div className='flex gap-4 mb-4'>
                <input
                  type='text'
                  name='firstName'
                  placeholder='الاسم'
                  value={orderDetails.firstName}
                  onChange={handleOrderChange}
                  className='w-full p-2 border rounded-lg'
                  required
                />
                <input
                  type='text'
                  name='lastName'
                  placeholder='اللقب'
                  value={orderDetails.lastName}
                  onChange={handleOrderChange}
                  className='w-full p-2 border rounded-lg'
                  required
                />
              </div>

              {/* Téléphone */}
              <div className='mb-4'>
                <input
                  type='text'
                  name='phone' maxLength='10' minLength='10'
                  placeholder='رقم الهاتف'
                  value={orderDetails.phone}
                  onChange={handleOrderChange}
                  className='w-full p-2 border rounded-lg'
                  required
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Wilaya et commune */}
              <div className='flex gap-4 mb-4'>
                <select
                  className="w-full p-2 border rounded-lg"
                  name="wilaya"
                  value={orderDetails.wilaya}
                  onChange={handleWilayaChange}
                  required
                >
                  <option value="">اختر الولاية</option>
                  {Array.from(uniqueWilayas).map(wilaya => (
                    <option key={wilaya.wilaya_code} value={wilaya.wilaya_code}>
                      {wilaya.wilaya_name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full p-2 border rounded-lg"
                  name="commune"
                  value={orderDetails.commune}
                  onChange={handleOrderChange}
                  required
                  disabled={!orderDetails.wilaya}
                >
                  <option value="">اختر البلدية</option>
                  {communes.map(commune => (
                    <option key={commune.id} value={commune.commune_name}>
                      {commune.commune_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type de livraison */}
              <div className='mb-4'>
                <select
                  name='deliveryType'
                  value={orderDetails.deliveryType}
                  onChange={handleOrderChange}
                  className='w-full p-2 border rounded-lg'
                  required
                >
                  <option value='Stop Desk'>Stop Desk</option>
                  <option value='Domicile'>التوصيل إلى المنزل</option>
                </select>
              </div>

              {/* Stop Desk ou Adresse */}
              {orderDetails.deliveryType === 'Stop Desk' ? (
                <div className='mb-4'>
                  <input
                    type='text'
                    name='stopDesk'
                    placeholder='اسم Stop Desk'
                    value={orderDetails.stopDesk}
                    onChange={handleOrderChange}
                    className='w-full p-2 border rounded-lg'
                    required
                  />
                </div>
              ) : (
                <div className='mb-4'>
                  <input
                    type='text'
                    name='address'
                    placeholder='العنوان بالتفصيل'
                    value={orderDetails.address}
                    onChange={handleOrderChange}
                    className='w-full p-2 border rounded-lg'
                    required
                  />
                </div>
              )}

              {/* Date de réception */}
              <div className='mb-4'>
                <label htmlFor="deliveryDate" className='block text-sm font-medium mb-2'>
                  تاريخ الاستلام المطلوب
                </label>
                <input
                  type='date'
                  id="deliveryDate"
                  name='deliveryDate'
                  value={orderDetails.deliveryDate}
                  onChange={handleOrderChange}
                  className='w-full p-2 border rounded-lg'
                  required
                />
              </div>

              {/* Buttons */}
              <div className='flex gap-4'>
                <button
                  type='button'
                  onClick={() => setShowOrderForm(false)}
                  className='w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition'
                >
                  إلغاء
                </button>
                <button
                  type='submit'
                  className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition'
                >
                  تأكيد الطلب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {orderSuccess && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white p-6 rounded-lg text-center'>
            <h2 className='text-xl font-bold mb-4'>تم تسجيل الطلب بنجاح!</h2>
            <button
              onClick={() => navigate('/my-orders')}
              className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition'
            >
              عرض طلباتي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;