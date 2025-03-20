import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom
import './Hero.css';

const Hero = () => {
  const [currentAtelier, setCurrentAtelier] = useState(0); // Index de l'atelier actuel
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Index de la photo actuelle

  const ateliers = [
    {
      id: 1,
      name: "Rayma",
      link: "Rayma", // Lien pour Rayma
      description: {
        fr: "Robes de Soirée pour des Moments Inoubliables",
        ar: "فساتين السهرة لحظات لا تُنسى"
      },
      photos: [assets.img1, assets.img2, assets.img3] // Remplacez par vos images
    },
    {
      id: 2,
      name: "Courva",
      link: "Courva", // Lien pour Courva
      description: {
        fr: "Performance et Style pour une Vie Active",
        ar: "الأداء والأناقة لحياة نشطة"
      },
      photos: [assets.img4, assets.img5, assets.img6] // Remplacez par vos images
    }
  ];

  // Changement automatique des photos toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => 
        (prev === ateliers[currentAtelier].photos.length - 1) ? 0 : prev + 1
      );
    }, 5000); // 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle
  }, [currentAtelier]);

  const handleNextAtelier = () => {
    setCurrentAtelier((prev) => (prev === ateliers.length - 1 ? 0 : prev + 1));
    setCurrentPhotoIndex(0); // Réinitialiser l'index de la photo
  };

  const handlePrevAtelier = () => {
    setCurrentAtelier((prev) => (prev === 0 ? ateliers.length - 1 : prev - 1));
    setCurrentPhotoIndex(0); // Réinitialiser l'index de la photo
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      (prev === ateliers[currentAtelier].photos.length - 1) ? 0 : prev + 1
    );
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      (prev === 0) ? ateliers[currentAtelier].photos.length - 1 : prev - 1
    );
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-80vh">
      {/* Partie Gauche : Informations de l'Atelier */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-4 sm:px-8 bg-[#f8f8f8]">
        <div className="text-[#414141] text-center sm:text-left max-w-md">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
            <p className="font-medium text-sm md:text-base uppercase tracking-widest">ATELIER</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-tight font-serif mb-6">
            {ateliers[currentAtelier].name}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {ateliers[currentAtelier].description.ar}
          </p>
          {/* Bouton EXPLORER */}
          <Link to={`/atelier/${ateliers[currentAtelier].link}`}>
            <button className="explorer-button">
              اكتشف
            </button>
          </Link>
          {/* Boutons de navigation */}
          <div className="flex justify-center sm:justify-start gap-4 mt-8">
            <button 
              onClick={handlePrevAtelier} 
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            >
              ←
            </button>
            <button 
              onClick={handleNextAtelier} 
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Partie Droite : Carrousel des Photos */}
      <div className="w-full sm:w-1/2 relative">
        <div className="each-slide">
          <img 
            src={ateliers[currentAtelier].photos[currentPhotoIndex]} 
            alt={`${ateliers[currentAtelier].name} ${currentPhotoIndex + 1}`} 
            className="w-full h-screen object-cover" 
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;