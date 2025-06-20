
import React from 'react';
import { LucideIcon } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import FeatureCard from '../FeatureCard';

interface FeaturesListProps {
  features: {
    icon: string;
    title: string;
    description: string;
    color: string;
    gradient: string;
  }[];
  icons: Record<string, LucideIcon>;
}

const FeaturesList: React.FC<FeaturesListProps> = ({ features, icons }) => {
  return (
    <ul 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      itemScope 
      itemType="https://schema.org/ItemList"
    >
      {features.map((feature, index) => {
        const Icon = icons[feature.icon];
        
        return (
          <li 
            key={feature.title}
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            <FadeIn delay={100 + index * 50} direction="up">
              {Icon && (
                <FeatureCard 
                  icon={Icon} 
                  title={feature.title} 
                  description={feature.description} 
                  color={feature.color} 
                  gradient={feature.gradient}
                />
              )}
            </FadeIn>
          </li>
        );
      })}
    </ul>
  );
};

export default FeaturesList;