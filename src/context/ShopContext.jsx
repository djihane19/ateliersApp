import React, { createContext, useState, useEffect } from "react";
import feeData from '../data/fee.json';
import supabase from '../../supabaseClient'; // Import Supabase client
import { getOrCreateUserSessionId } from '../utils/userSession'; // Import session ID utility

export const ShopContext = createContext();  

const ShopContextProvider = (props) => {
  const currency = 'DA';

  // State for the cart
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); // State for products
  const [cartCount, setCartCount] = useState(0); // Total number of items in the cart
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);  
  const [orders, setOrders] = useState([]); // State to store orders
  const [sessionId, setSessionId] = useState(getOrCreateUserSessionId()); // Add session_id state

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products') // Replace 'products' with your table name
          .select('*');

        if (error) {
          throw error;
        }

        setProducts(data || []); // Ensure data is not null
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  // Fetch orders from Supabase for the current session
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders') // Replace 'orders' with your table name
          .select('*')
          .eq('session_id', sessionId); // Filter orders by session_id

        if (error) {
          throw error;
        }

        setOrders(data || []); // Ensure data is not null
      } catch (error) {
        console.error('Error fetching orders:', error.message);
      }
    };

    fetchOrders();
  }, [sessionId]); // Re-fetch orders when session_id changes

  // Function to add a new product
  const addProduct = async (newProduct) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select(); // Return the inserted data

      if (error) {
        throw error;
      }

      setProducts([...products, data[0]]); // Add the new product to the local state
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  // Function to update an existing product
  const updateProduct = async (productId, updatedProduct) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', productId) // Filter by product ID
        .select(); // Return the updated data

      if (error) {
        throw error;
      }

      setProducts(products.map(p => 
        p.id === productId ? { ...p, ...data[0] } : p
      )); // Update the product in the local state
    } catch (error) {
      console.error('Error updating product:', error.message);
    }
  };

  // Function to delete a product
  const deleteProduct = async (productId) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId); // Filter by product ID

      if (error) {
        throw error;
      }

      setProducts(products.filter(p => p.id !== productId)); // Remove the product from the local state
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  // Function to add an item to the cart
  const addToCart = (product) => {
    // Generate unique ID for cart items
    const uniqueId = `${product.id}-${product.selectedSize}-${product.selectedColor}-${product.selectedWidth || ''}-${product.selectedHeight || ''}`;

    const existingProduct = cart.find((item) => item.uniqueId === uniqueId);

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: product.quantity,
        uniqueId: uniqueId 
      }]);
    }
    setCartCount(cartCount + product.quantity);
  };

  // Function to remove an item from the cart
  const removeFromCart = (uniqueId) => {
    const removedProduct = cart.find((item) => item.uniqueId === uniqueId);
    if (removedProduct) {
      const updatedCart = cart.filter((item) => item.uniqueId !== uniqueId);
      setCart(updatedCart);
      setCartCount(cartCount - removedProduct.quantity);
    }
  };

  // Function to get delivery fee based on Wilaya and delivery type
  const getDeliveryFee = (wilayaCode, deliveryType) => {
    // Convert wilayaCode (e.g., "01") to a number (e.g., 1)
    const wilayaNumber = parseInt(wilayaCode, 10);
  
    // Find the fee data for the selected wilaya by its number (N°)
    const wilayaFee = feeData["Tarifs de Livraison"]["Prix de livraison pour l'échange"].find(
      (item) => item["N°"] === wilayaNumber
    );
  
    if (!wilayaFee) {
      console.error(`Wilaya with code "${wilayaCode}" (number: ${wilayaNumber}) not found in fee data.`);
      return 0; // Default to 0 if Wilaya is not found
    }
  
    // Extract the fee based on delivery type
    const feeString = deliveryType === 'Domicile'
      ? wilayaFee["PRIX A DOMICILE"]
      : wilayaFee["PRIX STOPDESK"];
  
    // Parse the fee value (remove " DA" and convert to number)
    return parseInt(feeString.replace(' DA', ''), 10);
  };

  // Function to calculate the total of the cart
  const calculateTotal = (wilaya, deliveryType) => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = getDeliveryFee(wilaya, deliveryType);
    return subtotal + deliveryFee;
  };

  // Function to reset the cart
  const resetCart = () => {
    setCart([]);
    setCartCount(0);
  };

  // Function to add an order
  const addOrder = async (order) => {
    try {
      const deliveryFee = getDeliveryFee(order.client.wilaya, order.client.deliveryType);
      const subtotal = order.products.reduce((total, product) => total + product.price * product.quantity, 0);
      const total = subtotal + deliveryFee;

      const { data, error } = await supabase
        .from('orders')
        .insert([{ ...order, session_id: sessionId, deliveryFee, total }]) // Include session_id
        .select(); // Return the inserted data

      if (error) {
        throw error;
      }

      setOrders([...orders, data[0]]); // Add the new order to the local state

      // Remove the ordered products from the cart
      const updatedCart = cart.filter(item => !order.products.some(product => product.uniqueId === item.uniqueId));
      setCart(updatedCart);
      setCartCount(updatedCart.reduce((count, item) => count + item.quantity, 0));
    } catch (error) {
      console.error('Error adding order:', error.message);
    }
  };

  // Function to update order status
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

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, ...data[0] } : order
      )); // Update the order in the local state
    } catch (error) {
      console.error('Error updating order status:', error.message);
    }
  };

  // Add these calculation functions
  const countOrdersByAtelier = (atelier) => {
    return orders.filter(order => order.atelier === atelier).length;
  };

  const countProductsByAtelier = (atelier) => {
    return products.filter(product => product.atelier === atelier).length;
  };

  const calculateRevenueByAtelier = (atelier) => {
    return orders
      .filter(order => order.atelier === atelier && order.status === 'terminée')
      .reduce((total, order) => total + order.total, 0);
  };

  const getMonthlySalesData = () => {
    // Implement your actual sales data calculation based on orders
    const monthlySales = {};
    orders.forEach(order => {
      if(order.status === 'terminée') {
        const month = new Date(order.client.deliveryDate).getMonth();
        monthlySales[month] = (monthlySales[month] || 0) + order.total;
      }
    });
    
    return Array.from({length: 12}, (_, i) => ({
      name: new Date(2025, i).toLocaleString('default', {month: 'short'}),
      sales: monthlySales[i] || 0
    }));
  };

  // Shared values
  const value = {
    sessionId, // Expose session_id
    products,
    currency,
    cart,
    cartCount,
    addToCart,
    removeFromCart,
    calculateTotal,
    isAdminLoggedIn,  
    setIsAdminLoggedIn,
    orders,
    addOrder,
    addProduct,  
    updateProduct,
    deleteProduct,  
    getDeliveryFee,
    updateOrderStatus,

    countOrdersByAtelier,
    countProductsByAtelier,
    calculateRevenueByAtelier,
    getMonthlySalesData,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};     

export default ShopContextProvider;