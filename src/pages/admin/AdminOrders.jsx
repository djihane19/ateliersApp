import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../supabaseClient'; // Import Supabase client

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedAtelier, setSelectedAtelier] = useState('Mo Neat');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders') // Ensure this matches your table name
          .select('*');

        if (error) {
          throw error;
        }

        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setOrders([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchOrders();
  }, []);

  // Filter orders by selected atelier
  const filteredOrders = selectedAtelier
    ? orders.filter((order) => order.atelier === selectedAtelier)
    : orders;

  // Handle status change
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId) // Filter by order ID
        .select(); // Return the updated data

      if (error) {
        throw error;
      }

      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert('Statut mis à jour avec succès!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Handle viewing order details
  const handleViewDetails = (order) => {
    navigate(`/admin/orders/${order.id || 'unknown'}`, { state: { order } });
  };

  // Get row background color based on order status
  const getRowBackgroundColor = (order) => {
    switch (order.status) {
      case 'en cours': // En cours (In Progress)
        return 'bg-yellow-50 hover:bg-yellow-100'; // Light yellow
      case 'en livraison': // En livraison (Out for Delivery)
        return 'bg-blue-50 hover:bg-blue-100'; // Light blue
      case 'terminée': // Terminée (Completed)
        return 'bg-green-50 hover:bg-green-100'; // Light green
      case 'livrée': // Livrée (Delivered)
        return 'bg-purple-50 hover:bg-purple-100'; // Light purple
      case 'retour': // Retour (Returned)
        return 'bg-red-50 hover:bg-red-100'; // Light red
      default:
        return 'bg-gray-50 hover:bg-gray-100'; // Default light gray
    }
  };

  if (loading) {
    return <div className='text-center py-10'>جاري التحميل...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className='text-center py-10'>
        <h1 className='text-3xl font-bold mb-6'>Gestion des Commandes</h1>
        <p className='text-gray-600 mb-4'>لا توجد طلبات</p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>Gestion des Commandes</h1>

      {/* Filter by Atelier */}
      <div className='mb-6'>
        <label className='text-lg font-medium mr-4'>Filtrer par Atelier:</label>
        <select
          value={selectedAtelier}
          onChange={(e) => setSelectedAtelier(e.target.value)}
          className='p-2 border rounded-lg'
        >
          <option value='Mo Neat'>Mo Neat</option>
          <option value='Courva'>Courva</option>
          <option value='Rayma'>Rayma</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b'>ID</th>
              <th className='py-2 px-4 border-b'>Client</th>
              <th className='py-2 px-4 border-b'>Contact</th>
              <th className='py-2 px-4 border-b'>Adresse</th>
              <th className='py-2 px-4 border-b'>Produits</th>
              <th className='py-2 px-4 border-b'>Total</th>
              <th className='py-2 px-4 border-b'>Statut</th>
              <th className='py-2 px-4 border-b'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={order.id || index}
                className={`${getRowBackgroundColor(order)} transition-colors`}
              >
                <td className='py-2 px-4 border-b text-center'>{order.id || `ORDER-${index + 1}`}</td>
                <td className='py-2 px-4 border-b'>
                  <div className='flex flex-col'>
                    <span>{order.client.firstName} {order.client.lastName}</span>
                    <span className='text-sm text-gray-500'>{order.client.wilaya}, {order.client.commune}</span>
                  </div>
                </td>
                <td className='py-2 px-4 border-b text-center'>{order.client.phone}</td>
                <td className='py-2 px-4 border-b text-center'>
                  {order.client.deliveryType === 'Stop Desk' 
                    ? order.client.stopDesk 
                    : order.client.address}
                </td>
                <td className='py-2 px-4 border-b'>
                  {order.products.map((product, index) => (
                    <div key={index} className='mb-2'>
                      <div className='font-medium'>{product.name}</div>
                      <div className='text-sm'>
                        Taille: {product.size} 
                        <div className='flex items-center gap-2'>
                          <p>Couleur:</p>
                          <div
                            className='w-4 h-4 rounded-full border border-gray-300'
                            style={{ backgroundColor: product.color }}
                          />
                        </div>  
                        Quantité: {product.quantity}
                      </div>
                      {product.width && <div className='text-sm'>Largeur: {product.width}</div>}
                      {product.height && <div className='text-sm'>Hauteur: {product.height}</div>}
                    </div>
                  ))}
                </td>
                <td className='py-2 px-4 border-b text-center'>{order.total} DA</td>
                <td className='py-2 px-4 border-b text-center'>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className='p-1 border rounded-lg bg-inherit'
                  >
                    <option value='en cours'>En cours</option>
                    <option value='en livraison'>En livraison</option>
                    <option value='terminée'>Terminée</option>
                    <option value='livrée'>Livrée</option>
                    <option value='retour'>Retour</option>
                  </select>
                </td>
                <td className='py-2 px-4 border-b text-center'>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className='text-blue-500 hover:text-blue-700 transition'
                  >
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;