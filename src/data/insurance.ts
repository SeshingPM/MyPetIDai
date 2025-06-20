/**
 * Pet Insurance Providers Dataset
 * Common pet insurance companies in the US market
 */

export const PET_INSURANCE_PROVIDERS = [
  'Healthy Paws',
  'Petplan',
  'Embrace Pet Insurance',
  'ASPCA Pet Health Insurance',
  'Nationwide Pet Insurance',
  'Trupanion',
  'Figo Pet Insurance',
  'PetFirst Pet Insurance',
  'AKC Pet Insurance',
  'Pets Best',
  'Lemonade Pet Insurance',
  'Spot Pet Insurance',
  'Pumpkin Pet Insurance',
  'MetLife Pet Insurance',
  'Prudent Pet Insurance',
  'Fetch by The Dodo',
  'Wagmo',
  'USAA Pet Insurance',
  'Hartville Pet Insurance',
  'PetPartners',
  'PetSure',
  'Banfield Pet Hospital',
  'VCA Animal Hospitals',
  'BluePearl Pet Insurance',
  'Other',
  'None'
] as const;

export type PetInsuranceProvider = typeof PET_INSURANCE_PROVIDERS[number];
