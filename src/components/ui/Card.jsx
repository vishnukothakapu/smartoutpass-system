import React from 'react';
import './Card.css';

export const Card = ({ children, className = '', onClick, hoverable = false }) => {
  const classes = `card ${hoverable ? 'card-hoverable' : ''} ${className}`;
  return (
    <div className={classes.trim()} onClick={onClick}>
      {children}
    </div>
  );
};
