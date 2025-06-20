
import React from 'react';
import { 
  File, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  Syringe,
  HeartPulse,
  ShieldCheck,
  Clipboard,
  Dumbbell,
  Camera
} from 'lucide-react';

interface DocumentIconProps {
  category?: string;
  fileType: string | null;
}

const DocumentIcon: React.FC<DocumentIconProps> = ({ category, fileType }) => {
  const getIconByCategory = () => {
    switch (category) {
      case 'Vaccination':
      case 'Vaccination Record':
        return { icon: <Syringe size={20} className="text-green-500" />, bgColor: 'bg-green-100' };
      case 'Medical':
      case 'Medical Report':
        return { icon: <HeartPulse size={20} className="text-red-500" />, bgColor: 'bg-red-100' };
      case 'Insurance':
      case 'Insurance Policy':
        return { icon: <ShieldCheck size={20} className="text-blue-500" />, bgColor: 'bg-blue-100' };
      case 'Registration':
      case 'Adoption Certificate':
        return { icon: <Clipboard size={20} className="text-purple-500" />, bgColor: 'bg-purple-100' };
      case 'Training':
      case 'Training Certificate':
        return { icon: <Dumbbell size={20} className="text-orange-500" />, bgColor: 'bg-orange-100' };
      case 'Photos':
        return { icon: <Camera size={20} className="text-pink-500" />, bgColor: 'bg-pink-100' };
      default:
        return getFileIconAndColor();
    }
  };

  const getFileIconAndColor = () => {
    switch (fileType) {
      case 'image/jpeg':
      case 'image/png':
        return { icon: <Image size={20} className="text-blue-500" />, bgColor: 'bg-blue-100' };
      case 'application/pdf':
        return { icon: <FileText size={20} className="text-red-500" />, bgColor: 'bg-red-100' };
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return { icon: <FileSpreadsheet size={20} className="text-green-500" />, bgColor: 'bg-green-100' };
      default:
        return { icon: <File size={20} className="text-gray-500" />, bgColor: 'bg-gray-100' };
    }
  };

  const { icon, bgColor } = getIconByCategory();

  return (
    <div className={`flex-shrink-0 p-2 rounded-md ${bgColor}`}>
      {icon}
    </div>
  );
};

export default DocumentIcon;
