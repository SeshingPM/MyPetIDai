
import type { BlogPost } from "../types";

export const post2: BlogPost = {
  id: '2',
  title: "How to Organize Your Pet's Medical Records",
  slug: 'organize-pet-medical-records',
  excerpt: "A comprehensive guide to keeping your pet's health records organized and accessible when you need them most.",
  content: `
    <p>Staying on top of your pet's medical history isn't just good practice—it can be lifesaving in an emergency. Here's how to create an organized system for your pet's healthcare information.</p>
    
    <h2>Why Medical Record Organization Matters</h2>
    <p>Well-organized records help you:</p>
    <ul>
      <li>Track vaccination schedules</li>
      <li>Monitor chronic conditions</li>
      <li>Share information with new veterinarians or pet sitters</li>
      <li>Identify patterns in your pet's health</li>
      <li>Have critical information ready in emergencies</li>
    </ul>
    
    <h2>Essential Documents to Keep</h2>
    <p>A complete pet medical file should include:</p>
    <ul>
      <li>Vaccination records with dates and due dates for boosters</li>
      <li>Wellness exam results</li>
      <li>Medication history (past and current)</li>
      <li>Laboratory test results</li>
      <li>Surgery reports</li>
      <li>Dental records</li>
      <li>Weight history</li>
      <li>Allergies or adverse reactions</li>
      <li>Microchip information</li>
    </ul>
    
    <h2>Digital Organization with PetDocument</h2>
    <p>While paper records have their place, digital storage provides additional security and accessibility. With PetDocument, you can:</p>
    <ul>
      <li>Scan and upload all veterinary documents</li>
      <li>Create a complete profile for each pet</li>
      <li>Set medication reminders</li>
      <li>Track appointment schedules</li>
      <li>Share records instantly with veterinarians or pet sitters</li>
      <li>Access information from anywhere, even during emergencies</li>
    </ul>
    
    <h2>Creating an Emergency File</h2>
    <p>In addition to your complete records, create a simplified emergency file containing:</p>
    <ul>
      <li>Your pet's basic information (age, breed, weight)</li>
      <li>Current medical conditions</li>
      <li>Medications and dosages</li>
      <li>Veterinarian contact information</li>
      <li>Emergency veterinary hospital information</li>
      <li>Allergies and known reactions</li>
    </ul>
    
    <p>With proper organization and digital backup, you'll have peace of mind knowing your pet's important health information is always at your fingertips.</p>
  `,
  author: {
    name: 'Emma Rodriguez',
    avatar: '/placeholder.svg',
    role: 'Pet Care Specialist'
  },
  date: 'May 28, 2023',
  readTime: 8,
  category: 'Pet Care',
  tags: ['organization', 'medical records', 'pet documents', 'pet care', 'emergency preparedness'],
  image: '/placeholder.svg',
  featured: true
};
