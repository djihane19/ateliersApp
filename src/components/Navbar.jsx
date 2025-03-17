import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link, NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext'; // Import AdminContext

const Navbar = () => {
  const { cartCount, products } = useContext(ShopContext); // Add products from context
  const [visible, setVisible] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false); // State to control search bar visibility
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query
  const { isAdminLoggedIn, setIsAdminLoggedIn } = useContext(AdminContext); // Use AdminContext

  // Function to handle search input changes
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search query (name or description)
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'>
        <img src={assets.logo1} className="w-36" alt="" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        {/* Conditionally render Admin NavLink */}
        {isAdminLoggedIn && (
          <NavLink to='/admin/dashboard' className='flex flex-col items-center gap-1'>
            <p>Admin</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
        )}
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>الرئيسية</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>المجموعات</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>اتصل بنا</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>
      <div className='flex items-center gap-6'>
        {/* Search Icon and Search Bar */}
        <div className='relative'>
          <img
            src={assets.search}
            alt=""
            className='w-5 cursor-pointer'
            onClick={() => setShowSearchBar(!showSearchBar)}
          />
          {showSearchBar && (
            <div className='absolute top-10 right-0 bg-white p-4 shadow-lg rounded-lg w-64'>
              <input
                type='text'
                placeholder='ابحث عن منتج...'
                value={searchQuery}
                onChange={handleSearch}
                className='w-full p-2 border rounded-lg'
              />
              {/* Display search results */}
              {searchQuery && (
                <div className='mt-2 max-h-40 overflow-y-auto'>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Link
                        key={product.id} // Use `id` instead of `_id` for Supabase
                        to={`/product/${product.id}`} // Use `id` instead of `_id`
                        className='block p-2 hover:bg-gray-100 rounded-lg'
                      >
                        <div className='font-medium'>{product.name}</div>
                        <div className='text-sm text-gray-500'>
                          {product.description.slice(0, 50)}...
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className='text-gray-500'>لا توجد نتائج</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Icon and Dropdown */}
        <div className='group relative'>
          <Link to={isAdminLoggedIn ? '/admin/dashboard' : '/admin/login'}>
            <img src={assets.user} alt="" className='w-5 cursor-pointer' />
          </Link>
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
              <p className='cursor-pointer hover:text-black'>ملفي</p>
              <Link to='/my-orders'>
                <p className='cursor-pointer hover:text-black'>طلباتي</p>
              </Link>
              <p 
                className='cursor-pointer hover:text-black'
                onClick={() => setIsAdminLoggedIn(false)}
              >
                تسجيل الخروج
              </p>
            </div>
          </div>
        </div>

        {/* Cart Icon */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart} alt="" className='w-5 min-w-5' />
          <p className='absolute right-[-5px] bottom-[8px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {cartCount}
          </p>
        </Link>

        {/* Mobile Menu Icon */}
        <img onClick={() => setVisible(true)} src={assets.menu} className='w-5 cursor-pointer sm:hidden' />
      </div>

      {/* Mobile Sidebar */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-90' src={assets.dropdown} alt="" />
            <p>رجوع</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>الرئيسية</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'> المجموعات </NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>اتصل بنا</NavLink>
          {/* Conditionally render Admin NavLink in mobile sidebar */}
          {isAdminLoggedIn && (
            <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/admin/dashboard'>Admin</NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;  