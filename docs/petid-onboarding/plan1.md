# MyPetID Multi-Step Onboarding Flow Implementation Plan

## Overview

This document outlines the implementation plan for the MyPetID multi-step onboarding flow. The new flow will capture detailed pet and owner data, store it in a scalable and ML-ready structure, and generate a globally unique Pet ID for each pet.

## Table of Contents

1. [Requirements](#requirements)
2. [Database Schema Changes](#database-schema-changes)
3. [Pet ID Generation Logic](#pet-id-generation-logic)
4. [Implementation Timeline](#implementation-timeline)

## Requirements

### Functional Requirements

1. **Multi-Step Onboarding Flow**:
   - Progressive 4-page flow with a progress bar
   - Ability to navigate back and forth between steps
   - Data validation at each step

2. **Data Collection**:
   - **Page 1**: Pet's Name, Animal type (dog/cat), Pet's breed, Birthday or adoption date, Gender
   - **Page 2**: Owner's Name, Zip, Phone (with optional SMS alerts)
   - **Page 3**: Food type, Pet insurance status (with provider if yes), Medications/prescriptions (with provider if yes), Supplements (list), Treats
   - **Page 4**: Email and password for account creation

3. **Pet ID Generation**:
   - Format: DM-20-0420
     - D/C: Pet type (Dog/Cat)
     - M/F: Gender (Male/Female)
     - 20: Last two digits of birth/adoption year
     - 0420: Random 4-digit number (must be unique)
   - IDs must never collide
   - Generated after user completes the onboarding flow

4. **Data Storage**:
   - Normalized data structure for future AI/ML targeting and analytics
   - Secure storage with proper access controls
   - Relationships between pets, owners, and related data

### Non-Functional Requirements

1. **Performance**:
   - Fast page transitions
   - Responsive UI for all device sizes
   - Efficient database queries

2. **Security**:
   - Data validation and sanitization
   - Row-level security policies
   - Secure authentication

3. **Usability**:
   - Clear progress indication
   - Intuitive form design
   - Helpful error messages

## Database Schema Changes

### Modify Existing Migration Files

Since the databases haven't been created yet, we'll modify the existing migration files to include all the required fields and tables from the start.

#### 1. Update `20250322000001_pets_table.sql`

```sql
-- Migration: 20250322000001_pets_table.sql
-- Description: Creates the pets table and sets up RLS policies

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('dog', 'cat')) NOT NULL,
  breed TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
  birth_or_adoption_date DATE NOT NULL,
  pet_identifier TEXT UNIQUE NOT NULL,
  photo_url TEXT,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on pet_identifier for faster lookups
CREATE INDEX idx_pets_pet_identifier ON pets(pet_identifier);

-- Enable RLS on pets table
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pets table
CREATE POLICY "Users can view their own pets" 
  ON public.pets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pets" 
  ON public.pets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets" 
  ON public.pets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets" 
  ON public.pets 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

#### 2. Remove `20250520000001_add_pet_birth_date.sql`

Since we're including `birth_or_adoption_date` in the initial pets table creation, we should remove or comment out this migration to avoid conflicts.

#### 3. Create `20250322000012_pet_profiles_table.sql`

```sql
-- Migration: 20250322000012_pet_profiles_table.sql
-- Description: Creates the pet_profiles table for storing pet lifestyle information

CREATE TABLE public.pet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  food_type TEXT,
  treats TEXT,
  has_insurance BOOLEAN DEFAULT false,
  insurance_provider TEXT,
  on_medications BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on pet_profiles table
ALTER TABLE public.pet_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_profiles table
CREATE POLICY "Users can view their own pet profiles" 
  ON public.pet_profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_profiles.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own pet profiles" 
  ON public.pet_profiles 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_profiles.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pet profiles" 
  ON public.pet_profiles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_profiles.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own pet profiles" 
  ON public.pet_profiles 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_profiles.pet_id
      AND pets.user_id = auth.uid()
    )
  );
```

#### 4. Create `20250322000013_pet_supplements_table.sql`

```sql
-- Migration: 20250322000013_pet_supplements_table.sql
-- Description: Creates the pet_supplements table for storing pet supplement information

CREATE TABLE public.pet_supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  supplement_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on pet_supplements table
ALTER TABLE public.pet_supplements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_supplements table
CREATE POLICY "Users can view their own pet supplements" 
  ON public.pet_supplements 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_supplements.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own pet supplements" 
  ON public.pet_supplements 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_supplements.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pet supplements" 
  ON public.pet_supplements 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_supplements.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own pet supplements" 
  ON public.pet_supplements 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_supplements.pet_id
      AND pets.user_id = auth.uid()
    )
  );
