import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title1 from '../components/Title1';
import ProductItem from '../components/ProductItem';
import { Link } from 'react-router-dom';
import supabase from '../../supabaseClient'; // Import Supabase client

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAtelier, setSelectedAtelier] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState('');

  const ateliers = ['Mo Neat', 'Courva', 'Rayma'];

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // Replace 'products' with your table name
          .select('*');

        if (error) {
          throw error;
        }

        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  const handleAddSubCategory = () => {
    if (newSubCategory.trim() !== '') {
      setSubCategories([...subCategories, newSubCategory.trim()]);
      setNewSubCategory('');
    }
  };

  const handleDeleteSubCategory = (index) => {
    const updatedSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(updatedSubCategories);
  };

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p
          className='my-3 text-xl flex items-center cursor-pointer gap-2'
          onClick={() => setShowFilter(!showFilter)}
        >
          FILTERS
        </p>

        {/* Atelier Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>ATELIER</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {ateliers.map((atelier, index) => (
              <p key={index} className='flex gap-2'>
                <input
                  type='checkbox'
                  className='w-3'
                  value={atelier}
                  checked={selectedAtelier === atelier}
                  onChange={() => setSelectedAtelier(atelier)}
                />
                {atelier}
              </p>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATÉGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input
                type='checkbox'
                className='w-3'
                value='Hommes'
                checked={selectedCategory === 'Hommes'}
                onChange={() => setSelectedCategory('Hommes')}
              />
              Hommes
            </p>
            <p className='flex gap-2'>
              <input
                type='checkbox'
                className='w-3'
                value='Femmes'
                checked={selectedCategory === 'Femmes'}
                onChange={() => setSelectedCategory('Femmes')}
              />
              Femmes
            </p>
          </div>
        </div>
       
      </div>

      {/* Product List */}  
      <div className='flex-1'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {products
            .filter((product) => !selectedAtelier || product.atelier === selectedAtelier)
            .filter((product) => !selectedCategory || product.category === selectedCategory)
            .filter((product) => !selectedSubCategory || product.subCategory === selectedSubCategory)
            .map((item, index) => (
              <ProductItem
                key={index}
                id={item.id} // Use `id` from Supabase
                image={item.image}
                price={item.price}
                name={item.name}
                atelier={item.atelier}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;