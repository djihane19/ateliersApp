import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import supabase from '../../supabaseClient'; // Import Supabase client
import placeholderImage from '../assets/placeholder.jpg'; // Import the placeholder image

const Courva = () => {
  const [courvaProducts, setCourvaProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Courva products from Supabase
  useEffect(() => {
    const fetchCourvaProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // Ensure this matches your table name
          .select('*')
          .eq('atelier', 'Courva'); // Filter products by atelier

        if (error) {
          throw error;
        }

        setCourvaProducts(data || []); // Ensure data is not null
      } catch (error) {
        console.error('Error fetching Courva products:', error.message);
        setCourvaProducts([]); // Set to an empty array in case of error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCourvaProducts();
  }, []);

  // Redirect to product details page
  const handleBuyNow = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <div className='text-center py-10'>جاري التحميل...</div>;
  }

  if (courvaProducts.length === 0) {
    return (
      <div className='text-center py-10'>
        <Title text1={'Courva'} text2={'ورشة الملابس الرياضية والمعدات'} />
        <p className='w-3/4 mx-auto text-gray-600 mt-4'>
          Courva هي ورشة متخصصة في تصميم الملابس الرياضية والمعدات التي تجمع بين الراحة والأداء العالي. نقدم لكم منتجات مبتكرة تساعدكم على تحقيق أهدافكم الرياضية بأسلوب عصري.
        </p>
        <div className='mt-6'>لا توجد منتجات متاحة لهذه الورشة حالياً.</div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Courva Workshop Introduction */}
      <div className='text-center mb-10'>
        <Title text1={'Courva'} text2={'ورشة الملابس الرياضية والمعدات'} />
        <p className='w-3/4 mx-auto text-gray-600 mt-4'>
          Courva هي ورشة متخصصة في تصميم الملابس الرياضية والمعدات التي تجمع بين الراحة والأداء العالي. نقدم لكم منتجات مبتكرة تساعدكم على تحقيق أهدافكم الرياضية بأسلوب عصري.
        </p>
      </div>

      {/* Display Courva Products */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {courvaProducts.map((product, index) => (
          <div key={index} className='border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
            <img
              src={product.image?.[0] || placeholderImage} // Use the local placeholder image
              alt={product.name}
              className='w-full h-64 object-cover'
            />
            <div className='p-4'>
              <h3 className='text-xl font-semibold mb-2'>{product.name}</h3>
              <p className='text-gray-600 mb-2'>{product.price} دج</p>
              <p className='text-sm text-gray-500 mb-4'>{product.description}</p>
              <button
                onClick={() => handleBuyNow(product.id)} // Use `id` from Supabase
                className='w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition'
              >
                انظر التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courva;