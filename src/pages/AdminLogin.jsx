import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import supabase from '../../supabaseClient'; // Import Supabase client

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAdminLoggedIn } = useContext(AdminContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        throw supabaseError;
      }

      if (data.user) {
        setIsAdminLoggedIn(true); // Set admin login state to true
        navigate('/admin/dashboard'); // Redirect to admin dashboard
      }
    } catch (error) {
      setError('Identifiants incorrects');
      console.error('Error logging in:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Connexion Admin</h1>
        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full p-2 border rounded-lg mt-1'
              required
            />
          </div>
          <div className='mb-6'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Mot de passe
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-2 border rounded-lg mt-1'
              required
            />
          </div>
          {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50'
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};
  
export default AdminLogin;   