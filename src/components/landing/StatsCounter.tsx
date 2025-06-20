
import React, { useEffect, useState } from 'react';
import { PawPrint, FileText, Bell } from 'lucide-react';
import AnimatedCounter from '@/components/animations/AnimatedCounter';
import FadeIn from '@/components/animations/FadeIn';

// Initial values updated to smaller numbers
const INITIAL_STATS = {
  PETS: 350,      // Changed from 3500 to 350 (hundreds)
  DOCUMENTS: 1280, // Changed from 12800 to 1280 (thousands)
  REMINDERS: 560   // Changed from 5600 to 560 (hundreds)
};

// Small increase amounts for continuous animation (kept the same)
const INCREASE_AMOUNTS = {
  PETS: 10,
  DOCUMENTS: 15,
  REMINDERS: 12
};

const StatsCounter: React.FC = () => {
  const [stats, setStats] = useState(INITIAL_STATS);
  
  // Effect to periodically increase the stats to create a rolling counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => ({
        PETS: prevStats.PETS + INCREASE_AMOUNTS.PETS,
        DOCUMENTS: prevStats.DOCUMENTS + INCREASE_AMOUNTS.DOCUMENTS,
        REMINDERS: prevStats.REMINDERS + INCREASE_AMOUNTS.REMINDERS
      }));
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <FadeIn delay={350} direction="up">
      <div className="w-full mb-4">
        <div className="glass-card bg-gradient-to-br from-white/90 to-blue-50/80 border border-blue-100/70 shadow-sm rounded-xl p-3 md:p-4">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1.5">
                <PawPrint size={16} className="text-pet-blue" />
                <AnimatedCounter 
                  end={stats.PETS} 
                  className="text-base md:text-lg text-blue-700"
                  suffix="+"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium">Pets Registered</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1.5">
                <FileText size={16} className="text-pet-purple" />
                <AnimatedCounter 
                  end={stats.DOCUMENTS} 
                  className="text-base md:text-lg text-indigo-700"
                  suffix="+"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium">Documents Saved</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1.5">
                <Bell size={16} className="text-pet-green" />
                <AnimatedCounter 
                  end={stats.REMINDERS} 
                  className="text-base md:text-lg text-emerald-700"
                  suffix="+"
                />
              </div>
              <p className="text-xs text-gray-600 font-medium">Reminders Set</p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default StatsCounter;
