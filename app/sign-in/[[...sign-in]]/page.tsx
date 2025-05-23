'use client';

import React, { useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Page = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState({ username: '', password: '' });
  const { signIn, isLoaded } = useSignIn();
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Redirect if authenticated
  React.useEffect(() => {
    if (isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    const newErr = { username: '', password: '' };
    let hasErrors = false;

    // Validation
    if (username.trim().length < 5) { 
      newErr.username = 'Student ID must be at least 5 characters';
      hasErrors = true;
    }
    if (password.trim().length < 8) {
      newErr.password = 'Password must be at least 8 characters';
      hasErrors = true;
    }

    setErr(newErr);

    if (hasErrors) {
      return setIsLoading(false);
    }

    try {
      const attemptSignIn = await signIn?.create({
        identifier: 'Lau'+ username,
        password: password,
      });
      if (attemptSignIn) {
        toast.success('Welcome back! Redirecting...');
        setTimeout(() => {
          window.location.pathname = '/';
        }, 2000);
      } else {
        toast.error('Unable to connect. Please try again.');
      }
    } catch (error: any) {
      if (error?.errors) {
        error.errors.forEach((err: any) => {
          toast.error(err.message || 'Login failed. Please check your credentials.');
        });
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center  p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-teal-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <form 
        onSubmit={handleSubmit}
        className="relative max-w-md w-full p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20"
      >
        {/* Portal Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 relative mb-4 bg-white/20 p-3 rounded-full">
            <Image 
              src="/favicon.png" 
              alt="Classroom Portal" 
              width={64} 
              height={64} 
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Classroom Portal</h1>
          <p className="text-white/80 mt-1">Student Sign In</p>
        </div>

        {/* Student ID Field */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="username">
            Student ID
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setErr((prev) => ({ ...prev, username: '' })); }}
            id="username"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="Enter your student ID"
          />
          {err.username && <p className="mt-1 text-xs text-red-300">{err.username}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErr((prev) => ({ ...prev, password: '' })); }}
              id="password"
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {err.password && <p className="mt-1 text-xs text-red-300">{err.password}</p>}
        </div>

        {/* Sign In Button */}
        <Button 
          type="submit" 
          disabled={isloading}
          className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
        >
          {isloading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </span>
          ) : "Sign In"}
        </Button>

        {/* Forgot Password Link */}
        <div className="mt-4 text-right">
          <Link 
            href="/forgot-password" 
            className="text-sm text-white/80 hover:text-white hover:underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-transparent text-sm text-white/50">New to Classroom Portal?</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <Link 
            href="/sign-up" 
            className="text-white font-medium hover:underline hover:text-blue-200 transition-colors"
          >
            Create Student Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Page;