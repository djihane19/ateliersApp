import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const [activeAtelier, setActiveAtelier] = useState('Courva'); // Default to Courva

  // Contact information for each atelier
  const ateliers = {
    Courva: {
      name: 'Courva',
      description: '.تواصل مع ورشة Courva عبر وسائل التواصل الاجتماعي للحصول على المزيد من المعلومات',
      socialMedia: {
        facebook: 'https://facebook.com/',
        instagram: 'https://instagram.com/',
        whatsapp: 'https://wa.me/1234567890', // Replace with Courva's WhatsApp number
      },
    },
    Rayma: {
      name: 'Rayma',
      description: '.تواصل مع ورشة Rayma عبر وسائل التواصل الاجتماعي للحصول على المزيد من المعلومات',
      socialMedia: {
        facebook: 'https://www.facebook.com/profile.php?id=61572622670217',
        instagram: 'https://www.instagram.com/rayma.dz?igsh=NzB1cGh1bXFvMHAz',
        whatsapp: 'https://wa.me/0987654321', // Replace with Rayma's WhatsApp number
      },
    },
  };

  const currentAtelier = ateliers[activeAtelier];

  return (
    <div className='p-6 bg-gray-50 min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center'>
        {/* Navigation Bar */}
        <div className='flex justify-center space-x-4 mb-6'>
          <button
            onClick={() => setActiveAtelier('Courva')}
            className={`px-4 py-2 rounded-lg transition ${
              activeAtelier === 'Courva'
                ? 'text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={{
              background:
                activeAtelier === 'Courva'
                  ? 'linear-gradient(135deg, #ff6f61 0%, #ff4d4d 100%)'
                  : '',
            }}
          >
            Courva
          </button>
          <button
            onClick={() => setActiveAtelier('Rayma')}
            className={`px-4 py-2 rounded-lg transition ${
              activeAtelier === 'Rayma'
                ? 'text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            style={{
              background:
                activeAtelier === 'Rayma'
                  ? 'linear-gradient(135deg, #ff6f61 0%, #ff4d4d 100%)'
                  : '',
            }}
          >
            Rayma
          </button>
        </div>

        {/* Atelier Name */}
        <h1 className='text-3xl font-bold mb-6' dir="rtl">تواصل مع {currentAtelier.name}</h1>

        {/* Description */}
        <p className='text-gray-600 mb-6'>{currentAtelier.description}</p>

        {/* Social Media Links */}
        <div className='flex justify-center space-x-6'>
          {/* Facebook */}
          <a
            href={currentAtelier.socialMedia.facebook}
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#1877F2] hover:text-[#166FE5] transition'
          >
            <FaFacebook className='w-8 h-8' />
            <span className='sr-only'>Facebook</span>
          </a>

          {/* Instagram */}
          <a
            href={currentAtelier.socialMedia.instagram}
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#E4405F] hover:text-[#D42D4C] transition'
          >
            <FaInstagram className='w-8 h-8' />
            <span className='sr-only'>Instagram</span>
          </a>

         

          {/* WhatsApp */}
          <a
            href={currentAtelier.socialMedia.whatsapp}
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#25D366] hover:text-[#20B358] transition'
          >
            <FaWhatsapp className='w-8 h-8' />
            <span className='sr-only'>WhatsApp</span>
          </a>
        </div>

        {/* Additional Message */}
        <p className='text-gray-600 mt-6' dir="rtl">
       يمكنك أيضًا مراسلتنا مباشرة على الواتساب للاستفسارات السريعة. نحن هنا لمساعدتك !
        </p>
      </div>
    </div>
  );
};

export default Contact;  