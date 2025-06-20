
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { Building2, Calendar, Star, Award } from 'lucide-react';

const EnhancedTeamSection: React.FC = () => {
  const team = [
    {
      name: 'Corey',
      role: 'Founder & CEO',
      bio: 'With 20+ years in the tech industry and as a lifetime pet parent, Corey founded My Pet ID to solve real-world problems pet owners face with managing health records and important documents. His vision has transformed how pet parents organize vaccination records, microchip information, and emergency care plans.',
      image: '/placeholder.svg',
      credentials: 'Tech Executive & Serial Entrepreneur',
      specialty: 'Pet Healthcare Technology & Product Vision',
      experience: '20+ years',
      keyHighlights: [
        'Founded My Pet ID to solve pet health record challenges',
        'Serial entrepreneur with multiple successful ventures',
        'Expert in product strategy and team scaling'
      ],
      delay: 100,
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'Nicolas Chereque',
      role: 'Co-Founder',
      bio: 'Nicolas Chereque is a seasoned entrepreneur and pet industry innovator, bringing years of experience in building and scaling pet-focused ventures. As a strategic partner at MyPetID, Nicolas plays a key role in expanding our vision of providing every pet with a secure digital identity.',
      image: '/placeholder.svg',
      credentials: 'Entrepreneur & Pet Industry Innovator',
      specialty: 'Strategic Partnerships & Business Development',
      experience: '15+ years',
      keyHighlights: [
        'Built multiple pet-focused ventures from ground up',
        'Extensive network across the pet industry ecosystem',
        'Strategic partnerships that drive growth'
      ],
      delay: 200,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Vinny Merugumala',
      role: 'CTO',
      bio: 'With over 7 years of experience architecting robust software systems, Vinny brings deep technical expertise and visionary leadership to My Pet ID\'s engineering team. His background spans full-stack development, cloud infrastructure, and AI integration.',
      image: '/placeholder.svg',
      credentials: 'Software Systems Expert & Technical Visionary',
      specialty: 'Scalable Infrastructure & AI-Driven Automation',
      experience: '7+ years',
      keyHighlights: [
        'Architected the secure, scalable My Pet ID platform',
        'Expert in AI integration and machine learning',
        'Cloud infrastructure and security specialist'
      ],
      delay: 300,
      gradient: 'from-teal-500 to-cyan-600'
    }
  ];
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50/60" itemScope itemType="https://schema.org/Organization">
      <meta itemProp="name" content="My Pet ID" />
      <meta itemProp="description" content="Secure pet document management and reminder platform" />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Leadership Team
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Meet the visionaries, innovators, and pet advocates who are transforming how families manage their pets' health records, 
            appointments, and important documents.
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-8 mb-12">
          {team.map((member, index) => (
            <FadeIn key={index} delay={member.delay}>
              <div 
                className="relative bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                itemScope 
                itemType="https://schema.org/Person"
              >
                {/* Gradient accent line */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${member.gradient}`} />
                
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile section */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-start gap-4 lg:w-56 flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={member.image} 
                          alt={`${member.name} - ${member.role} at My Pet ID`}
                          className="w-20 h-20 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-white shadow-lg"
                          itemProp="image"
                        />
                        <div className={`absolute -inset-1 bg-gradient-to-r ${member.gradient} rounded-full opacity-20 -z-10`} />
                      </div>
                      
                      <div className="text-center lg:text-left">
                        <h4 className="text-xl font-bold text-gray-800 mb-1" itemProp="name">{member.name}</h4>
                        <p className={`text-sm font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-3`} itemProp="jobTitle">
                          {member.role}
                        </p>
                        <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                          <Calendar className="h-3 w-3" />
                          <span>{member.experience}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="flex-1 space-y-4">
                      {/* Credentials & Specialty */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100/60">
                          <div className="flex items-center gap-2 text-blue-700 mb-2">
                            <Building2 className="h-4 w-4" />
                            <span className="font-semibold text-sm">Credentials</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{member.credentials}</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100/60">
                          <div className="flex items-center gap-2 text-purple-700 mb-2">
                            <Star className="h-4 w-4" />
                            <span className="font-semibold text-sm">Specialty</span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">{member.specialty}</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 rounded-lg border border-gray-200/60">
                        <p className="text-gray-700 text-sm leading-relaxed" itemProp="description">
                          {member.bio}
                        </p>
                      </div>

                      {/* Key Highlights */}
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100/60">
                        <div className="flex items-center gap-2 text-indigo-700 mb-3">
                          <Award className="h-4 w-4" />
                          <span className="font-semibold text-sm">Key Highlights</span>
                        </div>
                        <div className="space-y-2">
                          {member.keyHighlights.map((highlight, highlightIndex) => (
                            <div key={highlightIndex} className="flex items-start gap-2">
                              <div className={`w-1.5 h-1.5 bg-gradient-to-r ${member.gradient} rounded-full mt-2 flex-shrink-0`} />
                              <span className="text-gray-700 text-sm leading-relaxed">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        
        {/* Why Our Team Section */}
        <FadeIn delay={500}>
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 rounded-xl text-white overflow-hidden">
            {/* Background decoration */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
            
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-center mb-6">Why Our Team Makes the Difference</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                  <h5 className="font-bold text-lg mb-3 text-blue-100">Deep Industry Expertise</h5>
                  <p className="text-blue-50 text-sm leading-relaxed">
                    Our leadership combines specialized knowledge in pet healthcare documentation, veterinary record 
                    systems, and secure information management. This unique blend allows us to create solutions that 
                    truly understand the needs of pet parents, veterinarians, and pet service providers.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
                  <h5 className="font-bold text-lg mb-3 text-purple-100">Comprehensive Pet Care Vision</h5>
                  <p className="text-purple-50 text-sm leading-relaxed">
                    We've simplified the organization of vaccination records, medication schedules, microchip information, 
                    insurance policies, and other critical documents that keep your pets healthy and safe throughout their lives. 
                    Our platform grows with your pet family's needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default EnhancedTeamSection;