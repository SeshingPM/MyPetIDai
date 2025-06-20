
import React from 'react';
import { PawPrint } from 'lucide-react';

const StorySection: React.FC = () => {
  return (
    <div className="glass-panel p-5 md:p-6 rounded-xl shadow-lg border border-blue-100/50 bg-white/95 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <PawPrint className="text-primary" size={20} />
        Our Story
      </h3>
      <p className="text-gray-700 mb-3 text-sm md:text-base">
        My Pet ID began when our founder's dog needed emergency care while traveling, and important documents weren't accessible. From vaccination records to boarding requirements, insurance policies to training certificates - we found pet owners needed a better way to manage all their pet information.
      </p>
      <p className="text-gray-700 mb-3 text-sm md:text-base">
        What started as a simple tool for health records quickly expanded as we discovered pet parents needed help with everything from medication reminders to food allergies, grooming appointments to training schedules.
      </p>
      <p className="text-gray-700 text-sm md:text-base">
        Today, we're a team of passionate pet lovers and tech experts working to simplify every aspect of pet parenthood through comprehensive document management and smart reminders. We believe managing your pet's information should be as simple and enjoyable as living with them.
      </p>
    </div>
  );
};

export default StorySection;
