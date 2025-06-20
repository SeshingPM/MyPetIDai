
import React from 'react';
import FilterItem from '../FilterItem';

interface SortItemProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const SortItem: React.FC<SortItemProps> = (props) => {
  return <FilterItem {...props} />;
};

export default SortItem;
