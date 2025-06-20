
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';

// Comparison data for digital pet identity solutions
const comparisonData = [
  {
    feature: "Pet Identity & My Pet ID",
    myPetId: { value: "Unique My Pet ID", description: "Permanent digital identity for life" },
    paperRecords: { value: "No Identity", description: "No standardized identification" },
    generalApps: { value: "Limited", description: "No permanent identity system" }
  },
  {
    feature: "Ownership Verification",
    myPetId: { value: "Instant", description: "My Pet ID provides immediate proof" },
    paperRecords: { value: "Manual", description: "Physical documents required" },
    generalApps: { value: "Basic", description: "No verification system" }
  },
  {
    feature: "Professional Recognition",
    myPetId: { value: "Widespread", description: "Accepted by vets and services" },
    paperRecords: { value: "Limited", description: "Varies by location" },
    generalApps: { value: "None", description: "Not professionally recognized" }
  },
  {
    feature: "Document Storage",
    myPetId: { value: "1GB Secure", description: "Linked to My Pet ID identity" },
    paperRecords: { value: "Physical Only", description: "Risk of damage/loss" },
    generalApps: { value: "Basic", description: "Not identity-linked" }
  },
  {
    feature: "Identity Portability",
    myPetId: { value: "Global", description: "Works anywhere in the world" },
    paperRecords: { value: "Limited", description: "Physical transport only" },
    generalApps: { value: "App-Dependent", description: "Limited to specific platforms" }
  },
  {
    feature: "Emergency Access",
    myPetId: { value: "Instant", description: "My Pet ID enables quick access" },
    paperRecords: { value: "Slow", description: "Must locate physical records" },
    generalApps: { value: "Variable", description: "Depends on app availability" }
  },
  {
    feature: "Lifetime Continuity",
    myPetId: { value: "Permanent", description: "My Pet ID never changes" },
    paperRecords: { value: "Fragmented", description: "Records easily lost/scattered" },
    generalApps: { value: "Uncertain", description: "Dependent on app survival" }
  }
];

const getStatusIcon = (value: string) => {
  const positiveValues = ["unique", "instant", "widespread", "secure", "global", "permanent"];
  const negativeValues = ["no", "none", "manual", "limited", "basic", "physical only"];
  
  const lowerValue = value.toLowerCase();
  
  if (positiveValues.some(v => lowerValue.includes(v))) {
    return <CheckCircle className="h-5 w-5 text-green-600" />;
  }
  
  if (negativeValues.some(v => lowerValue.includes(v))) {
    return <XCircle className="h-5 w-5 text-red-500" />;
  }
  
  return <HelpCircle className="h-5 w-5 text-amber-500" />;
};

// Mobile card view for each comparison item
const MobileComparisonCard = ({ item }: { item: typeof comparisonData[0] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-blue-800 border-b pb-2 mb-3">{item.feature}</h3>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-600 mb-1">MyPetID</span>
          <div className="flex flex-col items-center">
            {getStatusIcon(item.myPetId.value)}
            <span className="text-xs font-medium text-blue-700 mt-1">{item.myPetId.value}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-600 mb-1">Paper Records</span>
          <div className="flex flex-col items-center">
            {getStatusIcon(item.paperRecords.value)}
            <span className="text-xs font-medium mt-1">{item.paperRecords.value}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-600 mb-1">General Apps</span>
          <div className="flex flex-col items-center">
            {getStatusIcon(item.generalApps.value)}
            <span className="text-xs font-medium mt-1">{item.generalApps.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-blue-50/60 to-indigo-50/60 relative overflow-hidden" aria-labelledby="comparison-heading">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-0 opacity-40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '9s', animationDelay: '0.7s' }} />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '11s', animationDelay: '0.3s' }} />
      </div>
      
      <div className="container-max relative z-10 px-4">
        <FadeIn>
          <h2 
            id="comparison-heading"
            className="text-2xl md:text-4xl font-bold text-center mb-4"
          >
            Digital Pet Identity vs Traditional Methods
          </h2>
          <p className="text-center text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto">
            See how MyPetID's revolutionary My Pet ID system compares to traditional pet identification methods 
            and general-purpose apps for creating permanent digital pet identities.
          </p>
        </FadeIn>
        
        {isMobile ? (
          // Mobile view - cards
          <div className="px-1">
            {comparisonData.map((item, index) => (
              <FadeIn key={index} delay={index * 50}>
                <MobileComparisonCard item={item} />
              </FadeIn>
            ))}
          </div>
        ) : (
          // Desktop view - table
          <div className="overflow-x-auto rounded-xl shadow-lg border border-blue-200/50 bg-white">
            <Table>
              <TableHeader className="bg-blue-50/80">
                <TableRow>
                  <TableHead className="w-1/4 py-4 px-6 font-semibold text-gray-800">Feature</TableHead>
                  <TableHead className="w-1/4 py-4 px-6 text-center font-semibold text-blue-700">MyPetID</TableHead>
                  <TableHead className="w-1/4 py-4 px-6 text-center font-semibold text-gray-700">Paper Records</TableHead>
                  <TableHead className="w-1/4 py-4 px-6 text-center font-semibold text-gray-700">General Apps</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
                    <TableCell className="font-medium py-4 px-6">{row.feature}</TableCell>
                    
                    <TableCell className="text-center py-4 px-6">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(row.myPetId.value)}
                        <div className="mt-1">
                          <div className="font-medium text-blue-700">{row.myPetId.value}</div>
                          <div className="text-xs text-gray-500">{row.myPetId.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center py-4 px-6">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(row.paperRecords.value)}
                        <div className="mt-1">
                          <div className="font-medium">{row.paperRecords.value}</div>
                          <div className="text-xs text-gray-500">{row.paperRecords.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center py-4 px-6">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(row.generalApps.value)}
                        <div className="mt-1">
                          <div className="font-medium">{row.generalApps.value}</div>
                          <div className="text-xs text-gray-500">{row.generalApps.description}</div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComparisonSection;