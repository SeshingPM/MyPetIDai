
import type { BlogPost } from "../types";

export const post3: BlogPost = {
  id: '3',
  title: "Traveling with Pets: Documents You'll Need",
  slug: 'traveling-with-pets-documents',
  excerpt: 'Planning a trip with your furry friend? Make sure you have all the necessary documentation to ensure smooth travels.',
  content: `
    <p>Whether you're traveling domestically or internationally, having the right documentation for your pet is crucial for a stress-free journey. Here's what you need to know.</p>
    
    <h2>Domestic Travel Requirements</h2>
    <p>Even when traveling within the country, you'll need:</p>
    <ul>
      <li><strong>Health Certificate</strong>: Many airlines require a Certificate of Veterinary Inspection (CVI) issued within 10 days of travel.</li>
      <li><strong>Rabies Certificate</strong>: Proof of current rabies vaccination.</li>
      <li><strong>Pet ID</strong>: Your pet should have ID tags and preferably be microchipped.</li>
      <li><strong>Medication Records</strong>: Documentation of any medications your pet is currently taking.</li>
    </ul>
    
    <h2>International Travel Documents</h2>
    <p>International travel requires additional preparation:</p>
    <ul>
      <li><strong>Pet Passport</strong>: Required for travel to many countries.</li>
      <li><strong>Import Permits</strong>: Some countries require specific permits before bringing in animals.</li>
      <li><strong>Additional Vaccinations</strong>: Beyond rabies, other vaccinations may be required depending on the destination.</li>
      <li><strong>Microchip Documentation</strong>: Many countries require ISO-standard microchips.</li>
      <li><strong>Parasite Treatment Certification</strong>: Proof of recent treatment for internal and external parasites.</li>
    </ul>
    
    <h2>Airline-Specific Requirements</h2>
    <p>Each airline has its own policies regarding pet travel:</p>
    <ul>
      <li>Size and weight restrictions</li>
      <li>Approved carrier specifications</li>
      <li>Temperature restrictions for certain breeds</li>
      <li>Additional health certifications</li>
    </ul>
    
    <h2>Accommodation Documents</h2>
    <p>For your accommodation, be prepared with:</p>
    <ul>
      <li>Pet policy confirmation from your hotel or rental</li>
      <li>Service animal documentation if applicable</li>
      <li>Pet behavior certifications (some upscale accommodations request these)</li>
    </ul>
    
    <h2>Digital Organization for Travel</h2>
    <p>Using PetDocument to organize your travel paperwork means:</p>
    <ul>
      <li>All documents are accessible from your smartphone</li>
      <li>You can quickly share documents with authorities or veterinarians</li>
      <li>Multiple copies are safely stored in case of loss</li>
      <li>Last-minute document requirements can be managed more easily</li>
    </ul>
    
    <p>Begin preparing your pet's travel documents at least 1-2 months before your trip, as some requirements like certain vaccinations or blood tests need to be completed within specific timeframes.</p>
  `,
  author: {
    name: 'Michael Chang',
    avatar: '/placeholder.svg',
    role: 'Travel Consultant'
  },
  date: 'April 14, 2023',
  readTime: 7,
  category: 'Travel',
  tags: ['travel', 'pet documents', 'international travel', 'pet passport', 'airlines'],
  image: '/placeholder.svg'
};
