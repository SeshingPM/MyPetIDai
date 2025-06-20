
import React from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { ComparisonItem } from './comparisonData';

interface MobileComparisonCardProps {
  item: ComparisonItem;
}

const getStatusIcon = (value: string) => {
  const positiveValues = ["yes", "advanced", "unlimited", "comprehensive", "secure", "smart"];
  const negativeValues = ["no", "manual", "limited", "basic"];
  
  const lowerValue = value.toLowerCase();
  
  if (positiveValues.some(v => lowerValue.includes(v))) {
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  }
  
  if (negativeValues.some(v => lowerValue.includes(v))) {
    return <XCircle className="h-5 w-5 text-red-500" />;
  }
  
  return <HelpCircle className="h-5 w-5 text-amber-500" />;
};

const MobileComparisonCard: React.FC<MobileComparisonCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full">
      <h3 className="font-semibold text-blue-800 border-b pb-2 mb-3">{item.feature}</h3>
      
      <div className="grid grid-cols-3 gap-1">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-600 mb-1">PetDocument</span>
          <div className="flex flex-col items-center">
            {getStatusIcon(item.petDocument.value)}
            <span className="text-xs font-medium text-blue-700 mt-1 text-center">{item.petDocument.value}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-600 mb-1">Paper Files</span>
          <div className="flex flex-col items-center">
            {getStatusIcon(item.paperFiles.value)}
            <span className="text-xs font-medium mt-1 text-center">{item.paperFiles.value}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-600 mb-1">General Apps</span>
          <div className="flex flex-col items-center">
            {getStatusIcon(item.generalApps.value)}
            <span className="text-xs font-medium mt-1 text-center">{item.generalApps.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileComparisonCard;
