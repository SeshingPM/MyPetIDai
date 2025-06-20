# Data Files for Breed, Medication, and Supplement Options

This document outlines the data files needed for the breed, medication, and supplement options that will be used in the dropdowns in the onboarding flow.

## Breed Data

```typescript
// src/data/pet-breeds.ts
export const dogBreeds = [
  "Labrador Retriever",
  "German Shepherd",
  "Golden Retriever",
  "French Bulldog",
  "Bulldog",
  "Poodle",
  "Beagle",
  "Rottweiler",
  "German Shorthaired Pointer",
  "Dachshund",
  "Pembroke Welsh Corgi",
  "Australian Shepherd",
  "Yorkshire Terrier",
  "Boxer",
  "Siberian Husky",
  "Cavalier King Charles Spaniel",
  "Great Dane",
  "Miniature Schnauzer",
  "Doberman Pinscher",
  "Shih Tzu",
  "Boston Terrier",
  "Bernese Mountain Dog",
  "Pomeranian",
  "Havanese",
  "Shetland Sheepdog",
  "Brittany",
  "English Springer Spaniel",
  "Chihuahua",
  "Cocker Spaniel",
  "Vizsla",
  "Pug",
  "Cane Corso",
  "Miniature American Shepherd",
  "Border Collie",
  "Mastiff",
  "Weimaraner",
  "Maltese",
  "Collie",
  "Basset Hound",
  "Newfoundland",
  "Rhodesian Ridgeback",
  "Belgian Malinois",
  "Shiba Inu",
  "West Highland White Terrier",
  "Bichon Frise",
  "Bloodhound",
  "Akita",
  "Chesapeake Bay Retriever",
  "St. Bernard",
  "Papillon",
  "Mixed Breed / Other"
];

export const catBreeds = [
  "Domestic Shorthair",
  "Domestic Longhair",
  "Siamese",
  "Maine Coon",
  "Persian",
  "Ragdoll",
  "Bengal",
  "Abyssinian",
  "British Shorthair",
  "Scottish Fold",
  "Sphynx",
  "Birman",
  "Devon Rex",
  "American Shorthair",
  "Oriental",
  "Norwegian Forest Cat",
  "Burmese",
  "Russian Blue",
  "Siberian",
  "Cornish Rex",
  "Tonkinese",
  "Exotic Shorthair",
  "Himalayan",
  "Bombay",
  "Balinese",
  "Turkish Angora",
  "Japanese Bobtail",
  "Manx",
  "Egyptian Mau",
  "Somali",
  "Savannah",
  "Ocicat",
  "Korat",
  "Chartreux",
  "Turkish Van",
  "Singapura",
  "Selkirk Rex",
  "Nebelung",
  "Snowshoe",
  "American Curl",
  "LaPerm",
  "Havana Brown",
  "Colorpoint Shorthair",
  "Munchkin",
  "American Wirehair",
  "Khao Manee",
  "Toyger",
  "European Burmese",
  "American Bobtail",
  "Mixed Breed / Other"
];
```

## Medication Data

```typescript
// src/data/pet-medications.ts
export const dogMedications = [
  "Heartworm Prevention",
  "Flea and Tick Prevention",
  "Antibiotics",
  "Pain Medication",
  "Anti-inflammatory",
  "Allergy Medication",
  "Anxiety Medication",
  "Arthritis Medication",
  "Ear Medication",
  "Eye Medication",
  "Diabetes Medication",
  "Heart Medication",
  "Seizure Medication",
  "Thyroid Medication",
  "Skin Medication",
  "Gastrointestinal Medication",
  "Behavioral Medication",
  "Dewormer",
  "Other"
];

export const catMedications = [
  "Flea and Tick Prevention",
  "Antibiotics",
  "Pain Medication",
  "Anti-inflammatory",
  "Allergy Medication",
  "Anxiety Medication",
  "Arthritis Medication",
  "Ear Medication",
  "Eye Medication",
  "Diabetes Medication",
  "Heart Medication",
  "Seizure Medication",
  "Thyroid Medication",
  "Skin Medication",
  "Gastrointestinal Medication",
  "Behavioral Medication",
  "Dewormer",
  "Hairball Prevention",
  "Urinary Tract Medication",
  "Other"
];
```

## Supplement Data

```typescript
// src/data/pet-supplements.ts
export const dogSupplements = [
  "Multivitamin",
  "Joint Support (Glucosamine/Chondroitin)",
  "Omega-3 Fatty Acids",
  "Probiotics",
  "Digestive Enzymes",
  "Calming Supplements",
  "Skin and Coat Supplements",
  "Immune Support",
  "Hip and Joint Supplements",
  "Senior Support",
  "Dental Supplements",
  "Eye Health",
  "Antioxidants",
  "Weight Management",
  "Allergy Support",
  "Urinary Health",
  "Liver Support",
  "Heart Health",
  "Other"
];

export const catSupplements = [
  "Multivitamin",
  "Joint Support",
  "Omega-3 Fatty Acids",
  "Probiotics",
  "Digestive Enzymes",
  "Calming Supplements",
  "Skin and Coat Supplements",
  "Immune Support",
  "Senior Support",
  "Dental Supplements",
  "Eye Health",
  "Antioxidants",
  "Weight Management",
  "Hairball Control",
  "Urinary Health",
  "Liver Support",
  "Heart Health",
  "Other"
];
```

These data files will be used to populate the dropdown menus in the onboarding flow. The dropdowns will conditionally render based on the animal type selected by the user.
