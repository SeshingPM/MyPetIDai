
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { CheckCircle, Target, Trophy, ChevronRight, RotateCcw } from 'lucide-react';
import { TeamMember } from './teamData';

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  isFlipped: boolean;
  onToggleFlipped: (index: number) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  index,
  isFlipped,
  onToggleFlipped
}) => {
  console.log('TeamMemberCard rendering:', { memberName: member.name, index, isFlipped });

  if (isFlipped) {
    // Back face - Details view
    return (
      <FadeIn delay={member.delay}>
        <div className="group relative min-h-[420px] border-2 border-blue-200 rounded-2xl bg-white shadow-lg p-6">
          {/* Gradient accent */}
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${member.colorTheme} rounded-t-2xl`} />
          
          {/* Header */}
          <div className="text-center mb-6 pt-4">
            <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
            <p className={`text-sm font-semibold bg-gradient-to-r ${member.colorTheme} bg-clip-text text-transparent`}>
              {member.role} - Details
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4 mb-6">
            {/* Highlights */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-blue-500 rounded-lg">
                  <Target size={12} className="text-white" />
                </div>
                Key Highlights
              </h5>
              <div className="space-y-2">
                {member.keyHighlights.slice(0, 2).map((highlight, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`w-2 h-2 bg-gradient-to-r ${member.colorTheme} rounded-full mt-2 flex-shrink-0`} />
                    <span className="text-gray-700 text-sm leading-relaxed">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-green-500 rounded-lg">
                  <CheckCircle size={12} className="text-white" />
                </div>
                Expertise
              </h5>
              <div className="grid grid-cols-1 gap-2">
                {member.expertise.slice(0, 3).map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-100">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                <div className="p-1.5 bg-yellow-500 rounded-lg">
                  <Trophy size={12} className="text-white" />
                </div>
                Achievements
              </h5>
              <div className="space-y-2">
                {member.achievements.slice(0, 2).map((achievement, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Trophy size={12} className="text-yellow-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flip back button */}
          <button
            onClick={() => {
              console.log('Back to Overview clicked for:', member.name, 'index:', index);
              onToggleFlipped(index);
            }}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${member.colorTheme} text-white font-medium text-sm py-3 px-4 rounded-xl hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
          >
            <span>Back to Overview</span>
            <RotateCcw size={16} className="transition-transform duration-200" />
          </button>
        </div>
      </FadeIn>
    );
  }

  // Front face - Overview
  return (
    <FadeIn delay={member.delay}>
      <div className="group relative min-h-[420px] border-2 border-blue-200 rounded-2xl bg-white shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${member.colorTheme}`} />
        
        {/* Header with gradient background */}
        <div className={`p-6 text-center bg-gradient-to-br ${member.gradientBg} relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full -mr-8 -mt-8" />
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -ml-6 -mb-6" />
          
          <div className="relative z-10">
            <div className="relative mb-4">
              <img 
                src={member.image} 
                alt={`${member.name} - ${member.role} at My Pet ID`}
                className="w-20 h-20 rounded-2xl border-3 border-white shadow-lg object-cover mx-auto transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.log('Image failed to load:', member.image);
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=80&h=80&fit=crop&crop=face';
                }}
              />
              <div className={`absolute -inset-1 bg-gradient-to-r ${member.colorTheme} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
            </div>
            
            <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
            <p className={`text-sm font-semibold bg-gradient-to-r ${member.colorTheme} bg-clip-text text-transparent mb-2`}>
              {member.role}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-between h-[calc(100%-140px)]">
          <div className="flex-1">
            {/* Compact badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200">
                {member.credentials}
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-200">
                {member.specialty}
              </div>
            </div>

            {/* Summary */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {member.summary}
            </p>
          </div>

          {/* Flip button */}
          <div className="mt-auto">
            <button
              onClick={() => {
                console.log('Learn More clicked for:', member.name, 'index:', index);
                onToggleFlipped(index);
              }}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${member.colorTheme} text-white font-medium text-sm py-3 px-4 rounded-xl hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
            >
              <span>Learn More</span>
              <ChevronRight size={16} className="transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default TeamMemberCard;