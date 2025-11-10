import React from 'react';

const InputField = ({ label, type, name, value, onChange, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-white text-sm mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-gray-800 text-white border border-gray-400 rounded-md px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default InputField;
