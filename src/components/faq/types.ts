
import { LucideIcon } from 'lucide-react';

export interface FAQCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  count: number;
  color?: string;
}

export interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
  category: string;
  keywords?: string[];
}