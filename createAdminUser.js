import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  'https://vvjmxudytkmovupvtjfb.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2am14dWR5dGttb3Z1cHZ0amZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5Nzg2MTYsImV4cCI6MjA1NzU1NDYxNn0.LVp1X6ZjTsONXTki3leJG03x6DGTKc6IImgLrDMWo2c'; // Replace with your Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);

const createAdminUser = async () => {
  const email = 'kd_torchane@esi.dz'; // Replace with the admin email
  const password = 'RinoAdmin'; // Replace with a secure password

  // Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Error signing up:', authError.message);
    return;
  }

  // Add the user to the profiles table with is_admin = TRUE
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert([{ id: authData.user.id, is_admin: true }]);

  if (profileError) {
    console.error('Error creating profile:', profileError.message);
    return;
  }

  console.log('Admin user created successfully:', authData.user);
};

createAdminUser();