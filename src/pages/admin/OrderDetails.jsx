import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import supabase from '../../../supabaseClient'; // Import Supabase client

const OrderDetails = () => {
  const { state } = useLocation();
  const { orderId } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(true);

  // Fetch order details from Supabase if not passed via state
  useEffect(() => {
    const fetchOrder = async () => {
      if (!order) {
        try {
          const { data, error } = await supabase
            .from('orders') // Replace 'orders' with your table name
            .select('*')
            .eq('id', orderId) // Filter by order ID
            .single(); // Get a single record

          if (error) {
            throw error;
          }

          setOrder(data);
        } catch (error) {
          console.error('Error fetching order:', error.message);
        } finally {
          setLoading(false); // Set loading to false after fetching
        }
      } else {
        setLoading(false); // If order is passed via state, skip loading
      }
    };

    fetchOrder();
  }, [orderId, order]);

  if (loading) {
    return <div className='text-center py-10'>جاري التحميل...</div>;
  }

  if (!order) {
    return <div className='text-center py-10'>Commande non trouvée</div>;
  }

  return (
    <div className='p-4 sm:p-6' >
      <h1 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6'>
        Détails de la commande #{order.id}
      </h1>

      <div className='bg-white rounded-lg shadow-md p-4 sm:p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6'>
          {/* Client Information */}
          <div>
            <h2 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-4'>
              Informations client
            </h2>
            <div className='space-y-1 sm:space-y-2 text-sm sm:text-base'>
              <p><strong>Nom:</strong> {order.client.firstName} {order.client.lastName}</p>
              <p><strong>Téléphone:</strong> {order.client.phone}</p>
              <p><strong>Wilaya:</strong> {order.client.wilaya}</p>
              <p><strong>Commune:</strong> {order.client.commune}</p>
              <p><strong>Type de livraison:</strong> {order.client.deliveryType}</p>
              <p><strong>Adresse:</strong> {order.client.address || order.client.stopDesk}</p>
              <p><strong>Date de livraison:</strong> {order.client.deliveryDate}</p>
            </div>
          </div>

          {/* Order Details */}
          <div>
            <h2 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-4'>
              Détails de la commande
            </h2>
            <div className='space-y-1 sm:space-y-2 text-sm sm:text-base'>
              <p><strong>Atelier:</strong> {order.atelier}</p>
              <p><strong>Statut:</strong> {order.status}</p>
              <p><strong>Frais de livraison:</strong> {order.deliveryFee} DA</p>
              <p><strong>Total:</strong> {order.total} DA</p>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className='mt-6 sm:mt-8'>
          <h2 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-4'>
            Produits commandés
          </h2>
          {order.products.map((product, index) => (
            <div key={index} className='border-b py-2 sm:py-4'>
              <div className='flex items-start gap-2 sm:gap-4'>
                <img
                  src={product.image || 'https://via.placeholder.com/150'} // Fallback to a placeholder image
                  alt={product.name}
                  className='w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg'
                />
                <div className='flex-1'>
                  <h3 className='text-base sm:text-lg font-semibold'>{product.name}</h3>
                  <p className='text-gray-600 text-sm sm:text-base'>{product.price} DA</p>
                  <div className='text-xs sm:text-sm text-gray-500'>
                    <p>Taille: {product.size}</p>
                    <div className='flex items-center gap-1 sm:gap-2'>
                      <p>Couleur:</p>
                      <div
                        className='w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300'
                        style={{ backgroundColor: product.color }}
                      />
                    </div>
                    <p>Quantité: {product.quantity}</p>
                    {product.selectedWidth && <p>Largeur: {product.selectedWidth}</p>}
                    {product.selectedHeight && <p>Hauteur: {product.selectedHeight}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;  