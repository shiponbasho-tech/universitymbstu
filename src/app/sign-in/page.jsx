'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log(data)

      if (data.success) {
        toast.success(data.message || 'Signed in successfully!');
        
        if (data.token) {
          localStorage.setItem('token', JSON.stringify(data.token));
        }

        // Dynamically routes to /d/student, /d/admin, /d/teacher, etc.
        if (data.user?.userType) {
          router.push(`/d`);
        } 
      } else {
        toast.error(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="w-full relative max-w-md p-8 bg-white rounded-2xl shadow-lg"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={formVariants} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              className="relative"
            >
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all outline-none"
                placeholder="Enter your email"
                name="email"
              />
            </motion.div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1 flex items-center"
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={formVariants} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <motion.div
              variants={inputVariants}
              whileFocus="focus"
              className="relative"
            >
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all outline-none"
                placeholder="Enter your password"
                name="password"
              />
            </motion.div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1 flex items-center"
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          <motion.button
            variants={formVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </motion.button>

          <div className="rounded-lg font-semibold text-sm flex justify-center items-center gap-2 text-gray-700">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-indigo-800 text-base hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SigninForm;