
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { Users, Sparkles } from 'lucide-react';

const TeamSectionHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <FadeIn>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Our Leadership Team
          </h3>
        </div>
      </FadeIn>
      <FadeIn delay={100}>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-4 leading-relaxed">
          Meet the visionaries, innovators, and pet advocates who are transforming how families manage their pets' health records, 
          appointments, and important documents.
        </p>
        <div className="flex items-center justify-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <div className="h-1 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
        </div>
      </FadeIn>
    </div>
  );
};

export default TeamSectionHeader;