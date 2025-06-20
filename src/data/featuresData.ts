
import { LucideIcon } from 'lucide-react';
import { 
  CreditCard, FileText, Bell, Share2, Shield, Globe,
  Smartphone, Cloud, Users, Award, Clock, RefreshCw
} from 'lucide-react';

export interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  color: string;
  category: 'identity' | 'management' | 'sharing' | 'security';
}

export const coreFeatures: Feature[] = [
  {
    id: 'digital-identity',
    icon: CreditCard,
    title: "Digital Pet Identity & My Pet ID",
    description: "Create a unique, permanent digital identity for your pet with their own My Pet ID number - like a Social Security Number for pets that provides instant verification and ownership proof throughout their lifetime.",
    benefits: [
      "Unique My Pet ID number for permanent identification",
      "Instant ownership verification accepted by veterinarians",
      "Streamlined vet check-ins and emergency identification",
      "Professional recognition system trusted by pet care providers"
    ],
    color: "blue",
    category: "identity"
  },
  {
    id: 'document-storage',
    icon: FileText,
    title: "Secure Document Vault",
    description: "Store all your pet's important documents securely linked to their My Pet ID. Never lose vaccination records, medical history, or insurance documents again with our encrypted digital vault.",
    benefits: [
      "Unlimited secure storage for all pet documents",
      "Bank-level encryption protects sensitive information",
      "Instant access from any device, anywhere in the world",
      "Automatic backup prevents document loss"
    ],
    color: "emerald",
    category: "management"
  },
  {
    id: 'smart-reminders',
    icon: Bell,
    title: "Smart Health Reminders",
    description: "Never miss important pet care tasks with intelligent reminders tied to your pet's My Pet ID. Get notifications for vaccinations, medications, vet appointments, and more.",
    benefits: [
      "Automated reminders for vaccinations and medications",
      "Customizable notification preferences (email, SMS, app)",
      "Recurring schedule management for ongoing treatments",
      "Emergency alert system for critical health events"
    ],
    color: "purple",
    category: "management"
  },
  {
    id: 'instant-sharing',
    icon: Share2,
    title: "Instant Identity Sharing",
    description: "Share your pet's complete digital identity and medical history instantly using their My Pet ID. Perfect for vet visits, boarding, pet sitting, or emergency situations.",
    benefits: [
      "One-click sharing with veterinarians and caregivers",
      "Secure, time-limited access links for privacy",
      "Professional reports generated automatically",
      "Real-time collaboration with pet care providers"
    ],
    color: "amber",
    category: "sharing"
  },
  {
    id: 'identity-verification',
    icon: Shield,
    title: "Professional Identity Verification",
    description: "Your pet's My Pet ID provides instant, professional-grade verification of ownership and medical history. Recognized by veterinarians, boarding facilities, and pet services worldwide.",
    benefits: [
      "Instant ownership proof with My Pet ID verification",
      "Professional recognition by veterinary clinics",
      "Streamlined boarding and daycare check-ins",
      "Emergency contact and medical alert system"
    ],
    color: "green",
    category: "security"
  },
  {
    id: 'global-portability',
    icon: Globe,
    title: "Lifetime Global Portability",
    description: "Your pet's My Pet ID and digital identity travel with them anywhere in the world. Access their complete profile and medical history from any device, in any location.",
    benefits: [
      "Global accessibility from any internet-connected device",
      "International recognition for travel and relocation",
      "Cloud-based storage ensures data is never lost",
      "Multi-language support for international use"
    ],
    color: "cyan",
    category: "identity"
  }
];

export const additionalFeatures: Feature[] = [
  {
    id: 'mobile-access',
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Access your pet's My Pet ID and complete digital profile from your smartphone, tablet, or computer. Our responsive design works perfectly on any device.",
    benefits: [
      "Native mobile apps for iOS and Android",
      "Responsive web design for all screen sizes",
      "Offline access to critical information",
      "Camera integration for document scanning"
    ],
    color: "indigo",
    category: "management"
  },
  {
    id: 'cloud-sync',
    icon: Cloud,
    title: "Real-Time Cloud Synchronization",
    description: "All your pet's information syncs automatically across all your devices, ensuring you always have the most up-to-date information linked to their My Pet ID.",
    benefits: [
      "Automatic synchronization across all devices",
      "Real-time updates shared with authorized users",
      "Secure cloud backup prevents data loss",
      "Version history tracks all changes"
    ],
    color: "slate",
    category: "management"
  },
  {
    id: 'family-sharing',
    icon: Users,
    title: "Family & Caregiver Access",
    description: "Grant family members, pet sitters, and caregivers controlled access to your pet's My Pet ID and information. Perfect for multi-person pet care.",
    benefits: [
      "Multi-user access with customizable permissions",
      "Family member invitation and management",
      "Caregiver temporary access for pet sitting",
      "Activity log shows who accessed what information"
    ],
    color: "pink",
    category: "sharing"
  },
  {
    id: 'vet-recognition',
    icon: Award,
    title: "Veterinary Professional Recognition",
    description: "My Pet ID is increasingly recognized by veterinary professionals as the standard for digital pet identity and medical record management.",
    benefits: [
      "Growing acceptance by veterinary clinics worldwide",
      "Professional-grade medical record formatting",
      "Integration with veterinary practice management systems",
      "Continuing education for vets on My Pet ID benefits"
    ],
    color: "yellow",
    category: "security"
  }
];

export const allFeatures = [...coreFeatures, ...additionalFeatures];

// Feature categories for organization
export const featureCategories = {
  identity: {
    title: "Digital Identity & My Pet ID",
    description: "Create and manage your pet's permanent digital identity",
    color: "blue"
  },
  management: {
    title: "Health & Document Management", 
    description: "Store, organize, and access your pet's important information",
    color: "emerald"
  },
  sharing: {
    title: "Sharing & Collaboration",
    description: "Share your pet's information securely with caregivers",
    color: "amber"
  },
  security: {
    title: "Security & Verification",
    description: "Professional-grade security and identity verification",
    color: "green"
  }
};