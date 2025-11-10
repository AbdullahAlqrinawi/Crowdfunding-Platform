import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/helper';

export const useSignUp = () => {
  const [form, setForm] = useState({
    username: '', 
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(form.email)) {
      setError('Invalid email format');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(form.password)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, a number, and a special character');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', 
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('pendingVerificationEmail', form.email);
        navigate('/verify-otp', { state: { email: form.email } });
      } else {
        setError(data.message || 'Error creating account');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    error,
    isLoading,
    showPassword,
    showConfirmPassword,
    handleChange,
    handleSubmit,
    setShowPassword,
    setShowConfirmPassword,
  };
};