
import React, { useState } from 'react';
import TeamSectionHeader from './team/TeamSectionHeader';
import TeamMemberCard from './team/TeamMemberCard';
import WhyOurTeamSection from './team/WhyOurTeamSection';
import { teamMembers } from './team/teamData';

const CombinedTeamSection: React.FC = () => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  console.log('CombinedTeamSection rendering with team members:', teamMembers.length);
  console.log('Flipped card state:', flippedCard);

  const toggleFlipped = (index: number) => {
    console.log('Toggle flip called for index:', index, 'current flipped:', flippedCard);
    setFlippedCard(flippedCard === index ? null : index);
  };
  
  return (
    <div className="container mx-auto" itemScope itemType="https://schema.org/Organization">
      <meta itemProp="name" content="My Pet ID" />
      <meta itemProp="description" content="Secure pet document management and reminder platform" />
      
      <TeamSectionHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {teamMembers.map((member, index) => {
          console.log('Rendering team member:', member.name, 'at index:', index);
          return (
            <TeamMemberCard
              key={`team-member-${index}-${member.name}`}
              member={member}
              index={index}
              isFlipped={flippedCard === index}
              onToggleFlipped={toggleFlipped}
            />
          );
        })}
      </div>
      
      <WhyOurTeamSection />
    </div>
  );
};

export default CombinedTeamSection;