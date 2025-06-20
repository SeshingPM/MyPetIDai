
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RemindersSectionHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
      <div>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Bell size={18} className="text-primary" />
          Reminders
        </CardTitle>
        <CardDescription className="text-xs text-gray-500">
          Upcoming pet appointments and tasks
        </CardDescription>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors"
        onClick={() => navigate('/reminders')}
      >
        View All
        <ArrowRight size={14} />
      </Button>
    </CardHeader>
  );
};

export default RemindersSectionHeader;
