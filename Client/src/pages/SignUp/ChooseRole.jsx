import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRole = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/signup/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-primary text-white">
      {/* Left Illustration */}
      <div className="hidden md:flex items-center justify-center bg-gray-900 p-10">
      </div>

      {/* Right Content */}
      <div className="flex flex-col justify-center items-center px-6 md:px-16 py-12 space-y-6">
        <h1 className="text-4xl font-bold text-center">Choose Your Role</h1>
        <p className="text-gray-300 text-center max-w-md">
          Please select the type of account you want to create to get started with the platform.
        </p>
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => handleRoleSelect('entrepreneur')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition">
            I’m a Project Creator
          </button>
          <button
            onClick={() => handleRoleSelect('investor')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition">
            I’m an Investor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
