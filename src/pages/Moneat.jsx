import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import supabase from '../../supabaseClient'; // Import Supabase client
import placeholderImage from '../assets/placeholder.jpg'; // Import the placeholder image

const Moneat = () => {
  const [moneatProducts, setMoneatProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Mo Neat products from Supabase
  useEffect(() => {
    const fetchMoneatProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // Replace 'products' with your table name
          .select('*')
          .eq('atelier', 'Mo Neat'); // Filter products by atelier

        if (error) {
          throw error;
        }

        setMoneatProducts(data || []); // Ensure data is not null
      } catch (error) {
        console.error('Error fetching Mo Neat products:', error.message);
        setMoneatProducts([]); // Set to an empty array in case of error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchMoneatProducts();
  }, []);

  // Redirect to product details page
  const handleBuyNow = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <div className='text-center py-10'>جاري التحميل...</div>;
  }

  if (moneatProducts.length === 0) {
    return (
      <div className='text-center py-10'>
        <Title text1={'Mo Neat'} text2={'ورشة الأزياء الكلاسيكية والأنيقة'} />
        <p className='w-3/4 mx-auto text-gray-600 mt-4'>
          Mo Neat هي ورشة متخصصة في تصميم الأزياء الكلاسيكية والأنيقة التي تجمع بين الأناقة الخالدة والحداثة. نقدم لكم قطعاً فريدة مصنوعة بدقة عالية وبأفضل الخامات.
        </p>
        <div className='mt-6'>لا توجد منتجات متاحة لهذه الورشة حالياً.</div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      {/* Mo Neat Workshop Introduction */}
      <div className='text-center mb-10'>
        <Title text1={'Mo Neat'} text2={'ورشة الأزياء الكلاسيكية والأنيقة'} />
        <p className='w-3/4 mx-auto text-gray-600 mt-4'>
          Mo Neat هي ورشة متخصصة في تصميم الأزياء الكلاسيكية والأنيقة التي تجمع بين الأناقة الخالدة والحداثة. نقدم لكم قطعاً فريدة مصنوعة بدقة عالية وبأفضل الخامات.
        </p>
      </div>

      {/* Display Mo Neat Products */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {moneatProducts.map((product, index) => (
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

export default Moneat;