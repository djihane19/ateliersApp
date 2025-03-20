import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../../../supabaseClient'; // Import Supabase client
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders (no session_id filter)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*'); // Fetch all orders (no session_id filter)

        if (error) {
          throw error;
        }

        // Sort orders by ID in descending order
        const sortedData = data.sort((a, b) => b.id - a.id);

        setOrders(sortedData || []);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*'); // Fetch all products

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error.message);
        setProducts([]);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts();
  }, []);

  // Count orders by atelier
  const countOrdersByAtelier = (atelier) => {
    return orders.filter((order) => order.atelier === atelier).length;
  };

  // Calculate revenue by atelier (only for orders with status "terminée")
  const calculateRevenueByAtelier = (atelier) => {
    return orders
      .filter((order) => order.atelier === atelier && order.status === 'terminée')
      .reduce((total, order) => total + order.total, 0);
  };

  // Count products by atelier
  const countProductsByAtelier = (atelier) => {
    return products.filter((product) => product.atelier === atelier).length;
  };

  // Get monthly sales data for each atelier
  const getMonthlySalesData = () => {
    const monthlySales = {};

    orders.forEach((order) => {
      if (order.status === 'terminée') {
        const month = new Date(order.client.deliveryDate).getMonth();
        const atelier = order.atelier;

        if (!monthlySales[month]) {
          monthlySales[month] = { Courva: 0, Rayma: 0 };
        }

        monthlySales[month][atelier] += order.total;
      }
    });

    return Array.from({ length: 12 }, (_, i) => ({
      name: new Date(2025, i).toLocaleString('default', { month: 'short' }),
      Courva: monthlySales[i]?.Courva || 0,
      Rayma: monthlySales[i]?.Rayma || 0,
    }));
  };

  // Get recent orders (last 5 orders)
  const recentOrders = orders.slice(0, 5);

  // Get top products (sorted by revenue)
  const topProducts = products
    .map((product) => {
      const productOrders = orders.filter((order) =>
        order.products.some((p) => p.name === product.name)
      );
      const unitsSold = productOrders.reduce((total, order) => {
        const productInOrder = order.products.find((p) => p.name === product.name);
        return total + (productInOrder?.quantity || 0);
      }, 0);
      const revenue = productOrders.reduce((total, order) => {
        const productInOrder = order.products.find((p) => p.name === product.name);
        return total + (productInOrder?.price * productInOrder?.quantity || 0);
      }, 0);

      return {
        name: product.name,
        unitsSold,
        revenue,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  if (loading) {
    return <div className='text-center py-10'>جاري التحميل...</div>;
  }

  return (
    <div className='p-4 sm:p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>Tableau de Bord</h1>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <div className='bg-white p-4 rounded-xl shadow-md border border-gray-100'>
          <h2 className='text-lg font-semibold text-gray-600'>Commandes Courva</h2>
          <p className='text-2xl font-bold text-blue-600'>{countOrdersByAtelier('Courva')}</p>
          <p className='text-sm text-gray-500 mt-2'>
            Revenu: {calculateRevenueByAtelier('Courva').toLocaleString()} DA
          </p>
        </div>

        <div className='bg-white p-4 rounded-xl shadow-md border border-gray-100'>
          <h2 className='text-lg font-semibold text-gray-600'>Commandes Rayma</h2>
          <p className='text-2xl font-bold text-green-600'>{countOrdersByAtelier('Rayma')}</p>
          <p className='text-sm text-gray-500 mt-2'>
            Revenu: {calculateRevenueByAtelier('Rayma').toLocaleString()} DA
          </p>
        </div>

        <div className='bg-white p-4 rounded-xl shadow-md border border-gray-100'>
          <h2 className='text-lg font-semibold text-gray-600'>Produits Courva</h2>
          <p className='text-2xl font-bold text-purple-600'>{countProductsByAtelier('Courva')}</p>
        </div>

        <div className='bg-white p-4 rounded-xl shadow-md border border-gray-100'>
          <h2 className='text-lg font-semibold text-gray-600'>Produits Rayma</h2>
          <p className='text-2xl font-bold text-orange-600'>{countProductsByAtelier('Rayma')}</p>
        </div>
      </div>

      {/* Sales Chart */}
      <div className='bg-white p-4 sm:p-6 rounded-xl shadow-md mb-8 border border-gray-100'>
        <h2 className='text-lg font-semibold mb-4 text-gray-700'>Ventes Mensuelles</h2>
        <div className='w-full h-[150px] sm:h-[300px]'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getMonthlySalesData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#9ca3af' }}
              />
              <YAxis
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Bar
                dataKey="Courva"
                fill="#4b82f6"
                radius={[4, 4, 0, 0]}
                name="Courva (DA)"
              />
              <Bar
                dataKey="Rayma"
                fill="#2fb981"
                radius={[4, 4, 0, 0]}
                name="Rayma (DA)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className='bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100'>
        <h2 className='text-lg font-semibold mb-4 text-gray-700'>Commandes Récentes</h2>
        <div className='overflow-x-auto'>
          {/* Desktop Table */}
          <table className='w-full hidden sm:table'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>N° Commande</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Client</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Date</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Atelier</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Statut</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className='border-t border-gray-100 hover:bg-gray-50'>
                  <td className='px-4 py-3 text-sm text-gray-700'>{order.id}</td>
                  <td className='px-4 py-3 text-sm text-gray-700'>
                    {order.client.firstName} {order.client.lastName}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-700'>
                    {new Date(order.client.deliveryDate).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-700'>{order.atelier}</td>
                  <td className='px-4 py-3'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'terminée'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'en cours'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-sm font-medium text-gray-700'>
                    {order.total.toLocaleString()} DA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className='sm:hidden space-y-4'>
            {recentOrders.map((order) => (
              <div key={order.id} className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-gray-700'>N° Commande: {order.id}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'terminée'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'en cours'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className='mt-2 text-sm text-gray-600'>
                  <p>{order.client.firstName} {order.client.lastName}</p>
                  <p>{new Date(order.client.deliveryDate).toLocaleDateString()}</p>
                  <p>{order.atelier}</p>
                  <p className='font-medium'>{order.total.toLocaleString()} DA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Link
          to='/admin/orders'
          className='inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium'
        >
          Voir toutes les commandes →
        </Link>
      </div>

      {/* Top Products */}
      <div className='bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100'>
        <h2 className='text-lg font-semibold mb-4 text-gray-700'>Produits Populaires</h2>
        <div className='overflow-x-auto'>
          {/* Desktop Table */}
          <table className='w-full hidden sm:table'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Produit</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Unités Vendues</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Revenu</th>
                <th className='px-4 py-3 text-left text-sm font-semibold text-gray-600'>Atelier</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.name} className='border-t border-gray-100 hover:bg-gray-50'>
                  <td className='px-4 py-3 text-sm text-gray-700'>{product.name}</td>
                  <td className='px-4 py-3 text-sm text-gray-700'>{product.unitsSold}</td>
                  <td className='px-4 py-3 text-sm text-gray-700'>
                    {product.revenue.toLocaleString()} DA
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-700'>
                    {products.find((p) => p.name === product.name)?.atelier || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className='sm:hidden space-y-4'>
            {topProducts.map((product) => (
              <div key={product.name} className='bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-gray-700'>{product.name}</span>
                  <span className='text-sm text-gray-600'>{product.unitsSold} unités</span>
                </div>
                <div className='mt-2 text-sm text-gray-600'>
                  <p>Revenu: {product.revenue.toLocaleString()} DA</p>
                  <p>Atelier: {products.find((p) => p.name === product.name)?.atelier || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='bg-white p-6 rounded-xl shadow-md border border-gray-100'>
        <h2 className='text-lg font-semibold mb-4 text-gray-700'>Actions Rapides</h2>
        <div className='flex flex-wrap gap-4'>
          <Link
            to='/admin/products/add'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Ajouter Produit
          </Link>

          <Link
            to='/admin/orders'
            className='bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2'
          >
            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Gérer Commandes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;  