import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { ChromePicker } from 'react-color';
import supabase from '../../supabaseClient'; // Import Supabase client
import placeholderImage from '../assets/placeholder.png'; // Import the placeholder image

const AddEditProduct = () => {
  const { productId } = useParams(); // Get product ID from URL
  const navigate = useNavigate();

  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: Array(6).fill(null), // 1 main image + 5 additional images
    category: '',
    subCategory: '',
    sizes: [],
    atelier: '',
    bestseller: false,
    color: [],
    disponible: false,
    height: false,
    width: false,
    heightValue: '',
    widthValue: '',
  });

  // State for color picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');

  // Pre-fill form data when in edit mode
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.error('Error fetching product:', error.message);
        } else if (data) {
          // Ensure image is always an array
          const safeData = { ...data, image: data.image || Array(6).fill(null) };
          setFormData(safeData);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // Handle image changes
  const handleImageChange = async (index, file) => {
    if (!file) {
      const newImages = [...formData.image];
      newImages[index] = null;
      setFormData({ ...formData, image: newImages });
      return;
    }

    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file only.');
      return;
    }

    const newImages = [...formData.image];
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products') // Ensure this bucket exists and is configured (public or with INSERT policy)
        .upload(fileName, file, {
          contentType: file.type, // Explicitly set content type
          upsert: true, // Allow overwrite if exists (safer for duplicates)
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert(`Upload failed: ${uploadError.message}. Check bucket policies or size limits (max 6MB for standard upload).`);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log(`Image uploaded successfully at index ${index}: ${publicUrl}`);

      // Optional: Verify URL accessibility
      try {
        const response = await fetch(publicUrl, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('Uploaded image URL may not be publicly accessible:', publicUrl);
        }
      } catch (verifyError) {
        console.error('URL verification failed:', verifyError);
      }

      newImages[index] = publicUrl;
      setFormData({ ...formData, image: newImages });
    } catch (error) {
      console.error('Unexpected error in image upload:', error);
      alert('An unexpected error occurred during upload. Check console for details.');
    }
  };

  // Handle size changes
  const handleSizeChange = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // Add a color
  const handleAddColor = () => {
    if (currentColor && !formData.color.includes(currentColor)) {
      setFormData({ ...formData, color: [...formData.color, currentColor] });
    }
  };

  // Remove a color
  const handleRemoveColor = (color) => {
    setFormData({ ...formData, color: formData.color.filter((c) => c !== color) });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure all image uploads are complete (async wait if needed, but since handleImageChange is async, state should be updated)
      console.log('Submitting with images:', formData.image.filter(img => img !== null));

      // Convert empty strings to null for numeric fields
      const productData = {
        ...formData,
        price: formData.price === '' ? null : parseFloat(formData.price), // Convert to number
        heightValue: formData.heightValue === '' ? null : parseFloat(formData.heightValue), // Convert to number
        widthValue: formData.widthValue === '' ? null : parseFloat(formData.widthValue), // Convert to number
        image: formData.image.filter((img) => img !== null && img !== ''), // Remove null/empty strings; assumes text[] column
      };

      if (productId) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        console.log('Product updated successfully');
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select();

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }

        productData.id = data[0].id; // Set the ID for the new product
        console.log('Product inserted successfully with ID:', data[0].id);
      }

      alert('Product saved successfully!');
      navigate('/admin/products'); // Redirect to the products page
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error saving product: ${error.message}. Check console and table schema (image should be text[]).`);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) {
          throw error;
        }

        navigate('/admin/products'); // Redirect to the products page
      } catch (error) {
        console.error('Error:', error);
        alert('حدث خطأ أثناء حذف المنتج. يرجى المحاولة مرة أخرى.');
      }
    }
  };

  // Available sizes
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Validate height and width fields
  const isHeightValid = !formData.height || formData.heightValue;
  const isWidthValid = !formData.width || formData.widthValue;
  const isFormValid = isHeightValid && isWidthValid;

  return (
    <div className='p-6' dir='rtl'>
      <h1 className='text-2xl font-bold mb-6'>{productId ? 'تعديل المنتج' : 'إضافة منتج'}</h1>
      <form onSubmit={handleSubmit}>
        {/* Name and Price */}
        <div className='flex gap-4 mb-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>الاسم</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg'
              required
            />
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>السعر</label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg'
              required
            />
          </div>
        </div>

        {/* Atelier and Category */}
        <div className='flex gap-4 mb-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>الورشة</label>
            <select
              name='atelier'
              value={formData.atelier}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg'
              required
            >
              <option value=''>اختر ورشة</option>
              <option value='Courva'>Courva</option>
              <option value='Rayma'>Rayma</option>
            </select>
          </div>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>الفئة</label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg'
              required
            >
              <option value=''>اختر فئة</option>
              <option value='Hommes'>رجال</option>
              <option value='Femmes'>نساء</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>الوصف</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            className='w-full p-2 border rounded-lg'
            required
          />
        </div>

        {/* Images */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>الصور</label>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Main Image */}
            <div>
              <label className='block text-sm font-medium mb-1'>الصورة الرئيسية</label>
              <input
                type='file'
                accept='image/*'
                onChange={(e) => handleImageChange(0, e.target.files[0])}
                className='w-full p-2 border rounded-lg'
              />
              {formData.image[0] ? (
                <img
                  src={formData.image[0]}
                  alt="Main"
                  className="w-16 h-16 object-cover mt-2"
                  onError={(e) => console.error('Failed to load main image:', e)}
                />
              ) : (
                <img src={placeholderImage} alt="Placeholder" className="w-16 h-16 object-cover mt-2 opacity-50" />
              )}
            </div>
            {/* Additional Images */}
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index}>
                <label className='block text-sm font-medium mb-1'>صورة إضافية {index}</label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                  className='w-full p-2 border rounded-lg'
                />
                {formData.image[index] ? (
                  <img
                    src={formData.image[index]}
                    alt={`Additional ${index}`}
                    className="w-16 h-16 object-cover mt-2"
                    onError={(e) => console.error(`Failed to load additional image ${index}:`, e)}
                  />
                ) : (
                  <img src={placeholderImage} alt="Placeholder" className="w-16 h-16 object-cover mt-2 opacity-50" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>الأحجام المتاحة</label>
          <div className='flex gap-2'>
            {availableSizes.map((size, index) => (
              <label key={index} className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  value={size}
                  checked={formData.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>الألوان</label>
          <div className='flex gap-2 mb-2'>
            {formData.color.map((color, index) => (
              <div
                key={index}
                className='w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer'
                style={{ backgroundColor: color }}
                onClick={() => handleRemoveColor(color)}
              >
                <span className='text-xs text-white'>×</span>
              </div>
            ))}
          </div>
          <div className='relative'>
            <button
              type='button'
              className='p-2 border rounded-lg bg-gray-100 hover:bg-gray-200'
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              إضافة لون
            </button>
            {showColorPicker && (
              <div className='absolute z-10 mt-2'>
                <ChromePicker
                  color={currentColor}
                  onChange={(color) => setCurrentColor(color.hex)}
                />
                <button
                  type='button'
                  className='mt-2 p-2 bg-blue-500 text-white rounded-lg'
                  onClick={handleAddColor}
                >
                  تأكيد
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>التوفر</label>
          <input
            type='checkbox'
            name='disponible'
            checked={formData.disponible}
            onChange={handleChange}
            className='mr-2'
          />
          متوفر
        </div>

        {/* Height */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>الطول </label>
          <input
            type='checkbox'
            name='height'
            checked={formData.height}
            onChange={handleChange}
            className='mr-2'
          />
          إضافة طول
          {formData.height && (
            <input
              type='number'
              name='heightValue'
              value={formData.heightValue}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg mt-2'
              placeholder='أدخل الطول'
              required
            />
          )}
        </div>

        {/* Width */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>العرض</label>
          <input
            type='checkbox'
            name='width'
            checked={formData.width}
            onChange={handleChange}
            className='mr-2'
          />
          إضافة عرض
          {formData.width && (
            <input
              type='number'
              name='widthValue'
              value={formData.widthValue}
              onChange={handleChange}
              className='w-full p-2 border rounded-lg mt-2'
              placeholder='أدخل العرض'
              required
            />
          )}
        </div>

        {/* Bestseller */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1'>الأكثر مبيعاً</label>
          <input
            type='checkbox'
            name='bestseller'
            checked={formData.bestseller}
            onChange={handleChange}
            className='mr-2'
          />
          منتج الأكثر مبيعاً
        </div>

        {/* Submit and Delete Buttons */}
        <div className='flex gap-4'>
          <button
            style={{ background: isFormValid ? 'linear-gradient(135deg, #ff6f61 0%, #ff4d4d 100%)' : 'gray' }}
            className='w-full text-white py-2 rounded-lg hover:opacity-90 transition'
            type='submit'
            disabled={!isFormValid}
          >
            {productId ? 'تعديل المنتج' : 'إضافة المنتج'}
          </button>
          {productId && (
            <button
              onClick={handleDelete}
              className='w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition'
            >
              حذف المنتج
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;