import jsPDF from 'jspdf';

const generatePDF = (order) => {
  const doc = new jsPDF();

  // Add order details to the PDF
  doc.setFontSize(18);
  doc.text('فاتورة الطلب', 10, 10);
  doc.setFontSize(12);
  doc.text(`رقم الطلب: ${order.id}`, 10, 20);
  doc.text(`الاسم: ${order.client.firstName} ${order.client.lastName}`, 10, 30);
  doc.text(`الهاتف: ${order.client.phone}`, 10, 40);
  doc.text(`العنوان: ${order.client.address || order.client.stopDesk}`, 10, 50);
  doc.text(`المجموع الكلي: ${order.total} دج`, 10, 60);

  // Add products to the PDF
  let y = 70;
  order.products.forEach((product, index) => {
    doc.text(`${index + 1}. ${product.name}`, 10, y);
    doc.text(`السعر: ${product.price} دج`, 50, y);
    doc.text(`الكمية: ${product.quantity}`, 100, y);
    y += 10;
  });

  // Save the PDF
  doc.save(`فاتورة_الطلب_${order.id}.pdf`);
};