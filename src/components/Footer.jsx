import React, { useState } from 'react';
import { assets } from '../assets/assets'; // Assurez-vous d'importer vos assets

const Footer = () => {
  const [showContact, setShowContact] = useState(false); // État pour afficher/masquer la boîte de dialogue
  const [message, setMessage] = useState(''); // État pour stocker le message

  // Fonction pour ouvrir la boîte de dialogue
  const handleContactClick = () => {
    setShowContact(true);
  };

  // Fonction pour envoyer un e-mail
  const handleSendEmail = () => {
    const subject = encodeURIComponent("اتصال من الموقع");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:kd_torchane@esi.dz?subject=${subject}&body=${body}`;
    setShowContact(false); // Fermer la boîte de dialogue après l'envoi
  };

  return (
    <footer 
      style={{ 
        backgroundColor: '#f8f8f8', // Fond clair et élégant
        color: '#333', // Texte sombre pour contraster
        padding: '2rem 1rem', 
        textAlign: 'center', 
        position: 'relative', 
        marginTop: '2rem', 
      }}
    >
      {/* Section Ajoutée */}
      <div className='flex flex-col sm:grid grid-cols-[2fr_1fr] gap-14 my-10 mt-10 text-sm text-[#333]'>
  {/* Left Section - Logo and Description */}
  <div className='space-y-6'>
    <img src={assets.logo1} className='w-32 mb-5 transition-transform hover:scale-105' alt="Logo" />
    <div className='space-y-4'>
      <p className='w-full md:w-2/3 text-gray-600 leading-relaxed'>
        فيرا تجسد مزيجًا فريدًا من الأناقة الخالدة والابتكار العصري، حيث يلتقي الفن بالحرفية الراقية. في عالمنا، لكل أسلوب قصة تُروى بتفاصيل استثنائية.
      </p>
      <p className='w-full md:w-2/3 text-gray-600 leading-relaxed'>
        كل قطعة في فيرا هي تحفة فنية مصممة لتلهمك، حيث تمتزج الفخامة بالأصالة، وتتحول الأزياء إلى تجربة تعكس شخصيتك الفريدة.
      </p>
    </div>
  </div>

  {/* Right Section - Contact Information */}
  <div className='space-y-6'>
    <p className='text-xl font-medium mb-5 text-[#333] border-b pb-2 border-gray-200'>اتصل بنا</p>
    <ul className='flex flex-col gap-3 text-gray-600'>
      <li className='flex items-center gap-2 hover:text-[#555] transition-colors'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        +213-554-532-5351
      </li>
      <li className='flex items-center gap-2 hover:text-[#555] transition-colors'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>  
        contact@gmail.com
      </li>
    </ul>
  </div>
</div>
      <hr className='border-gray-300 w-full my-6' /> {/* Ligne de séparation */}

      {/* Texte du footer */}
      <p 
        style={{ 
          fontSize: '0.875rem', 
          cursor: 'pointer', 
          display: 'inline-block', 
          transition: 'transform 0.3s ease, opacity 0.3s ease', 
          opacity: 0.8, 
          paddingTop: '5px',
          color: '#333', // Texte sombre
        }}
        onClick={handleContactClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.opacity = '0.8';
        }}
      >
        صمم بواسطة <strong>T_djihane</strong>
      </p>

      {/* Boîte de dialogue de contact */}
      {showContact && (
        <div 
          style={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            backgroundColor: '#fff', 
            padding: '2rem', 
            borderRadius: '10px', 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', 
            zIndex: 1000, 
            width: '90%', 
            maxWidth: '400px', 
          }}
        >
          <h3 style={{ color: '#1a1a1a', marginBottom: '1rem' }}>اتصل بنا</h3>
          <textarea
            style={{ 
              width: '100%', 
              height: '100px', 
              padding: '0.5rem', 
              borderRadius: '5px', 
              border: '1px solid #ccc', 
              marginBottom: '1rem', 
              resize: 'none', 
            }}
            placeholder="اكتب رسالتك هنا..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button 
            style={{ 
              backgroundColor: '#ff6f61', 
              color: '#fff', 
              padding: '0.5rem 1rem', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              transition: 'background-color 0.3s ease', 
            }}
            onClick={handleSendEmail}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e65a50'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6f61'}
          >
            إرسال
          </button>
          <button 
            style={{ 
              backgroundColor: 'transparent', 
              color: '#ff6f61', 
              padding: '0.5rem 1rem', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginLeft: '1rem', 
              transition: 'color 0.3s ease', 
            }}
            onClick={() => setShowContact(false)}
            onMouseEnter={(e) => e.currentTarget.style.color = '#e65a50'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ff6f61'}
          >
            إلغاء
          </button>
        </div>
      )}
    </footer>
  );
};

export default Footer; 