```

#### 5. Create `20250322000014_pet_medications_table.sql`

```sql
-- Migration: 20250322000014_pet_medications_table.sql
-- Description: Creates the pet_medications table for storing pet medication information

CREATE TABLE public.pet_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  provider TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on pet_medications table
ALTER TABLE public.pet_medications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_medications table
CREATE POLICY "Users can view their own pet medications" 
  ON public.pet_medications 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medications.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own pet medications" 
  ON public.pet_medications 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medications.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pet medications" 
  ON public.pet_medications 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medications.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own pet medications" 
  ON public.pet_medications 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medications.pet_id
      AND pets.user_id = auth.uid()
    )
  );
```

#### 6. Create `20250322000015_owner_profiles_table.sql`

```sql
-- Migration: 20250322000015_owner_profiles_table.sql
-- Description: Creates the owner_profiles table for storing owner information

CREATE TABLE public.owner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  zip_code TEXT,
  phone TEXT,
  sms_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on owner_profiles table
ALTER TABLE public.owner_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for owner_profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.owner_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
  ON public.owner_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.owner_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
  ON public.owner_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);
```

## Pet ID Generation Logic

### 7. Create `20250322000016_pet_id_generation.sql`

```sql
-- Migration: 20250322000016_pet_id_generation.sql
-- Description: Creates a function to generate unique pet IDs

-- Function to generate a unique pet ID
CREATE OR REPLACE FUNCTION generate_unique_pet_id(
  p_pet_type TEXT,
  p_gender TEXT,
  p_birth_date DATE
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_type_char CHAR(1);
  v_gender_char CHAR(1);
  v_year_code CHAR(2);
  v_random_code CHAR(4);
  v_pet_id TEXT;
  v_is_unique BOOLEAN := FALSE;
  v_attempts INTEGER := 0;
  v_max_attempts INTEGER := 10;
BEGIN
  -- Determine type character
  v_type_char := CASE WHEN p_pet_type = 'dog' THEN 'D' ELSE 'C' END;
  
  -- Determine gender character
  v_gender_char := CASE WHEN p_gender = 'male' THEN 'M' ELSE 'F' END;
  
  -- Extract year code (last 2 digits of year)
  v_year_code := RIGHT(EXTRACT(YEAR FROM p_birth_date)::TEXT, 2);
  
  -- Try to generate a unique ID (with retry logic)
  WHILE NOT v_is_unique AND v_attempts < v_max_attempts LOOP
    -- Generate random 4-digit code
    v_random_code := LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
    
    -- Construct pet ID
    v_pet_id := v_type_char || v_gender_char || '-' || v_year_code || '-' || v_random_code;
    
    -- Check if this ID already exists
    PERFORM 1 FROM pets WHERE pet_identifier = v_pet_id;
    
    -- If no rows returned, the ID is unique
    v_is_unique := NOT FOUND;
    
    v_attempts := v_attempts + 1;
  END LOOP;
  
  -- If we couldn't generate a unique ID after max attempts, raise an error
  IF NOT v_is_unique THEN
    RAISE EXCEPTION 'Could not generate a unique pet ID after % attempts', v_max_attempts;
  END IF;
  
  RETURN v_pet_id;
END;
$$;

-- Create a trigger to automatically generate pet_identifier if not provided
CREATE OR REPLACE FUNCTION set_pet_identifier()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if pet_identifier is NULL or empty
  IF NEW.pet_identifier IS NULL OR NEW.pet_identifier = '' THEN
    NEW.pet_identifier := generate_unique_pet_id(NEW.type, NEW.gender, NEW.birth_or_adoption_date);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_pet_insert
BEFORE INSERT ON pets
FOR EACH ROW
EXECUTE FUNCTION set_pet_identifier();
```

## Implementation Timeline

### Phase 1: Database Setup (Days 1-2)
- Create/modify migration files
- Test migrations in development environment
- Verify data integrity and constraints

### Phase 2: Frontend Components (Days 3-7)
- Create multi-step form components
- Implement state management
- Design UI with progress indicators
- Add validation

### Phase 3: Backend Implementation (Days 8-10)
- Implement Pet ID generation
- Create API endpoints
- Set up data validation
- Implement error handling

### Phase 4: Integration and Testing (Days 11-14)
- Connect frontend and backend
- Test the complete flow
- Verify data integrity
- Test Pet ID uniqueness

### Phase 5: Deployment and Monitoring (Day 15)
- Deploy to production
- Monitor for issues
- Gather user feedback
