import React from 'react';
import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = '#3B82F6' 
}) => {
  return (
    <div className={`loading-spinner loading-spinner--${size}`} style={{ borderTopColor: color }}>
      <div className="loading-spinner__inner"></div>
    </div>
  );
};

export default LoadingSpinner; 