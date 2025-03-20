import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Install lucide-react for icons

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainer = useRef(null);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
      setLoading(false);
    }
  }, [products]);

  // Handle scroll with arrows
  const handleScroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = scrollContainer.current.clientWidth * 0.8; // Adjust scroll distance
      scrollContainer.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return <div className='text-center py-10'>جاري التحميل...</div>;
  }

  if (latestProducts.length === 0) {
    return (
      <div className='text-center py-10'>
        <Title text1={'أحدث '} text2={'المجموعات'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          اكتشف أحدث مجموعاتنا، مزيج مثالي بين الأناقة الخالدة والحداثة الجريئة، مصممة لإضفاء لمسة ساحرة على كل لحظة من حياتك اليومية
        </p>
        <div className='mt-6'>لا توجد منتجات متاحة حالياً.</div>
      </div>
    );
  }

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'أحدث '} text2={'المجموعات'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          اكتشف أحدث مجموعاتنا، مزيج مثالي بين الأناقة الخالدة والحداثة الجريئة، مصممة لإضفاء لمسة ساحرة على كل لحظة من حياتك اليومية
        </p>
      </div>

      {/* Scroll Container */}
      <div className='relative group'>
        {/* Scrollable Products (Hidden Scrollbar) */}
        <div 
          ref={scrollContainer}
          className='flex overflow-x-auto scrollbar-hide gap-4 px-4 scroll-smooth'
        >
          {latestProducts.map((item, index) => (
            <div key={index} className='flex-shrink-0 w-48 sm:w-56 md:w-64'>
              <ProductItem
                id={item.id}
                image={item.image}
                name={item.name}
                price={item.price}
                atelier={item.atelier}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Desktop Only) */}
        <div className='hidden md:flex justify-center gap-4 mt-6'>
          <button 
            onClick={() => handleScroll('left')}
            className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
          >
            <ChevronLeft className='w-6 h-6 text-gray-700' />
          </button>
          <button 
            onClick={() => handleScroll('right')}
            className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
          >
            <ChevronRight className='w-6 h-6 text-gray-700' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestCollection;