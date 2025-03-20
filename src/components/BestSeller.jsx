import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Install lucide-react for icons

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainer = useRef(null);

  useEffect(() => {
    const bestSeller = products.filter((item) => item.bestseller);
    setBestSeller(bestSeller);
    setLoading(false); // Set loading to false after filtering
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

  if (bestSeller.length === 0) {
    return (
      <div className='text-center py-10'>
        <Title text1={'الأكثر '} text2={'مبيعاً'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          تصفح أفضل منتجاتنا المميزة التي تحظى بشعبية كبيرة بفضل تصميمها الفريد وجودتها الاستثنائية، والتي ستلائم جميع أذواقك
        </p>
        <div className='mt-6'>لا توجد منتجات الأكثر مبيعاً حالياً.</div>
      </div>
    );
  }

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'الأكثر '} text2={'مبيعاً'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          تصفح أفضل منتجاتنا المميزة التي تحظى بشعبية كبيرة بفضل تصميمها الفريد وجودتها الاستثنائية، والتي ستلائم جميع أذواقك
        </p>
      </div>

      {/* Scroll Container */}
      <div className='relative group'>
        {/* Scrollable Products (Hidden Scrollbar) */}
        <div 
          ref={scrollContainer}
          className='flex overflow-x-auto scrollbar-hide gap-4 px-4 scroll-smooth'
        >
          {bestSeller.map((item, index) => (
            <div key={index} className='flex-shrink-0 w-48 sm:w-56 md:w-64'>
              <ProductItem
                id={item.id}
                image={item.image}
                price={item.price}
                name={item.name}
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
  
export default BestSeller;             