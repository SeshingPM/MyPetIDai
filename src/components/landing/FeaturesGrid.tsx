
import React from 'react';
import FeaturesHeader from './features/FeaturesHeader';
import FeaturesList from './features/FeaturesList';
import { features } from './features/featuresData';
import useLoadIcons from './features/useLoadIcons';

interface FeaturesGridProps {
  showCta?: boolean;
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ showCta = true }) => {
  const icons = useLoadIcons();

  return (
    <div className="container-max">
      <FeaturesHeader />
      
      <FeaturesList features={features} icons={icons} />
    </div>
  );
};

export default FeaturesGrid;