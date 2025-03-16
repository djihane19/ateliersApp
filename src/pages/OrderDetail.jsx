import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient'; // Import Supabase client

const OrderDetails = () => {
  const { orderId } = useParams(); // Get order ID from URL
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  // Fetch order from Supabase
  useEffect(() => {
    const fetchOrder = async () => {
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
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Commande non trouvée</h1>
        <button
          onClick={() => navigate('/admin/orders')}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Retour à la liste des commandes
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Détails de la Commande #{order.id}</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations du Client</h2>
            <div className="space-y-2">
              <p><strong>Nom:</strong> {order.client.firstName} {order.client.lastName}</p>
              <p><strong>Téléphone:</strong> {order.client.phone}</p>
              <p><strong>Wilaya:</strong> {order.client.wilaya}</p>
              <p><strong>Commune:</strong> {order.client.commune}</p>
              <p><strong>Type de livraison:</strong> {order.client.deliveryType}</p>
              <p><strong>Adresse:</strong> {order.client.address || order.client.stopDesk}</p>
              <p><strong>Date de livraison:</strong> {order.client.deliveryDate}</p>
            </div>
          </div>

          {/* Order Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations de la Commande</h2>
            <div className="space-y-2">
              <p><strong>Statut:</strong> {order.status}</p>
              <p><strong>Total:</strong> {order.total} DA</p>
              <p><strong>Atelier:</strong> {order.atelier}</p>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Produits Commandés</h2>
          {order.products.map((product, index) => (
            <div key={index} className="border-b py-4">
              <div className="flex items-start gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.price} DA</p>
                  <div className="text-sm text-gray-500">
                    <p>Taille: {product.size}</p>
                    <p>Couleur: {product.color}</p>
                    <p>Quantité: {product.quantity}</p>
                    {product.selectedWidth && <p>Largeur: {product.selectedWidth}</p>}
                    {product.selectedHeight && <p>Hauteur: {product.selectedHeight}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Retour à la liste des commandes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;