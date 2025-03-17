// GeneratePDF.js
import React from 'react';

const GeneratePDF = ({ order }) => {
  const generatePDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;

    const element = document.createElement('div');
    element.innerHTML = `
      <div dir='rtl' style="
        font-family: 'Amiri', serif;
        padding: 40px;
        background: #ffffff;
        color: #333;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      ">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="/logo1.png" alt="Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />
          <h1 style="font-size: 28px; font-weight: bold; color: #d32f2f; margin-bottom: 5px;">فاتورة الطلب</h1>
          <h2 style="font-size: 20px; color: #555;">Atelier: ${order.atelier}</h2>
        </div> 
  
        <!-- Order Details -->
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <p style="font-size: 16px; margin: 0;"><strong>رقم الطلب:</strong> ${order.id}</p>
            <p style="font-size: 16px; margin: 0;"><strong>التاريخ:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <p style="font-size: 16px; margin: 0;"><strong>الاسم:</strong> ${order.client.firstName} ${order.client.lastName}</p>
            <p style="font-size: 16px; margin: 0;"><strong>الهاتف:</strong> ${order.client.phone}</p>
          </div>
          <p style="font-size: 16px; margin: 10px 0;"><strong>العنوان:</strong> ${order.client.address || order.client.stopDesk}</p>
          <p style="font-size: 16px; margin: 10px 0;"><strong>رسوم التوصيل:</strong> ${order.deliveryFee} دج</p>
          <p style="font-size: 18px; font-weight: bold; color: #d32f2f; margin: 0;">
            <strong>المجموع الكلي:</strong> ${order.total} دج
          </p>
        </div>
    
        <!-- Products Table -->
        <h3 style="font-size: 22px; font-weight: bold; text-align: right; margin-bottom: 20px;">المنتجات المطلوبة</h3>
        <table dir='rtl' style="
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 30px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        ">
          <thead>
            <tr style="background: #d32f2f; color: white;">
              <th style="padding: 15px; text-align: center;">المنتج</th>
              <th style="padding: 15px; text-align: center;">اللون</th>
              <th style="padding: 15px; text-align: center;">الحجم</th>
              <th style="padding: 15px; text-align: center;">السعر</th>
              <th style="padding: 15px; text-align: center;">الكمية</th>
              <th style="padding: 15px; text-align: center;">السعر الكلي</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
              .map(
                (product, index) => `
              <tr style="border-bottom: 1px solid #f0f0f0; background: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'};">
                <td style="padding: 12px; text-align: right;">${product.name}</td>
                <td style="padding: 12px; text-align: center;">
                  <div style="width: 16px; height: 16px; border-radius: 50%; border: 1px solid #ddd; background-color: ${product.color}; margin: 0 auto;"></div>
                </td>
                <td style="padding: 12px; text-align: center;">${product.size}</td>
                <td style="padding: 12px; text-align: center;">${product.price} دج</td>
                <td style="padding: 12px; text-align: center;">${product.quantity}</td>
                <td style="padding: 12px; text-align: center;">${product.quantity * product.price} دج</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
  
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <p style="font-size: 18px; font-weight: bold; color: #555; margin: 0;">
            شكرًا لاختياركم ورشتنا!
          </p>
          <p style="font-size: 14px; color: #777; margin: 10px 0 0;">
            للاستفسارات، يرجى الاتصال بنا على: 123-456-789
          </p>
        </div>
      </div>
    `;
  
    html2pdf()
      .set({
        margin: 10,
        filename: `فاتورة_الطلب_${order.id}.pdf`,
        image: { type: 'jpeg', quality: 0.8 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(element)
      .save();
  };

  return (
    <button
      onClick={generatePDF}
      className='bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition'
    >
      تحميل الفاتورة (PDF)
    </button>
  );
};

export default GeneratePDF;