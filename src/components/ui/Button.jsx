import React from 'react';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  isLoading = false,
  className = '',
  ...props 
}) => {
  const baseClass = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${isLoading ? 'btn-loading' : ''} ${className}`;
  
  return (
    <button className={baseClass.trim()} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className="loader"></span> : null}
      <span className="btn-content">{children}</span>
    </button>
  );
};
