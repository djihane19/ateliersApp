import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      {/* 404 Illustration or Icon */}
      <div className="text-9xl font-bold text-gray-800 mb-4">
        404
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        الصفحة غير موجودة
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-600 mb-8">
        عذرًا، الصفحة التي تبحث عنها غير موجودة أو قد تم نقلها.
      </p>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        العودة إلى الصفحة الرئيسية
      </Link>

      {/* Optional: Add a decorative element or illustration */}
      <div className="mt-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
  );
};

export default NotFound;