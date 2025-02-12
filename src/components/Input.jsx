import React from 'react';

const Input = ({ type, placeholder, icon, value, onChange }) => {
  return (
    <div className="flex items-center border rounded-lg p-2 shadow-sm">
      {icon && <span className="mr-2">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full outline-none bg-transparent"
      />
    </div>
  );
};

export default Input;

