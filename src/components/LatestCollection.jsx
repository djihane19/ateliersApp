import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10)); // Afficher seulement 10 produits
      setLoading(false); // Set loading to false after fetching
    }
  }, [products]);

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

      {/* Affichage des produits */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item.id} // Use `id` from Supabase
            image={item.image} // Use the first image in the array
            name={item.name}
            price={item.price}
            atelier={item.atelier}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;