
export interface ComparisonValue {
  value: string;
  description?: string;
}

export interface ComparisonItem {
  feature: string;
  petDocument: ComparisonValue;
  paperFiles: ComparisonValue;
  generalApps: ComparisonValue;
}

export const getComparisonData = (): ComparisonItem[] => [
  {
    feature: "Comprehensive Digital Pet Identity",
    petDocument: { value: "Complete", description: "Full digital pet profile with secure health records" },
    paperFiles: { value: "No", description: "Prone to damage, loss, and disorganization" },
    generalApps: { value: "Limited", description: "Not designed for complete pet health management" },
  },
  {
    feature: "Automated Pet Health Reminders",
    petDocument: { value: "Advanced", description: "Smart vaccination and medication tracking" },
    paperFiles: { value: "Manual", description: "Requires manual calendar management" },
    generalApps: { value: "Basic", description: "General reminders without pet-specific features" },
  },
  {
    feature: "Secure Veterinary Record Sharing",
    petDocument: { value: "Professional", description: "HIPAA-compliant sharing with authorized vets" },
    paperFiles: { value: "No", description: "Physical copies only, no digital sharing" },
    generalApps: { value: "Limited", description: "Not designed for veterinary professional access" },
  },
  {
    feature: "Emergency Pet Medical Access",
    petDocument: { value: "Instant", description: "24/7 access to complete pet health history" },
    paperFiles: { value: "No", description: "Limited to physical location availability" },
    generalApps: { value: "Basic", description: "Limited emergency access features" },
  },
  {
    feature: "Complete Medication History Tracking",
    petDocument: { value: "Comprehensive", description: "Dosage tracking, schedules & interaction alerts" },
    paperFiles: { value: "Manual", description: "No automated tracking or alerts" },
    generalApps: { value: "Limited", description: "Basic tracking without pet-specific dosing" },
  },
  {
    feature: "Multi-Pet Family Management",
    petDocument: { value: "Unlimited", description: "Manage complete health records for all pets" },
    paperFiles: { value: "Complex", description: "Separate physical files for each pet" },
    generalApps: { value: "Limited", description: "Not optimized for multiple pet health management" },
  },
  {
    feature: "Veterinary Professional Integration",
    petDocument: { value: "Seamless", description: "Direct integration with veterinary practice workflows" },
    paperFiles: { value: "None", description: "No digital integration capabilities" },
    generalApps: { value: "None", description: "No professional veterinary integration" },
  },
  {
    feature: "Secure Pet Health Data Storage",
    petDocument: { value: "Bank-Level", description: "HIPAA-compliant encryption and security" },
    paperFiles: { value: "Vulnerable", description: "Risk of loss, damage, or unauthorized access" },
    generalApps: { value: "Variable", description: "Inconsistent security standards" },
  },
];

export const getAllFeatures = (data: ComparisonItem[]): string[] => {
  return data.map(item => item.feature);
};