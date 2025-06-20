import React from 'react';
import { 
  HelpCircle, BookOpen, Shield, File, Bell,
  Share2, Cloud, UserPlus, Map, Smartphone,
  Zap, Settings, AlertTriangle, Calendar, Globe, Table, CreditCard
} from 'lucide-react';
import { FAQCategory, FAQItem } from '@/components/faq/types';

export const faqCategories: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Everything you need to know to create your first pet digital identity',
    icon: BookOpen,
    count: 8,
    color: 'text-emerald-600'
  },
  {
    id: 'security-privacy',
    title: 'Security & Privacy',
    description: 'How we protect your pet\'s sensitive information and digital identity',
    icon: Shield,
    count: 6,
    color: 'text-blue-600'
  },
  {
    id: 'documents',
    title: 'Document Management',
    description: 'Uploading, organizing, and sharing your pet documents and records',
    icon: File,
    count: 8,
    color: 'text-purple-600'
  },
  {
    id: 'reminders',
    title: 'Reminders & Scheduling',
    description: 'Setting up alerts for medications, appointments and health care',
    icon: Bell,
    count: 6,
    color: 'text-orange-600'
  },
  {
    id: 'platform',
    title: 'Platform & Features',
    description: 'Understanding My Pet ID features, mobile apps, and accessibility',
    icon: Settings,
    count: 7,
    color: 'text-indigo-600'
  },
  {
    id: 'emergency-support',
    title: 'Emergency & Support',
    description: 'Accessing records during emergencies and getting help when needed',
    icon: AlertTriangle,
    count: 5,
    color: 'text-red-600'
  }
];

