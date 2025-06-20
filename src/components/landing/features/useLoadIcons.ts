
import { useMemo } from 'react';
import { 
  FileText, 
  Bell, 
  Shield, 
  Smartphone, 
  Cloud, 
  Clock, 
  Syringe, 
  Calendar, 
  Share2, 
  Users, 
  Workflow, 
  RefreshCw,
  IdCard,
  Globe,
  Zap,
  Award
} from 'lucide-react';

const useLoadIcons = () => {
  return useMemo(() => ({
    FileText,
    Bell,
    Shield,
    Smartphone,
    Cloud,
    Clock,
    Syringe,
    Calendar,
    Share2,
    Users,
    Workflow,
    RefreshCw,
    IdCard,
    Globe,
    Zap,
    Award
  }), []);
};

export default useLoadIcons;
