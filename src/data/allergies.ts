/**
 * Common pet allergies for dogs and cats
 * Organized by category for easy selection
 */

export const COMMON_ALLERGIES = [
  // Food Allergies - Proteins
  "Beef",
  "Chicken",
  "Pork",
  "Lamb",
  "Fish",
  "Salmon",
  "Turkey",
  "Duck",
  "Venison",
  "Rabbit",
  "Eggs",
  "Dairy/Milk",
  
  // Food Allergies - Grains & Carbs
  "Wheat",
  "Corn",
  "Soy",
  "Rice",
  "Barley",
  "Oats",
  "Gluten",
  
  // Food Allergies - Other
  "Peanuts",
  "Tree Nuts",
  "Artificial Colors",
  "Artificial Preservatives",
  "BHA/BHT",
  "Ethoxyquin",
  
  // Environmental Allergies
  "Pollen",
  "Grass",
  "Dust Mites",
  "Mold",
  "Flea Saliva",
  "Cigarette Smoke",
  "Perfumes/Fragrances",
  "Cleaning Products",
  
  // Contact Allergies
  "Latex",
  "Wool",
  "Synthetic Fabrics",
  "Plastic",
  "Rubber",
  "Certain Shampoos",
  "Flea/Tick Products",
  
  // Seasonal Allergies
  "Spring Pollen",
  "Fall Leaves",
  "Ragweed",
  "Tree Pollen",
  "Grass Pollen",
  
  // Other Common Allergens
  "Insect Stings",
  "Vaccines (rare)",
  "Medications",
  "Topical Treatments"
];

// For both dogs and cats, allergies are generally the same
export const ALLERGIES_BY_PET_TYPE = {
  dog: COMMON_ALLERGIES,
  cat: COMMON_ALLERGIES
} as const;
