import React from 'react';

interface MaterialIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({ name, className = '', style, onClick }) => {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={style}
      onClick={onClick}
    >
      {name}
    </span>
  );
};

