import React from 'react';
import { FaTruck, FaShieldAlt, FaHeadset, FaCreditCard } from 'react-icons/fa'; // Import des icônes

const OurPolicy = () => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        padding: '5rem 1rem', 
        backgroundColor: '#f8f8f8', 
        gap: '2rem', 
      }}
      className="lg:flex-nowrap lg:justify-around md:gap-4 sm:gap-2"
    >
      {/* Politique 1 : Livraison Rapide */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          maxWidth: '250px', 
          flex: '1 1 45%', // 2 par ligne en md
        }}
        className="lg:flex-1 lg:max-w-none sm:flex-none sm:max-w-full"
      >
        <FaTruck style={{ width: '36px', height: '36px', marginBottom: '1rem', color: '#ff6f61' }} />
        <p style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>توصيل سريع</p>
        <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>استلم طلبك في أقل من 7 أيام مع <strong>LeoparExpress</strong>.</p>
      </div>

      {/* Politique 2 : Paiement Sécurisé */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          maxWidth: '250px', 
          flex: '1 1 45%', // 2 par ligne en md
        }}
        className="lg:flex-1 lg:max-w-none sm:flex-none sm:max-w-full"
      >
        <FaCreditCard style={{ width: '36px', height: '36px', marginBottom: '1rem', color: '#ff6f61' }} />
        <p style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>دفع آمن</p>
        <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>ادفع عند الاستلام أو عبر الإنترنت بشكل آمن.</p>
      </div>

      {/* Politique 3 : Qualité Garantie */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          maxWidth: '250px', 
          flex: '1 1 45%', // 2 par ligne en md
        }}
        className="lg:flex-1 lg:max-w-none sm:flex-none sm:max-w-full"
      >
        <FaShieldAlt style={{ width: '36px', height: '36px', marginBottom: '1rem', color: '#ff6f61' }} />
        <p style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>جودة مضمونة</p>
        <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>منتجات عالية الجودة، مختارة بعناية من أجلك.</p>
      </div>

      {/* Politique 4 : Support Client */}
      {/* <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          maxWidth: '250px', 
          flex: '1 1 45%', // 2 par ligne en md
        }}
        className="lg:flex-1 lg:max-w-none sm:flex-none sm:max-w-full"
      >
        <FaHeadset style={{ width: '36px', height: '36px', marginBottom: '1rem', color: '#ff6f61' }} />
        <p style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>دعم العملاء</p>
        <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>فريقنا متاح 7 أيام في الأسبوع للإجابة على استفساراتك.</p>
      </div> */}
    </div>
  );
};

export default OurPolicy;