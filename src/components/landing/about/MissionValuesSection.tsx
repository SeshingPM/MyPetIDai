
import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

const MissionValuesSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-xl shadow-md border border-indigo-100/50 bg-gradient-to-br from-white/95 to-indigo-50/90">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <span className="bg-indigo-100 text-indigo-600 p-2 rounded-full mr-3">
            <Sparkles size={20} />
          </span>
          Our Mission
        </h3>
        <p className="text-gray-700 mb-3">
          To create the world's most trusted platform for complete pet care management, making it effortless for pet owners to organize, access, and share everything from medical records to grooming schedules, dietary needs to training progress.
        </p>
        <p className="text-gray-700">
          We strive to simplify pet parenthood by providing intuitive tools that help you stay organized, informed, and prepared for every aspect of your pet's life - not just health, but everything that makes your pet's life happy and complete.
        </p>
      </div>
      
      <div className="glass-panel p-6 rounded-xl shadow-md border border-blue-100/50 bg-gradient-to-br from-white/95 to-blue-50/90">
        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
          <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
            <Heart size={20} />
          </span>
          Our Values
        </h3>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Comprehensive pet care beyond just health records</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Uncompromising security for all your sensitive information</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Intuitive organization for all aspects of pet ownership</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Smart reminders that simplify daily pet care routines</span>
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>Empathy and support for the complete pet parent journey</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MissionValuesSection;
