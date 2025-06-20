/**
 * Pet treat options for dogs and cats
 * Organized by pet type for conditional rendering
 */

export const DOG_TREATS = [
  "I make my own",
  // Training Treats
  "Blue Buffalo Training Treats",
  "Fruitables Crunchy",
  "Plato Pet Treats",
  "PureBites",
  "PureBites Freeze Dried",
  "Stella & Chewy's Freeze-Dried",
  "Wellness Core Pure Rewards",
  "Zuke's Mini Naturals",
  
  // Dental Chews
  "Blue Buffalo Dental Bones",
  "DenTees",
  "Dentastix",
  "Greenies Dental Chews",
  "Himalayan Pet Supply",
  "Merrick Fresh Kisses",
  "Milk-Bone MaroSnacks",
  "OraVet Dental Hygiene Chews",
  "Pedigree Dentastix",
  "Purina Dentalife",
  "Wet Noses",
  "Whimzees Natural Dental Chews",
  
  // Biscuits & Cookies
  "Blue Buffalo Health Bars",
  "Buddy Biscuits",
  "Claudia's Canine Bakery",
  "Dog-O's",
  "Hill's Treats",
  "Merrick Oven Baked",
  "Milk-Bone Original",
  "Old Mother Hubbard Crunchy",
  "Pinchers",
  "Rileys Organics",
  "Sugar and Spice",
  "Three Dog Bakery",
  "Wellness Crunchy Puppy Bites",
  "Zuke's Crunchy Naturals",
  
  // Jerky & Meat Treats
  "Blue Buffalo Wilderness Jerky",
  "Country Archer Jerky Co.",
  "Crumps' Naturals",
  "DelRay",
  "Dogswell",
  "Plato Salmon Strips",
  "PureBites Beef Liver",
  "Stella & Chewy's Carnivore Crunch",
  "Wellness Core Pure Rewards Jerky",
  "Zuke's Jerky Naturals",
  
  // Soft/Chewy Treats
  "Blue Buffalo Bursts",
  "Fat Cat",
  "Fringe",
  "Fruitables Skinny Minis",
  "Inaba Churu",
  "Merrick Power Bites",
  "Old Mother Hubbard Soft & Chewy",
  "Plato Thinkers",
  "Wellness Soft Puppy Bites",
  "Zuke's Mini Naturals",
  
  // Natural/Single Ingredient
  "Antlers",
  "Benebone",
  "Bully Sticks",
  "Dehydrated Chicken Breast",
  "Freeze-Dried Liver",
  "Gaines Family Farmstead",
  "Healthfuls",
  "Himalayan Pet Supply",
  "Loving Pets",
  "Raw Bones",
  "Redbarn",
  "Spot Farms",
  "Stud Muffins",
  "Sweet Potato Chews",
  "Yak Chews",
  "Zoe",
  "Zuke's Natural Purrz",
  
  // Specialty/Upcycled Treats
  "Disney Table Scraps"
];

export const CAT_TREATS = [
  "I make my own",
  // Crunchy Treats
  "Blue Buffalo Bursts",
  "Blue Buffalo Wilderness",
  "Friskies Party Mix",
  "Greenies Feline",
  "Meow Mix Irresistibles",
  "Purina Fancy Feast Crunchy",
  "Temptations",
  "Temptations Classic",
  "Wellness Kittles",
  
  // Soft/Chewy Treats
  "Friskies Pull 'n Play",
  "Purina Fancy Feast Delights",
  "Sheba Meaty Tender Sticks",
  "Temptations Creamy Purée",
  "Wellness Kittles Soft",
  
  // Freeze-Dried Treats
  "Orijen Freeze-Dried",
  "Primal Freeze-Dried",
  "PureBites Freeze Dried",
  "Stella & Chewy's Freeze-Dried",
  "Wellness Core Pure Rewards",
  "Ziwi Peak Air-Dried",
  
  // Dental Treats
  "Blue Buffalo Dental Bones",
  "Feline Greenies SmartBites",
  "Greenies Feline Dental Treats",
  "Purina DentaLife",
  "Wellness Kittles Dental",
  
  // Natural/Single Ingredient
  "Catnip Treats",
  "Dehydrated Tuna",
  "Freeze-Dried Chicken",
  "Freeze-Dried Fish",
  "Freeze-Dried Salmon",
  "Silvervine Sticks",
  
  // Liquid/Paste Treats
  "Delectables Squeeze Up",
  "Hartz Delectables Lickable",
  "Inaba Churu Purée",
  "Temptations Creamy Purée",
  "Wellness Core Lickables",
  
  // Interactive/Puzzle Treats
  "Kong Cat Treats",
  "Petstages Catnip Treats",
  "SmartyKat Skitter Critters",
  "Yeowww! Catnip Treats"
];

// Combined export for easy access
export const TREATS_BY_PET_TYPE = {
  dog: DOG_TREATS,
  cat: CAT_TREATS
} as const;
