import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useSignUp } from './useSignUp';
import { logo } from '../../assets';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const {
    form,
    error,
    isLoading,
    showPassword,
    showConfirmPassword,
    handleChange,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
  } = useSignUp();

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const navigate = useNavigate();


  const [showValidation, setShowValidation] = useState(false);

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    handleChange(e);

    setShowValidation(value.length > 0);

    setPasswordValidation({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-start pt-12 px-4">
      <img
        src={logo}
        alt="Sparkit Logo"
        className="w-[150px] sm:w-[180px] md:w-[200px] object-contain"
      />

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        {/* Full Name */}
        <div>
          <label className="block mb-1 text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            minLength="3"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handlePasswordChange}
              required
              minLength="8"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          {showValidation && (
            <div className="mt-2 space-y-1 text-sm animate-fadeIn">
              <PasswordRequirement
                label="At least 8 characters"
                valid={passwordValidation.length}
              />
              <PasswordRequirement
                label="At least one uppercase letter"
                valid={passwordValidation.uppercase}
              />
              <PasswordRequirement
                label="At least one number"
                valid={passwordValidation.number}
              />
              <PasswordRequirement
                label="At least one special character (!@#$%^&*)"
                valid={passwordValidation.specialChar}
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 rounded text-white font-semibold ${isLoading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        <p className="mt-4 text-sm text-gray-300">
  Already have an account?{' '}
  <button
    type="button"
    onClick={() => navigate('/login')}
    className="text-indigo-400 hover:underline"
  >
    Sign In
  </button>
</p>

      </form>
    </div>
  );
};

const PasswordRequirement = ({ label, valid }) => (
  <div className="flex items-center space-x-2">
    {valid ? (
      <CheckCircleIcon className="w-4 h-4 text-green-400" />
    ) : (
      <XCircleIcon className="w-4 h-4 text-gray-400" />
    )}
    <span className={`${valid ? 'text-green-400' : 'text-gray-400'}`}>{label}</span>
  </div>
);
