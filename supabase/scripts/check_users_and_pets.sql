-- Check users and pets tables
DO $$
DECLARE
  user_record RECORD;
  pet_record RECORD;
BEGIN
  -- Print users
  RAISE NOTICE 'Checking auth.users table:';
  FOR user_record IN SELECT id, email, last_sign_in_at FROM auth.users LIMIT 10
  LOOP
    RAISE NOTICE 'User ID: %, Email: %, Last Sign In: %', 
      user_record.id, 
      user_record.email, 
      user_record.last_sign_in_at;
  END LOOP;
  
  -- Print pets
  RAISE NOTICE 'Checking public.pets table:';
  FOR pet_record IN SELECT id, user_id, name, breed FROM public.pets LIMIT 10
  LOOP
    RAISE NOTICE 'Pet ID: %, User ID: %, Name: %, Breed: %', 
      pet_record.id, 
      pet_record.user_id, 
      pet_record.name, 
      pet_record.breed;
  END LOOP;
END $$;