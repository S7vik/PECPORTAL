import React from 'react';

const Button = ({ type = 'button', className, children, ...props }) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
