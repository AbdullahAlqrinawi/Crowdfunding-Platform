import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logo } from "../../assets";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); 
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col items-center justify-start pt-12 px-4">
      {/* الشعار */}
      <img
        src={logo}
        alt="Sparkit Logo"
        className="w-[150px] sm:w-[180px] md:w-[200px] object-contain"
      />

      {/* الفورم */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {/* حقل الإيميل */}
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

        {/* حقل كلمة السر مع زر إظهار/إخفاء */}
        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* رسالة الخطأ */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* الرابط للتسجيل */}
        <p className="mt-4 text-sm text-gray-300">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-indigo-400 hover:underline"
          >
            Sign Up
          </button>
        </p>

        {/* زر الدخول */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 rounded text-white font-semibold ${
            isLoading ? 'bg-gray-600' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};
