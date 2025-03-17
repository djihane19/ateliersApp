import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../../../supabaseClient'; // Import Supabase client

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const navigate = useNavigate();

  // Constants
  const ROWS_PER_PAGE = 5; // Number of products to display per page

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // Ensure this matches your table name
          .select('*');

        if (error) {
          throw error;
        }

        // Sort products by ID in descending order (most recent first)
        const sortedData = data.sort((a, b) => b.id - a.id);

        setProducts(sortedData || []); // Ensure data is not null
      } catch (error) {
        console.error('Error fetching products:', error.message);
        setProducts([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId); // Use 'id' as the primary key

      if (error) {
        throw error;
      }

      // Update local state after deletion
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error.message);
      throw error;
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Deletion failed:', error);
        alert('فشل الحذف، يرجى المحاولة مرة أخرى');
      }
    }
  };

  // Filter products by atelier
  const moNeatProducts = products.filter((p) => p.atelier === 'Mo Neat');
  const courvaProducts = products.filter((p) => p.atelier === 'Courva');
  const raymaProducts = products.filter((p) => p.atelier === 'Rayma');

  // Pagination logic for each atelier
  const getPaginatedProducts = (atelierProducts) => {
    const totalPages = Math.ceil(atelierProducts.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return {
      paginatedProducts: atelierProducts.slice(startIndex, endIndex),
      totalPages,
    };
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Render table for each atelier
  const renderTable = (atelierProducts, atelierName) => {
    const { paginatedProducts, totalPages } = getPaginatedProducts(atelierProducts);

    return (
      <div className='mb-8' key={atelierName}>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>{atelierName}</h2>
          <Link
            to='/admin/products/add'
            state={{ atelier: atelierName }}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
          >
            إضافة منتج لـ {atelierName}
          </Link>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white border border-gray-200'>
            <thead>
              <tr>
                <th className='py-2 px-4 border-b'>الصورة</th>
                <th className='py-2 px-4 border-b'>الاسم</th>
                <th className='py-2 px-4 border-b'>السعر</th>
                <th className='py-2 px-4 border-b'>الفئة</th>
                <th className='py-2 px-4 border-b'>الأحجام</th>
                <th className='py-2 px-4 border-b'>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id}>
                  <td className='py-2 px-4 border-b text-center'>
                    <img
                      src={product.image?.[0] || 'https://via.placeholder.com/150'} // Fallback to a placeholder image
                      alt={product.name}
                      className='w-16 h-16 object-cover mx-auto'
                    />
                  </td>
                  <td className='py-2 px-4 border-b text-center'>{product.name}</td>
                  <td className='py-2 px-4 border-b text-center'>{product.price} دج</td>
                  <td className='py-2 px-4 border-b text-center'>{product.category}</td>
                  <td className='py-2 px-4 border-b text-center'>{product.sizes?.join(', ') || 'N/A'}</td>
                  <td className='py-2 px-4 border-b text-center'>
                    <button
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className='text-blue-500 hover:text-blue-700 mr-2'
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className='text-red-500 hover:text-red-700'
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedProducts.length === 0 && (
            <div className='text-center py-4 text-gray-500'>
              لا توجد منتجات متاحة لـ {atelierName}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className='flex justify-center mt-4'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='px-4 py-2 mx-1 border rounded-lg bg-gray-200 disabled:opacity-50'
          >
            السابق
          </button>
          <span className='px-4 py-2 mx-1'>
            الصفحة {currentPage} من {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='px-4 py-2 mx-1 border rounded-lg bg-gray-200 disabled:opacity-50'
          >
            التالي
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className='text-center py-10'>جاري التحميل...</div>;
  }

  if (products.length === 0) {
    return (
      <div className='text-center py-10'>
        <h1 className='text-2xl font-bold mb-6'>إدارة المنتجات</h1>
        <p className='text-gray-600 mb-4'>لا توجد منتجات متاحة</p>
        <Link
          to='/admin/products/add'
          className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
        >
          إضافة منتج جديد
        </Link>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>إدارة المنتجات</h1>

      {renderTable(moNeatProducts, 'Mo Neat')}
      {renderTable(courvaProducts, 'Courva')}
      {renderTable(raymaProducts, 'Rayma')}
    </div>
  );
};

export default Products;