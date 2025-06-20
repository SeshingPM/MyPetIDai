
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { CheckCircle } from 'lucide-react';

const TeamSection: React.FC = () => {
  const team = [
    {
      name: 'Corey',
      role: 'Founder & CEO',
      bio: 'With 20+ years in the tech industry and as a lifetime pet parent, Corey founded My Pet ID to solve real-world problems pet owners face with managing health records and important documents. His vision has transformed how pet parents organize vaccination records, microchip information, and emergency care plans.',
      image: '/placeholder.svg',
      credentials: 'Tech Executive',
      specialty: 'Pet Healthcare Technology',
      expertise: ['Tech & software organization', 'Problem solving', 'Pet owner experience design'],
      delay: 100
    },
    {
      name: 'Nicolas Chereque',
      role: 'Co-Founder',
      bio: 'Nicolas Chereque is a seasoned entrepreneur and pet industry innovator, bringing years of experience in building and scaling pet-focused ventures. As a strategic partner at MyPetID, Nicolas plays a key role in expanding our vision of providing every pet with a secure digital identity. His deep understanding of the pet care ecosystem and strong network across the industry help drive meaningful partnerships and ensure MyPetID stays ahead of the curve. Passionate about technology and animal welfare, Nicolas is committed to shaping a smarter, more connected future for pets and their families.',
      image: '/placeholder.svg',
      credentials: 'Entrepreneur & Pet Industry Innovator',
      specialty: 'Strategic Partnerships & Business Development',
      expertise: ['Pet industry ecosystem expertise', 'Strategic partnerships', 'Business scaling and growth'],
      delay: 200
    },
    {
      name: 'Vinny Merugumala',
      role: 'CTO',
      bio: 'With over 7 years of experience architecting robust software systems, Vinny brings deep technical expertise and visionary leadership to My Pet ID\'s engineering team. His background spans full-stack development, cloud infrastructure, and AI integration, making him instrumental in building secure, scalable, and intelligent solutions. Under Vinny\'s guidance, My Pet ID is pushing the boundaries of what\'s possible in digital record management — ensuring pet owners enjoy seamless, automated, and reliable access to their most important documents.',
      image: '/placeholder.svg',
      credentials: 'Software Systems Expert',
      specialty: 'Scalable Infrastructure & AI-Driven Automation',
      expertise: ['Scalable software system architecture', 'AI-driven automation workflows', 'Full-stack development and infrastructure'],
      delay: 300
    }
  ];
  
  return (
    <div className="container mx-auto" itemScope itemType="https://schema.org/Organization">
      <meta itemProp="name" content="My Pet ID" />
      <meta itemProp="description" content="Secure pet document management and reminder platform" />
      
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-indigo-700 mb-2">Meet Our Leadership Team</h3>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our founders and leadership team combine expertise in veterinary information systems, pet healthcare technology, and 
          document management to create the most comprehensive pet record platform available.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <FadeIn key={index} delay={member.delay}>
            <div 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              itemScope 
              itemType="https://schema.org/Person"
            >
              <meta itemProp="name" content={member.name} />
              <meta itemProp="jobTitle" content={member.role} />
              <meta itemProp="description" content={member.bio} />
              
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24 flex items-center justify-center">
                <img 
                  src={member.image} 
                  alt={`${member.name} - ${member.role} at My Pet ID`}
                  className="h-20 w-20 rounded-full border-4 border-white object-cover transform translate-y-16"
                  itemProp="image"
                />
              </div>
              <div className="pt-16 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1" itemProp="name">{member.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-1" itemProp="jobTitle">{member.role}</p>
                <p className="text-gray-500 text-sm mb-4">
                  <span className="font-medium">Credentials:</span> {member.credentials} • <span className="font-medium">Specialty:</span> {member.specialty}
                </p>
                <p className="text-gray-600 text-sm mb-4" itemProp="description">{member.bio}</p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Areas of Expertise:</h4>
                  <ul className="space-y-1">
                    {member.expertise.map((skill, skillIndex) => (
                      <li key={skillIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      
      <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h4 className="text-lg font-semibold text-indigo-700 mb-3">Why Our Team Makes a Difference</h4>
        <p className="text-gray-700 mb-4">
          At My Pet ID, our leaders bring specialized expertise in pet healthcare documentation, veterinary record 
          systems, and secure information management. This unique combination allows us to create solutions that truly 
          understand the needs of pet parents, veterinarians, and pet service providers.
        </p>
        <p className="text-gray-700">
          Our platform simplifies organization of vaccination records, medication schedules, microchip information, 
          insurance policies, and other critical documents that keep your pets healthy and safe throughout their lives.
        </p>
      </div>
    </div>
  );
};

export default TeamSection;