
import type { BlogPost } from "../types";

export const post1: BlogPost = {
  id: '1',
  title: 'Essential Vaccinations Every Pet Owner Should Know About',
  slug: 'essential-vaccinations-pet-owners',
  excerpt: 'Learn about the core vaccinations that keep your pets healthy and protected from common diseases.',
  content: `
    <p>Keeping your pets properly vaccinated is one of the most important responsibilities of pet ownership. Vaccines help prevent many dangerous and potentially fatal diseases.</p>
    
    <h2>Core Vaccines for Dogs</h2>
    <p>Core vaccines are recommended for all dogs regardless of their lifestyle:</p>
    <ul>
      <li><strong>Rabies</strong>: Required by law in most places, this vaccine protects against the fatal rabies virus.</li>
      <li><strong>Distemper</strong>: Protects against a serious virus that affects multiple body systems.</li>
      <li><strong>Parvovirus</strong>: Prevents a highly contagious disease that causes severe gastrointestinal issues.</li>
      <li><strong>Adenovirus</strong>: Protects against infectious hepatitis.</li>
    </ul>
    
    <h2>Core Vaccines for Cats</h2>
    <p>Essential vaccines for all cats include:</p>
    <ul>
      <li><strong>Rabies</strong>: Legally required in most areas.</li>
      <li><strong>FVRCP</strong>: A combination vaccine that protects against Feline Viral Rhinotracheitis, Calicivirus, and Panleukopenia.</li>
    </ul>
    
    <h2>Vaccination Schedule</h2>
    <p>Puppies and kittens typically receive a series of vaccinations starting at 6-8 weeks of age, with boosters every 3-4 weeks until they're about 16 weeks old. Adult pets need regular boosters to maintain immunity.</p>
    
    <p>Always keep records of your pet's vaccinations in a secure place. With PetDocument, you can digitally store all vaccination records and receive reminders when boosters are due.</p>
    
    <h2>Non-Core Vaccines</h2>
    <p>Depending on your pet's lifestyle and exposure risks, your veterinarian might recommend additional vaccines such as:</p>
    <ul>
      <li>Bordetella (kennel cough)</li>
      <li>Lyme disease</li>
      <li>Leptospirosis</li>
      <li>Feline leukemia virus (for outdoor cats)</li>
    </ul>
    
    <p>Discuss with your veterinarian which vaccines are appropriate for your pet based on their age, health status, and risk factors.</p>
  `,
  author: {
    name: 'Dr. Sarah Wilson',
    avatar: '/placeholder.svg',
    role: 'Veterinarian'
  },
  date: 'June 12, 2023',
  readTime: 6,
  category: 'Pet Health',
  tags: ['vaccinations', 'pet health', 'preventive care', 'dogs', 'cats'],
  image: '/placeholder.svg',
  featured: true
};
