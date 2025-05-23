'use client'

import { Button } from "@/components/ui/button";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { Eye, EyeOff } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, SyntheticEvent } from "react";

const ForgotPassword: NextPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [err, setErr] = useState({ password: '', confirmPassword: '' });
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [complete, setComplete] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const { signIn, isLoaded, setActive } = useSignIn();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    // Redirect if authenticated
    React.useEffect(() => {
        if (isSignedIn) {
            router.push('/');
        }
    }, [isSignedIn, router]);

    if (!isLoaded) {
        return null;
    }

    async function requestResetCode(e: SyntheticEvent) {
        e.preventDefault();
        setIsLoading(true);
        await signIn?.create({
            strategy: 'reset_password_email_code',
            identifier: email
        }).then(_ => {
            setError('');
            setSuccessfulCreation(true);
            setIsLoading(false);
        }).catch(error => {
            setError(error?.errors[0]?.longMessage);
            setIsLoading(false);
        });
    }

    async function verifyCode(e: SyntheticEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        await signIn?.attemptFirstFactor({
            strategy: 'reset_password_email_code',
            code
        })
        .then(res => {
            if (res.status === 'needs_second_factor') {
                setSecondFactor(true);
            } else if (res.status === 'needs_new_password') {
                setIsCodeVerified(true);
                setIsLoading(false);
            }
        })
        .catch(error => {
            setError(error?.errors[0]?.longMessage);
            setIsLoading(false);
        });
    }

    async function resetPassword(e: SyntheticEvent) {
        e.preventDefault();
        const newErr: typeof err = {
            password: '',
            confirmPassword: '',
        };
    
        let hasErrors = false;
    
        if (password.trim().length < 8) {
            newErr.password = 'Password must be at least 8 characters';
            hasErrors = true;
        }
        if (confirmPassword.trim().length < 8) {
            newErr.confirmPassword = 'Confirm password must be at least 8 characters';
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
        await signIn?.resetPassword({
            password
        })
        .then(res => {
            if (res.status === 'needs_second_factor') {
                setSecondFactor(true);
            } else if (res.status === 'complete') {
                setActive({ session: res.createdSessionId });
                setComplete(true);
                setIsLoading(false);
            }
        })
        .catch(error => {
            setError(error?.errors[0]?.longMessage);
            setIsLoading(false);
        });
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-teal-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-md w-full p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
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
                    <h1 className="text-2xl font-bold text-white">
                        {successfulCreation && !complete 
                            ? (isCodeVerified ? 'Set New Password' : 'Verify Code') 
                            : (!complete ? 'Reset Password' : 'Password Changed')}
                    </h1>
                    <p className="text-white/80 mt-1">
                        {complete ? 'Successfully updated your password' : 'Classroom Portal Account'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 text-red-100 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {secondFactor && (
                    <div className="mb-4 p-3 bg-yellow-500/20 text-yellow-100 rounded-lg text-center">
                        Two-factor authentication required (not implemented in this UI)
                    </div>
                )}

                {!complete ? (
                    <form onSubmit={!successfulCreation ? requestResetCode : (isCodeVerified ? resetPassword : verifyCode)}>
                        {!successfulCreation && (
                            <>
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="email">
                                        Email Address
                                    </label>
                                    <input
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(''); }}
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="student@school.edu"
                                        required
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending Code...
                                        </span>
                                    ) : "Send Reset Code"}
                                </Button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/20"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-2 bg-transparent text-sm text-white/50">Remember your password?</span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <Link 
                                        href="/sign-in" 
                                        className="text-white font-medium hover:underline hover:text-blue-200 transition-colors"
                                    >
                                        Sign In Instead
                                    </Link>
                                </div>
                            </>
                        )}

                        {successfulCreation && !isCodeVerified && (
                            <>
                                <div className="mb-5">
                                    <p className="text-green-300 mb-4 text-center">
                                        Verification code sent to your email
                                    </p>
                                    <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="code">
                                        Verification Code
                                    </label>
                                    <input
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        type="text"
                                        id="code"
                                        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                                        placeholder="Enter 6-digit code"
                                        required
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : "Verify Code"}
                                </Button>
                            </>
                        )}

                        {isCodeVerified && (
                            <>
                                <div className="mb-5">
                                    <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="password">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setErr(prev => ({ ...prev, password: '' })); }}
                                            id="password"
                                            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-10"
                                            placeholder="Enter new password"
                                            required
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

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="confirmPassword">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value); setErr(prev => ({ ...prev, confirmPassword: '' })); }}
                                            id="confirmPassword"
                                            className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-10"
                                            placeholder="Confirm new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {err.confirmPassword && <p className="mt-1 text-xs text-red-300">{err.confirmPassword}</p>}
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : "Update Password"}
                                </Button>
                            </>
                        )}
                    </form>
                ) : (
                    <div className="text-center">
                        <div className="mb-6 p-4 bg-green-500/20 text-green-100 rounded-lg">
                            <p className="font-medium">Password successfully updated!</p>
                            <p className="text-sm mt-1">You can now sign in with your new password</p>
                        </div>
                        <Link 
                            href="/sign-in" 
                            className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all hover:scale-[1.02] shadow-lg"
                        >
                            Continue to Sign In
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;