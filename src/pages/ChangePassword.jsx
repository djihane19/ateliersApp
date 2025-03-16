import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import supabase from '../../supabaseClient'; // Import Supabase client

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  // Check if the user is authenticated and fetch their email
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login'); // Redirect to login if not authenticated
      } else {
        setUserEmail(session.user.email); // Set the user's email
      }
    };

    checkSession();
  }, [navigate]);

  const handleChangePassword = async () => {
    // Validate inputs
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      // Re-authenticate the user with their current password
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail, // Use the user's email
        password: currentPassword,
      });

      if (authError) {
        throw authError;
      }

      // Update the user's password
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      // Success message
      setSuccess('Mot de passe mis à jour avec succès!');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error.message);
      setError('Une erreur est survenue lors de la mise à jour du mot de passe.');
    }
  };

  return (
    <div className='flex'>
      <AdminSidebar />
      <div className='p-6'>
        <h1 className='text-3xl font-bold mb-6'>Changer le mot de passe</h1>

        {/* Current Password */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2'>Mot de passe actuel</label>
          <input
            type='password'
            placeholder='Mot de passe actuel'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className='w-full p-2 border rounded-lg'
          />
        </div>

        {/* New Password */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2'>Nouveau mot de passe</label>
          <input
            type='password'
            placeholder='Nouveau mot de passe'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className='w-full p-2 border rounded-lg'
          />
        </div>

        {/* Confirm New Password */}
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-2'>Confirmer le nouveau mot de passe</label>
          <input
            type='password'
            placeholder='Confirmer le nouveau mot de passe'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full p-2 border rounded-lg'
          />
        </div>

        {/* Error and Success Messages */}
        {error && <p className='text-red-500 mb-4'>{error}</p>}
        {success && <p className='text-green-500 mb-4'>{success}</p>}

        {/* Buttons */}
        <div className='flex gap-4'>
          <button
            onClick={handleChangePassword}
            className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition'
          >
            Changer le mot de passe
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className='bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition'
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;