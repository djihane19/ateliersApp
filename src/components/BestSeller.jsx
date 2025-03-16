import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bestSeller = products.filter((item) => item.bestseller);
    setBestSeller(bestSeller.slice(0, 5)); // Display only 5 products
    setLoading(false); // Set loading to false after filtering
  }, [products]);

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
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item.id} // Use `id` from Supabase
            image={item.image} // Use the first image in the array
            price={item.price}
            name={item.name}  
            atelier={item.atelier}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;