export const comprehensiveFAQs: FAQItem[] = [
  // Getting Started - Enhanced for new users
  {
    question: "How do I create my pet's first digital identity with My Pet ID?",
    answer: "Creating your pet's digital identity is simple and takes just minutes:\n\n1. Sign up for your free MyPetID.ai account\n2. Click 'Add New Pet' and enter your pet's basic information (name, breed, age, etc.)\n3. Upload a photo to personalize their digital identity\n4. Your pet receives a unique My Pet ID number for permanent identification\n5. Start adding documents like vaccination records, vet reports, or insurance papers\n6. Set up reminders for upcoming vet visits or medication schedules\n\nOnce created, your pet's digital identity travels with them for life, making vet visits, boarding, and care coordination much easier.",
    category: "getting-started",
    keywords: ["create pet digital identity", "how to start MyPetID", "pet registration process", "new pet owner setup", "first time pet ID"]
  },
  {
    question: "What information do I need to get started with my pet's profile?",
    answer: "To create a comprehensive pet profile, gather these basic details:\n\n• Pet's name, breed, and date of birth (or approximate age)\n• Current weight and any distinctive markings or characteristics\n• Microchip number (if your pet is microchipped)\n• Current veterinarian's contact information\n• Recent vaccination records or health certificates\n• Any current medications or known allergies\n• Pet insurance information (if applicable)\n\nDon't worry if you don't have everything - you can always add more information later as you visit the vet or gather documents.",
    category: "getting-started",
    keywords: ["pet profile information needed", "what documents for pet ID", "pet registration requirements", "new pet checklist"]
  },
  {
    question: "Can I add multiple pets to one account?",
    answer: "Yes! You can add unlimited pets to your MyPetID.ai account completely free. Each pet gets their own unique My Pet ID and individual profile with separate documents, reminders, and health records. This is perfect for:\n\n• Multi-pet households with dogs, cats, or other animals\n• Pet families with different care schedules and vet visits\n• Organizing each pet's unique medical history and needs\n• Setting individual reminders for different pets' medications or appointments\n\nWhether you have one pet or a dozen, MyPetID.ai accommodates all your furry family members at no cost.",
    category: "getting-started",
    keywords: ["multiple pets one account", "unlimited pets free", "multi-pet household management", "pet family organization"]
  },
  {
    question: "Is MyPetID.ai really completely free to use?",
    answer: "Yes! MyPetID.ai is 100% free for all pet owners, forever. Create unlimited pet digital identities, store unlimited documents, set unlimited reminders, and share with as many veterinarians and caregivers as needed - all at no cost.\n\nThere are no hidden fees, premium tiers, or subscription charges. We believe every pet deserves a digital identity and their owners shouldn't have to pay for basic pet care management tools. Our mission is to make comprehensive pet care accessible to everyone.",
    category: "getting-started",
    keywords: ["free pet ID service", "no cost pet management", "free pet health records", "lifetime free pet platform"]
  },
  {
    question: "Do I need to download an app or can I use it in my web browser?",
    answer: "MyPetID.ai works perfectly in any web browser on your computer, tablet, or smartphone - no download required! For added convenience, we also offer dedicated mobile apps for both iPhone and Android devices.\n\nThe mobile apps include special features like:\n• Camera scanning to digitize paper documents instantly\n• Offline access to important pet information\n• Push notifications for reminders\n• Quick photo uploads from your device\n\nYou can seamlessly switch between using the website and mobile app - all your pet's information stays perfectly synchronized.",
    category: "getting-started",
    keywords: ["MyPetID mobile app", "web browser pet management", "iPhone Android pet app", "no download required"]
  },

  // Security & Privacy - Simplified and practical
  {
    question: "How secure is my pet's information and digital identity?",
    answer: "Your pet's digital identity is protected with the same security standards used by banks and financial institutions:\n\n• All data encrypted with industry-standard protocols\n• Secure cloud storage with automatic backups\n• You control exactly who can access your pet's information\n• No data sharing with third parties without your permission\n• Regular security updates and monitoring\n\nYour pet's My Pet ID and all associated documents are safer online than paper records that can be lost, damaged, or stolen.",
    category: "security-privacy",
    keywords: ["pet data security", "safe pet records", "encrypted pet information", "secure pet digital identity"]
  },
  {
    question: "Who can see my pet's information and records?",
    answer: "You have complete control over your pet's digital identity and information access:\n\n• Only you can see your pet's full profile by default\n• You choose exactly what to share and with whom\n• Veterinarians only see what you specifically share with them\n• Shared links can be set to expire automatically\n• You can revoke access at any time\n• Family members can be granted access if you choose\n\nMyPetID.ai never shares your pet's information with anyone without your explicit permission.",
    category: "security-privacy",
    keywords: ["pet privacy control", "who sees pet records", "veterinarian data access", "family sharing pets"]
  },
  {
    question: "What happens to my pet's digital identity if I lose my phone or forget my password?",
    answer: "Your pet's digital identity is safely stored in the cloud, so it's never tied to just one device:\n\n• Access from any computer, tablet, or smartphone by logging in\n• Use password reset if you forget your login credentials\n• All pet information, documents, and My Pet ID numbers remain intact\n• Nothing is lost if your device is damaged, lost, or stolen\n• Download the mobile app on a new device and sign in normally\n\nThis is one of the major advantages of digital pet records over paper files that can be permanently lost.",
    category: "security-privacy",
    keywords: ["lost phone pet records", "forgot password pet account", "cloud pet data backup", "device independent pet ID"]
  },

  // Document Management - Practical and comprehensive
  {
    question: "What types of pet documents can I store in MyPetID.ai?",
    answer: "MyPetID.ai accepts all types of pet-related documents and files:\n\n• Veterinary Records: Health certificates, exam reports, treatment plans, surgical records\n• Vaccination Documents: Certificates, immunization schedules, titer test results\n• Laboratory Results: Blood work, urinalysis, fecal exams, diagnostic reports\n• Medical Imaging: X-rays, ultrasounds, MRI scans (JPEG, PNG, PDF formats)\n• Insurance Papers: Policy documents, claims, coverage details\n• Registration: Microchip certificates, breed registration, licensing\n• Photos: Current pictures, injury documentation, before/after treatment\n• Travel Documents: Health certificates, pet passports, airline requirements\n\nUpload any file format - PDF, images, Word documents, or even photos taken with your phone.",
    category: "documents",
    keywords: ["pet document types", "veterinary records storage", "vaccination certificates digital", "pet insurance documents", "x-ray storage pets"]
  },
  {
    question: "How do I scan and upload paper documents from my vet?",
    answer: "Converting paper documents to digital is easy with multiple options:\n\n• Mobile App Camera: Use the built-in scanner to photograph documents with automatic edge detection and enhancement\n• Phone Camera: Take clear photos of documents and upload them directly\n• Computer Upload: Scan documents with any scanner and upload PDF or image files\n• Email Forward: Many vets can email documents directly to you for easy upload\n\nTips for best results:\n• Ensure good lighting when photographing documents\n• Keep the camera steady and capture the entire document\n• The mobile app automatically enhances and crops document photos\n• Multiple page documents can be combined into single records",
    category: "documents",
    keywords: ["scan pet documents", "mobile document scanner", "digitize vet papers", "upload vaccination records", "photo to PDF pets"]
  },
  {
    question: "How do I quickly share my pet's records with a new veterinarian?",
    answer: "Sharing your pet's complete medical history with a new vet is simple and instant:\n\n1. Open your pet's profile and click 'Share Documents'\n2. Select which records to share (or choose 'All Medical Records')\n3. Set an expiration time for the shared link (24 hours, 1 week, etc.)\n4. Email the secure link directly to your vet or copy the link\n5. Your vet can view all shared information without needing an account\n6. Track when your vet accesses the information\n7. Revoke access anytime if needed\n\nThis eliminates the need to request records from your previous vet and ensures your new vet has complete information before your first visit.",
    category: "documents",
    keywords: ["share pet records new vet", "transfer pet medical history", "veterinarian document sharing", "quick vet record access"]
  },
  {
    question: "Can I organize documents by different categories or dates?",
    answer: "Yes! MyPetID.ai automatically organizes your pet's documents for easy access:\n\n• Smart Categories: Vaccinations, Medical Records, Lab Results, Insurance, Photos, etc.\n• Date Sorting: View documents chronologically or by most recent\n• Search Function: Find any document instantly by name, date, or content\n• Custom Tags: Add your own labels for specific conditions or treatments\n• Filter Options: Show only certain types of documents or date ranges\n• Vet Visit Grouping: Documents can be grouped by specific appointments\n\nThe system learns from your uploads and suggests appropriate categories, making organization effortless as your pet's records grow over time.",
    category: "documents",
    keywords: ["organize pet documents", "categorize veterinary records", "search pet health history", "document management pets"]
  },

  // Reminders & Scheduling - Practical health management
  {
    question: "How do I set up vaccination reminders for my pet?",
    answer: "Setting up vaccination reminders ensures your pet never misses important immunizations:\n\n1. Go to your pet's profile and click 'Add Reminder'\n2. Select 'Vaccination' as the reminder type\n3. Choose the vaccine type (Rabies, DHPP, Bordetella, etc.)\n4. Enter the last vaccination date or set the upcoming due date\n5. Choose how far in advance you want to be notified (2 weeks, 1 month, etc.)\n6. Select notification methods (email, mobile app push, or both)\n7. For annual vaccines, set the reminder to repeat automatically\n\nThe system will send notifications at your chosen intervals and help you track your pet's complete vaccination history for vet visits, boarding, or travel requirements.",
    category: "reminders",
    keywords: ["pet vaccination reminders", "immunization schedule alerts", "rabies reminder setup", "automated vaccine notifications"]
  },
  {
    question: "Can I set medication reminders for daily pet medicines?",
    answer: "Absolutely! MyPetID.ai excels at managing complex medication schedules:\n\n• Daily Medications: Set specific times for daily pills, drops, or treatments\n• Multiple Doses: Configure reminders for medications given 2-3 times per day\n• Duration Tracking: Set end dates for temporary medications or ongoing treatments\n• Dosage Information: Include dosage amounts and special instructions\n• Inventory Alerts: Get notified when you're running low on medication\n• Multiple Pets: Separate medication schedules for each pet in your household\n\nPerfect for managing chronic conditions, post-surgery medications, or daily supplements. Never worry about missing a dose that could affect your pet's health and recovery.",
    category: "reminders",
    keywords: ["pet medication reminders", "daily medicine alerts", "prescription schedule pets", "dosage tracking animals"]
  },
  {
    question: "What types of pet care reminders can I create?",
    answer: "MyPetID.ai supports reminders for all aspects of pet care:\n\n• Health Care: Vet appointments, vaccinations, dental cleanings, heartworm tests\n• Medications: Daily pills, topical treatments, eye drops, supplements\n• Preventive Care: Flea/tick prevention, heartworm medication, deworming\n• Grooming: Nail trims, baths, professional grooming appointments\n• Routine Maintenance: Weight checks, exercise goals, diet changes\n• Seasonal Care: Winter coat care, summer heat precautions\n• Senior Pet Care: More frequent check-ups, mobility assessments\n• Custom Reminders: Anything specific to your pet's unique needs\n\nAll reminders can be set to repeat daily, weekly, monthly, annually, or custom intervals to match your pet's care routine.",
    category: "reminders",
    keywords: ["pet care reminder types", "comprehensive pet scheduling", "preventive care alerts", "custom pet reminders"]
  },

  // Platform & Features - Clear capabilities
  {
    question: "Does MyPetID.ai work on both iPhone and Android phones?",
    answer: "Yes! MyPetID.ai is fully compatible with all devices:\n\n• iPhone & iPad: Download the free iOS app from the App Store\n• Android Phones & Tablets: Download the free Android app from Google Play\n• Web Browsers: Use Safari, Chrome, Firefox, or Edge on any computer\n• Cross-Device Sync: All information automatically syncs between devices\n\nThe mobile apps include enhanced features like camera document scanning, offline access to critical information, and push notifications. You can seamlessly switch between using your phone, tablet, and computer while maintaining access to all your pet's information.",
    category: "platform",
    keywords: ["MyPetID iPhone app", "Android pet management", "mobile pet records", "cross-device pet sync"]
  },
  {
    question: "Can family members access our pet's information?",
    answer: "Yes! MyPetID.ai supports family sharing so everyone involved in your pet's care stays informed:\n\n• Primary Account: The main account holder controls all sharing permissions\n• Family Access: Invite family members to view specific pets or all pets\n• Permission Levels: Grant full access or limit to viewing certain information\n• Caregiver Sharing: Share with pet sitters, dog walkers, or boarding facilities\n• Emergency Contacts: Designate family members who can access information during emergencies\n• Easy Management: Add or remove access for family members at any time\n\nThis ensures that anyone caring for your pet has access to important medical information, emergency contacts, and care instructions when needed.",
    category: "platform",
    keywords: ["family pet sharing", "multiple users pet account", "pet caregiver access", "shared pet responsibilities"]
  },
  {
    question: "What happens during a veterinary emergency - can I quickly access my pet's records?",
    answer: "During emergencies, MyPetID.ai provides instant access to life-saving information:\n\n• Mobile Quick Access: Open the app and immediately see critical health information\n• Emergency Profile: Key details like allergies, medications, and conditions are prominently displayed\n• Vet Contact Info: Quick access to your regular veterinarian's contact information\n• Medical History: Complete vaccination records, recent treatments, and ongoing conditions\n• Share Instantly: Generate emergency access links for emergency vets in seconds\n• Offline Access: Critical information available even without internet connection\n• Emergency Contacts: Family member contact information readily available\n\nMany pet owners report that having instant access to complete medical records during emergencies helped emergency vets make faster, more informed treatment decisions.",
    category: "emergency-support",
    keywords: ["pet emergency records access", "veterinary emergency information", "quick pet medical history", "emergency vet documentation"]
  },

  // Emergency & Support - Critical situations
  {
    question: "How do I access my pet's records if I'm traveling and don't have internet?",
    answer: "MyPetID.ai ensures you have access to critical pet information even while traveling:\n\n• Offline Mobile App: Key information automatically synced for offline viewing\n• Download Documents: Save important documents directly to your device before traveling\n• Emergency Summary: Generate a printable emergency card with essential information\n• Multiple Device Backup: Access from any family member's device\n• Hotel WiFi Access: Quick login from any internet connection worldwide\n• Emergency Sharing: Create temporary access links before traveling for pet sitters\n\nMany travelers create emergency document packages before trips, including vaccination certificates, health records, and emergency contact information that can be accessed offline.",
    category: "emergency-support",
    keywords: ["travel pet records offline", "pet documents no internet", "emergency pet information travel", "offline pet health access"]
  },
  {
    question: "What if I need help using MyPetID.ai or have technical problems?",
    answer: "MyPetID.ai provides comprehensive support to ensure you can always access your pet's information:\n\n• Help Center: Extensive guides and tutorials for all features\n• Email Support: Direct assistance for technical issues or questions\n• Video Tutorials: Step-by-step guides for common tasks\n• FAQ Section: Answers to frequently asked questions\n• Mobile App Help: Built-in help sections within the mobile apps\n• Account Recovery: Assistance with password resets and account access\n• Document Upload Help: Support for scanning and organizing documents\n\nOur support team understands that pet health information is critical, so we prioritize quick responses to ensure you're never without access to your pet's important records.",
    category: "emergency-support",
    keywords: ["MyPetID customer support", "pet app technical help", "account recovery pets", "document upload assistance"]
  },

  // Legacy FAQs - Enhanced versions of existing content
  {
    question: "How does MyPetID.ai compare to keeping paper records?",
    answer: "Digital pet records offer significant advantages over traditional paper filing:\n\n• Never Lost: Cloud storage means documents can't be misplaced, damaged, or destroyed\n• Instant Access: Find any document in seconds rather than searching through files\n• Easy Sharing: Share complete medical history with vets instantly via secure links\n• Always Available: Access from anywhere - home, vet's office, while traveling\n• Automatic Backup: Multiple copies stored securely, no risk of single point of failure\n• Space Saving: Unlimited storage without physical filing cabinets\n• Enhanced Search: Find documents by date, type, vet visit, or even content\n• Professional Appearance: Clean, organized presentation impresses veterinarians\n• Environmental Impact: Reduce paper waste while improving organization\n\nMost pet owners report saving several hours per year on document management after switching to MyPetID.ai.",
    category: "platform",
    keywords: ["digital vs paper pet records", "benefits electronic pet files", "paperless pet management", "modern pet record keeping"]
  },
  {
    question: "Can MyPetID.ai help me manage my senior pet's complex medical needs?",
    answer: "MyPetID.ai is particularly valuable for senior pets with multiple health conditions:\n\n• Medication Management: Track multiple daily medications with different schedules and dosages\n• Condition Monitoring: Document ongoing health issues and treatment responses\n• Frequent Vet Visits: Organize records from multiple specialists and regular check-ups\n• Progress Tracking: Monitor weight changes, mobility, and symptom progression over time\n• Treatment History: Complete record of what treatments have been tried and their effectiveness\n• Emergency Information: Quick access to current medications and conditions for emergency vets\n• Specialist Coordination: Easy sharing between primary vet, specialists, and emergency clinics\n• Quality of Life Tracking: Document good days and bad days to help with care decisions\n\nMany senior pet parents report better health outcomes through improved record keeping and medication adherence using MyPetID.ai.",
    category: "documents",
    keywords: ["senior pet care management", "elderly pet medical records", "complex pet health tracking", "aging pet medication management"]
  }
];

export const allFAQs = comprehensiveFAQs;