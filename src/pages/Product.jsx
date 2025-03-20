import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { FaEdit } from 'react-icons/fa';
import algeriaCities from '../data/algeria_cities.json';
import supabase from '../../supabaseClient'; // Import Supabase client

const Product = () => {
  const { productId } = useParams();
  const { addToCart, addOrder, sessionId } = useContext(ShopContext); // Access session_id from context
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
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
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedWidth, setSelectedWidth] = useState('');
  const [selectedHeight, setSelectedHeight] = useState('');
  const [isEditingWidth, setIsEditingWidth] = useState(false);
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [product, setProduct] = useState(null); // State for product
  const [isZoomed, setIsZoomed] = useState(false); // State for zoom mode
  const [zoomLevel, setZoomLevel] = useState(1); // State for zoom level
  const navigate = useNavigate();

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // Replace 'products' with your table name
          .select('*')
          .eq('id', productId) // Filter by product ID
          .single(); // Get a single record

        if (error) {
          throw error;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error.message);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product) {
      setSelectedWidth(product.widthValue || '');
      setSelectedHeight(product.heightValue || '');
    }
  }, [product]);

  if (!product) {
    return <div>المنتج غير موجود</div>;
  }

  // Extract unique wilayas correctly
  const uniqueWilayas = [...new Map(algeriaCities.map(item => [item.wilaya_code, item])).values()];

  // Filter communes based on selected wilaya
  const communes = algeriaCities.filter(
    (item) => item.wilaya_code.toString() === orderDetails.wilaya
  );

  // Handle Wilaya selection properly
  const handleWilayaChange = (e) => {
    setOrderDetails({
      ...orderDetails,
      wilaya: e.target.value,
      commune: '', // Reset commune when wilaya changes
    });
  };

  // Handle adding product to cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('الرجاء اختيار الحجم واللون.');
      return;
    }
    const productWithDetails = {
      ...product,
      selectedSize,
      selectedColor,
      quantity,
      selectedWidth: selectedWidth || product.widthValue,
      selectedHeight: selectedHeight || product.heightValue,
    };
    addToCart(productWithDetails);
    alert('تمت إضافة المنتج إلى السلة!');
  };

  // Handle image click
  const handleImageClick = (index) => {
    setMainImage(index);
  };

  // Validate phone number
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(05|06|07)\d{8}$/;
    return phoneRegex.test(phone);
  };

  // Handle order form changes
  const handleOrderChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      setOrderDetails((prev) => ({ ...prev, phone: value })); // Always update the state

      if (!validatePhoneNumber(value)) {
        setErrors((prev) => ({
          ...prev,
          phone: 'يجب أن يبدأ رقم الهاتف بـ 05 أو 06 أو 07 وأن يحتوي على 10 أرقام بالضبط.',
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone: '' }));
      }
    } else {
      setOrderDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle order submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSize || !selectedColor) {
      alert('الرجاء اختيار الحجم واللون.');
      return;
    }

    const order = {
      session_id: sessionId, // Use session_id from context
      client: orderDetails,
      products: [
        {
          name: product.name,
          price: product.price,
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
          image: product.image[0],
          selectedWidth: selectedWidth || product.widthValue || null,
          selectedHeight: selectedHeight || product.heightValue || null,
        },
      ],
      total: product.price * quantity,
      status: 'en cours',
      atelier: product.atelier,
    };

    try {
      await addOrder(order); // Add the order to Supabase
      setOrderSuccess(true);
      setShowOrderForm(false);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ أثناء تسجيل الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  // Handle zoom in
  const handleZoomIn = () => {
    setZoomLevel((prev) => prev + 0.1);
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoomLevel((prev) => (prev > 0.1 ? prev - 0.1 : prev));
  };

  // Handle exit zoom mode
  const handleExitZoom = () => {
    setIsZoomed(false);
    setZoomLevel(1);
  };

  return (
    <div className='p-6' dir="rtl">
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Product Images */}
        <div className='flex-1'>
          <img
            src={product.image[mainImage]}
            alt={product.name}
            className='w-full h-96 object-cover rounded-lg'
          />
          <div className='flex gap-2 mt-4'>
            {product.image.map(
              (img, index) =>
                img && (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${
                      mainImage === index ? 'border-2 border-blue-500' : ''
                    }`}
                    onClick={() => handleImageClick(index)}
                  />
                )
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-4'>{product.name}</h1>
          <p className='text-2xl font-semibold mb-4'>{product.price} دج</p>
          <p className='text-sm text-gray-600 mb-2'>الورشة: {product.atelier}</p>
          <p className='text-sm text-gray-600 mb-4'>الفئة: {product.category}</p>
          <p className='text-gray-600 mb-4'>{product.description}</p>

          {/* Size Selection */}
          <div className='mb-4'>
            <p className='text-sm font-medium mb-2'>الحجم</p>
            <div className='flex gap-2'>
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`p-2 border rounded-lg transition-colors ${
                    selectedSize === size ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className='mb-4'>
            <p className='text-sm font-medium mb-2'>اللون</p>
            <div className='flex gap-2'>
              {product.color.map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full border ${
                    selectedColor === color ? 'ring-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Width and Height */}
          {product.width && (
            <div className='mb-4'>
              <p className='text-sm font-medium mb-2'>العرض</p>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  placeholder={product.widthValue}
                  value={selectedWidth}
                  onChange={(e) => setSelectedWidth(e.target.value)}
                  className='w-full p-2 border rounded-lg'
                />
                <button
                  onClick={() => setIsEditingWidth(!isEditingWidth)}
                  className='text-blue-500 hover:text-blue-700'
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          )}

          {product.height && (
            <div className='mb-4'>
              <p className='text-sm font-medium mb-2'>الطول</p>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  placeholder={product.heightValue}
                  value={selectedHeight}
                  onChange={(e) => setSelectedHeight(e.target.value)}
                  className='w-full p-2 border rounded-lg'
                />
                <button
                  onClick={() => setIsEditingHeight(!isEditingHeight)}
                  className='text-blue-500 hover:text-blue-700'
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className='mb-4'>
            <p className='text-sm font-medium mb-2'>الكمية</p>
            <input
              type='number'
              min='1'
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className='w-20 p-2 border rounded-lg'
            />
          </div>

          {/* Add to Cart Button */}
          <button
            style={{ background: '#f3f4f6' }}
            className='w-full text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition mb-2'
            onClick={handleAddToCart}
          >
            إضافة إلى السلة
          </button>

          {/* Direct Order Button */}
          <button
            style={{ background: 'linear-gradient(135deg, #ff6f61 0%, #ff4d4d 100%)' }}
            className='w-full text-white py-2 rounded-lg hover:opacity-90 transition'
            onClick={() => {
              if (!selectedSize || !selectedColor) {
                alert('الرجاء اختيار الحجم واللون.');
                return;
              }
              setShowOrderForm(true);
            }}
          >
            طلب مباشر
          </button>
        </div>
      </div>

      {/* Size Guide Section */}
      <div className='mt-8'>
        <button
          onClick={() => setShowSizeGuide(!showSizeGuide)}
          className='flex items-center gap-2 text-blue-500 hover:text-blue-600 transition mb-4'
        >
          <span className='text-lg font-medium'>
            {showSizeGuide ? 'إخفاء دليل المقاسات' : 'عرض دليل المقاسات'}
          </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`h-5 w-5 transition-transform ${
              showSizeGuide ? 'transform rotate-180' : ''
            }`}
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
        {showSizeGuide && (
          <div className='flex justify-center'>
            <img
              src={assets.mesure}
              alt='دليل المقاسات'
              className='w-full max-w-md rounded-lg shadow-lg cursor-pointer'
              onClick={() => setIsZoomed(true)}
            />
          </div>
        )}
      </div>

      {/* Zoomed Image Modal */}
      {isZoomed && (
        <div className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50'>
          <div className='relative'>
            <img
              src={assets.mesure}
              alt='دليل المقاسات'
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease' }}
              className='max-w-full max-h-full'
            />
            <div className='absolute top-4 right-4 flex gap-2'>
              <button
                onClick={handleZoomIn}
                className='bg-white p-2 rounded-full shadow-lg'
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className='bg-white p-2 rounded-full shadow-lg'
              >
                -
              </button>
              <button
                onClick={handleExitZoom}
                className='bg-white p-2 rounded-full shadow-lg'
              >
                ✕
              </button>
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
              {/* First Name and Last Name */}
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

              {/* Phone */}
              <div className='mb-4'>
                <input
                  type='text'
                  name='phone'
                  maxLength='10'
                  minLength='10'
                  placeholder='رقم الهاتف'
                  value={orderDetails.phone}
                  onChange={handleOrderChange}
                  className='w-full p-2 border rounded-lg'
                  required
                />
              </div>

              {/* Wilaya and Commune */}
              <div className='flex gap-4 mb-4'>
                <select
                  name='wilaya'
                  value={orderDetails.wilaya}
                  onChange={handleWilayaChange}
                  className='border p-2 rounded'
                >
                  <option value=''>اختر الولاية</option>
                  {uniqueWilayas.map((wilaya) => (
                    <option key={wilaya.wilaya_code} value={wilaya.wilaya_code}>
                      {wilaya.wilaya_name}
                    </option>
                  ))}
                </select>
                <select
                  className='w-full p-2 border rounded-lg'
                  name='commune'
                  value={orderDetails.commune}
                  onChange={handleOrderChange}
                  required
                  disabled={!orderDetails.wilaya}
                >
                  <option value=''>اختر البلدية</option>
                  {communes.map((commune) => (
                    <option key={commune.id} value={commune.commune_name}>
                      {commune.commune_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Type */}
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

              {/* Stop Desk or Address */}
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

              {/* Delivery Date */}
              <div className='mb-4'>
                <label htmlFor='deliveryDate' className='block text-sm font-medium mb-2'>
                  تاريخ الاستلام المطلوب
                </label>
                <input
                  type='date'
                  id='deliveryDate'
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
              onClick={() => {
                setOrderSuccess(false); // Reset the success state
                navigate('/my-orders'); // Navigate to the orders page
              }}
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

export default Product;  