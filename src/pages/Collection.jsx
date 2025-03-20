import React, { useState, useEffect } from 'react';
import ProductItem from '../components/ProductItem';
import supabase from '../../supabaseClient'; // Import Supabase client

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAtelier, setSelectedAtelier] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('newToOld'); // Default sorting order

  const ateliers = ['Courva', 'Rayma'];

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

  // Handle sorting logic
  const sortProducts = (products, order) => {
    switch (order) {
      case 'newToOld':
        return [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldToNew':
        return [...products].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'priceHighToLow':
        return [...products].sort((a, b) => b.price - a.price);
      case 'priceLowToHigh':
        return [...products].sort((a, b) => a.price - b.price);
      default:
        return products;
    }
  };

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

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => !selectedAtelier || product.atelier === selectedAtelier)
    .filter((product) => !selectedCategory || product.category === selectedCategory)
    .filter((product) => !selectedSubCategory || product.subCategory === selectedSubCategory);

  const sortedProducts = sortProducts(filteredProducts, sortOrder);

  return (
    <div className='flex flex-col sm:flex-row gap-6 sm:gap-8 pt-10 border-t'>
      {/* Filter Options */}
      <div className='min-w-60'>
        {/* Filter Button */}
        <button
          className='w-full p-3 text-gray-700 flex items-center justify-between hover:text-gray-900 transition-colors'
          onClick={() => setShowFilter(!showFilter)}
        >
          <span className='font-medium'>تصفية</span>
          {/* Up/Down Arrow Icon 
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`h-5 w-5 transform ${showFilter ? 'rotate-180' : ''} transition-transform`}
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>*/}
          {/* Alternatively, use a Filter/Parameter Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor" 
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg> 
        </button>

        {/* Sorting Filter */}
        <div className={`border border-gray-200 p-5 mt-6 rounded-lg bg-white shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium text-gray-700'>ترتيب حسب</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <select
              className='w-full p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value='newToOld'>الأحدث إلى الأقدم</option>
              <option value='oldToNew'>الأقدم إلى الأحدث</option>
              <option value='priceHighToLow'>السعر من الأعلى إلى الأدنى</option>
              <option value='priceLowToHigh'>السعر من الأدنى إلى الأعلى</option>
            </select>
          </div>
        </div>

        {/* Atelier Filter */}
        <div className={`border border-gray-200 p-5 mt-6 rounded-lg bg-white shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium text-gray-700'>المتجر</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {ateliers.map((atelier, index) => (
              <p key={index} className='flex gap-2'>
                <input
                  type='checkbox'
                  className='w-4 h-4 accent-gray-700'
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
        <div className={`border border-gray-200 p-5 mt-6 rounded-lg bg-white shadow-sm ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium text-gray-700'>الفئة</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input
                type='checkbox'
                className='w-4 h-4 accent-gray-700'
                value='Hommes'
                checked={selectedCategory === 'Hommes'}
                onChange={() => setSelectedCategory('Hommes')}
              />
              رجال
            </p>
            <p className='flex gap-2'>
              <input
                type='checkbox'
                className='w-4 h-4 accent-gray-700'
                value='Femmes'
                checked={selectedCategory === 'Femmes'}
                onChange={() => setSelectedCategory('Femmes')}
              />
              نساء
            </p>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className='flex-1'>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
          {sortedProducts.map((item, index) => (
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