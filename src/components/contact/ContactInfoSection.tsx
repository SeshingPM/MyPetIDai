
import React from 'react';
import { Mail } from "lucide-react";
import { CardHeader, CardContent } from "@/components/ui/card";

const ContactInfoSection: React.FC = () => {
  return (
    <>
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Contact Information
        </h2>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="flex items-start gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-1">Email Us</h3>
            <a 
              href="mailto:support@mypetid.ai" 
              className="text-primary hover:text-primary/80 block transition-colors font-medium"
            >
              support@mypetid.ai
            </a>
            <p className="text-sm text-gray-500 mt-2">
              8-hour response time
            </p>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ContactInfoSection;