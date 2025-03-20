import React from 'react';

const NewsletterBox = () => {
    const onSubmitHandler = (event) => {
        event.preventDefault();
        alert('تم الاشتراك بنجاح');
    };

    return (
        <div className='text-center py-12 bg-[#f8f8f8]' dir='rtl'>
            <p className='text-2xl font-medium text-gray-800'>اشترك الآن</p>
            <p className='text-gray-400 mt-3'>كن أول من يعرف عند وصول منتجات جديدة</p>
            <form 
                onSubmit={onSubmitHandler} 
                className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 rounded-lg overflow-hidden shadow-sm'
            >
                <input 
                    className='w-full sm:flex-1 outline-none py-3 text-gray-700' 
                    type="email" 
                    placeholder='أدخل بريدك الإلكتروني' 
                    required 
                />
                <button 
                    type='submit' 
                    className='bg-black text-white text-xs px-8 py-4 hover:bg-gray-800 transition-colors'
                >
                    اشتراك
                </button>
            </form>
        </div>
    );
};

export default NewsletterBox;