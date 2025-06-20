
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { ComparisonItem } from './comparisonData';
import { CheckCircle, XCircle } from 'lucide-react';

interface ComparisonTableProps {
  comparisonsData: ComparisonItem[];
  features: string[];
}

const getStatusIcon = (value: string) => {
  const positiveValues = [
    'yes', 'built-in', 'automatic', 'anywhere', 'instant', 'secure', 
    'specialized', 'automated', 'seamless', 'all services', 
    'owner-controlled', 'lifetime history', 'comprehensive', '24/7 access',
    'advanced', 'unlimited'
  ];
  
  const negativeValues = [
    'no', 'none', 'limited', 'vulnerable', 'not available', 'manual', 
    'provider-owned', 'provider hours', 'complicated', 'generic', 'basic'
  ];
  
  const lowerValue = value.toLowerCase();
  
  if (positiveValues.some(v => lowerValue.includes(v))) {
    return <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />;
  }
  
  if (negativeValues.some(v => lowerValue.includes(v))) {
    return <XCircle className="h-4 w-4 text-red-500 mx-auto" />;
  }
  
  return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{value}</span>;
};

const ComparisonTable: React.FC<ComparisonTableProps> = ({ comparisonsData, features }) => {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[200px] py-4 px-4 font-semibold text-gray-800">Features</TableHead>
            
            <TableHead className="w-[180px] py-4 px-3 text-center font-semibold">
              <div className="flex flex-col items-center">
                <span className="text-blue-700 whitespace-nowrap">My Pet ID</span>
                <span className="text-xs text-gray-500 mt-1">Complete solution</span>
              </div>
            </TableHead>
            
            <TableHead className="w-[180px] py-4 px-3 text-center font-semibold">
              <div className="flex flex-col items-center">
                <span className="text-gray-700">Paper Files</span>
                <span className="text-xs text-gray-500 mt-1">Traditional</span>
              </div>
            </TableHead>
            
            <TableHead className="w-[180px] py-4 px-3 text-center font-semibold">
              <div className="flex flex-col items-center">
                <span className="text-gray-700">General Apps</span>
                <span className="text-xs text-gray-500 mt-1">Non-specialized</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature, featureIndex) => {
            const item = comparisonsData.find(item => item.feature === feature);
            return (
              <TableRow key={featureIndex} className={featureIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="font-medium border-r border-gray-100 py-3 px-4">{feature}</TableCell>
                
                {item && (
                  <>
                    <TableCell className="text-center border-r border-gray-100 p-3 bg-blue-50/40">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(item.petDocument.value)}
                        <p className="text-xs text-blue-600 mt-1">{item.petDocument.description}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center border-r border-gray-100 p-3">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(item.paperFiles.value)}
                        <p className="text-xs text-gray-600 mt-1">{item.paperFiles.description}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center p-3">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(item.generalApps.value)}
                        <p className="text-xs text-gray-600 mt-1">{item.generalApps.description}</p>
                      </div>
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ComparisonTable;
