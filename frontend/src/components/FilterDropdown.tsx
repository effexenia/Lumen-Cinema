import React from 'react';

interface FilterDropdownProps {
  label: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label }) => {
  return (
    <select className="filter-dropdown">
      <option>{label}</option>
    </select>
  );
};

export default FilterDropdown;
