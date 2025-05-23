'use client'
import React, { useState } from 'react';
import { useAuth, useSignUp } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Page = () => {
  const [username, setUsername] = useState('');
  const [disableUsername, setDisableUsername] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [err, setErr] = useState({
    firstName: '',
    secondName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { signUp, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Redirect if authenticated
  React.useEffect(() => {
    if (isSignedIn) {
      router.push('/chat');
    }
  }, [isSignedIn, router]);

  if (!isLoaded) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErr: typeof err = {
      firstName: '',
      secondName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    let hasErrors = false;

    // Validate each field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      newErr.email = 'Please enter a valid email address';
      hasErrors = true;
    }
    if (firstName.trim().length < 3) {
      newErr.firstName = 'Please input a valid name';
      hasErrors = true;
    }
    if (secondName.trim().length < 3) {
      newErr.secondName = 'Please input a valid name';
      hasErrors = true;
    }
    if (username.trim().length < 10) {
      newErr.username = 'Matric number must be at least 10 characters long';
      hasErrors = true;
    }
    const numberRegex = /^\d+$/;
    if (!numberRegex.test(username.trim())) {
      newErr.username = 'Please enter a valid matric number';
      hasErrors = true;
    }
    if (password.trim().length < 8) {
      newErr.password = 'Password must be at least 8 characters long';
      hasErrors = true;
    }
    if (confirmPassword.trim().length < 8) {
      newErr.confirmPassword = 'Confirm password must be at least 8 characters long';
      hasErrors = true;
    }
    if (password !== confirmPassword) {
      newErr.confirmPassword = 'Passwords must match';
      hasErrors = true;
    }

    setErr(newErr);

    if (hasErrors) {
      return;
    }
    
    setIsLoading(true);
 
    try {
      const signUpAttempt = await signUp?.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: secondName,
        username: 'Lau' + username
      });
      sessionStorage.setItem('emailForVerification', email);
      const prepareVerify = await signUpAttempt?.prepareEmailAddressVerification();
      if (prepareVerify) {
        router.push('/verify-code');
      } else {
        toast.error('Unable to connect to internet.');
      }
    } catch (error: any) {
      if (error?.errors) {
        error?.errors.forEach((err: any) => {
          setError(err.message || 'An unknown error occurred');
        });
      } else {
        toast.error('An error occurred during sign-up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="relative max-w-md w-full p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 relative mb-4">
            <Image 
              src="/favicon.png" 
              alt="School Logo" 
              width={80} 
              height={80} 
              className="object-contain"
            />
          </div>
           <h1 className="text-2xl font-bold text-white">Classroom Portal</h1>
          <p className="text-white/80 mt-1">Student Registration</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 text-red-100 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="firstName">
              First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => { err.firstName = ''; setFirstName(e.target.value) }}
              id="firstName"
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              type="text"
              placeholder="John"
            />
            {err.firstName && <p className="mt-1 text-xs text-red-300">{err.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="secondName">
              Last Name
            </label>
            <input
              value={secondName}
              onChange={(e) => { err.secondName = ''; setSecondName(e.target.value) }}
              id="secondName"
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              type="text"
              placeholder="Doe"
            />
            {err.secondName && <p className="mt-1 text-xs text-red-300">{err.secondName}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="email">
            University Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { err.email = ''; setEmail(e.target.value) }}
            id="email"
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="student@student.lautech.edu.ng"
          />
          {err.email && <p className="mt-1 text-xs text-red-300">{err.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="username">
            Matriculation Number
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => { err.username = ''; setUsername(e.target.value) }}
            id="username"
            disabled={disableUsername}
            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="1234567890"
          />
          {err.username && <p className="mt-1 text-xs text-red-300">{err.username}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { err.password = ''; setPassword(e.target.value) }}
              id="password"
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {err.password && <p className="mt-1 text-xs text-red-300">{err.password}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { err.confirmPassword = ''; setConfirmPassword(e.target.value) }}
              id="confirmPassword"
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-10"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {err.confirmPassword && <p className="mt-1 text-xs text-red-300">{err.confirmPassword}</p>}
        </div>

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
              Creating Account...
            </span>
          ) : "Register Now"}
        </Button>

        <div className="mt-6 text-center text-white/80">
          <p>Already have an account?{' '}
            <Link href="/sign-in" className="text-white font-medium hover:underline hover:text-purple-300 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Page;