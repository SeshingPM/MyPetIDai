
import React from 'react';
import { ShieldCheck, Users, BarChart3, CloudLightning, Calendar, FileText } from 'lucide-react';

const ExpertiseSection: React.FC = () => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-center mb-6">Our Expertise & Commitment</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <ShieldCheck className="mx-auto h-8 w-8 text-blue-500 mb-2" />
          <h4 className="font-medium mb-1 text-sm">Security First</h4>
          <p className="text-xs text-gray-600">Bank-level encryption for all your data</p>
        </div>
        
        <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Users className="mx-auto h-8 w-8 text-indigo-500 mb-2" />
          <h4 className="font-medium mb-1 text-sm">Pet Experts</h4>
          <p className="text-xs text-gray-600">Designed with pet professionals</p>
        </div>
        
        <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <BarChart3 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
          <h4 className="font-medium mb-1 text-sm">Data Insights</h4>
          <p className="text-xs text-gray-600">Track all pet trends over time</p>
        </div>
        
        <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <CloudLightning className="mx-auto h-8 w-8 text-amber-500 mb-2" />
          <h4 className="font-medium mb-1 text-sm">Fast Access</h4>
          <p className="text-xs text-gray-600">All documents available instantly</p>
        </div>
        
        <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Calendar className="mx-auto h-8 w-8 text-rose-500 mb-2" />
          <h4 className="font-medium mb-1 text-sm">Smart Reminders</h4>
          <p className="text-xs text-gray-600">Never miss important pet events</p>
        </div>
        
        <div className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <FileText className="mx-auto h-8 w-8 text-purple-500 mb-2" />
          <h4 className="font-medium mb-1 text-sm">All Documents</h4>
          <p className="text-xs text-gray-600">From health to training to boarding</p>
        </div>
      </div>
    </div>
  );
};

export default ExpertiseSection;
