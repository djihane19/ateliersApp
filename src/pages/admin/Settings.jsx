import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../supabaseClient'; // Import Supabase client

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Ensure user is authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin/login'); // Redirect to login if not authenticated
      }
    };

    checkSession();
  }, [navigate]);

  const handleChangePassword = async () => {
    setLoading(true); // Start loading
    setError('');
    setSuccess('');

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      // Reauthenticate the user with their current password
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: supabase.auth.user().email, // Get the user's email
        password: currentPassword, // Use the current password
      });

      if (reauthError) {
        throw new Error('Mot de passe actuel incorrect.');
      }

      // Update the user's password
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // Success message
      setSuccess('Mot de passe mis à jour avec succès!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error.message);
      setError(error.message || 'Une erreur s\'est produite lors de la mise à jour du mot de passe.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
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
          disabled={loading}
          className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50'
        >
          {loading ? 'Chargement...' : 'Changer le mot de passe'}
        </button>
        <button
          onClick={() => navigate('/admin/orders')}
          className='bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition'
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default Settings;