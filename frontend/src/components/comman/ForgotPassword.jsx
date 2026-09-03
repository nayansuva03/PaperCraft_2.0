import React, { useState, useRef } from 'react';
import { Mail, Lock, AlertCircle, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
    // Steps: 'email' | 'otp' | 'reset' | 'success'
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const otpRefs = useRef([]);

    const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

    // OTP Handlers
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtp(digits);
            otpRefs.current[5]?.focus();
        }
    };

    // Step 1: Send Request
    const handleSendOtp = (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({email}),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }
        setLoading(false);
        setStep('otp');
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');

        if (enteredOtp.length < 6) {
            setError('Please enter all 6 digits of the OTP');
            return;
        }

        setLoading(true);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-forgot-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    otp: enteredOtp,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }
        setLoading(false);        
        setStep('reset');
    };

    // Step 3: Reset Password
    const handleResetPassword = (e) => {
        e.preventDefault();
        setError('');

        if (!password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }
        setLoading(false);    
        setStep('success');
    };

    const resendOTP = () => {
        setLoading(true);
        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-forgot-password-otp`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }
        setLoading(false);
        alert('Resended The OTP.')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="text-center mb-6">
                    {step !== 'success' && (
                        <button
                            type="button"
                            onClick={() => {
                                setError('');
                                if (step === 'otp') setStep('email');
                                else if (step === 'reset') setStep('otp');
                                else alert('Navigate back to login page');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-3"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    )}

                    <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                        {step === 'success' ? (
                            <CheckCircle2 size={24} className="text-green-600" />
                        ) : step === 'otp' ? (
                            <KeyRound size={24} />
                        ) : (
                            <Lock size={24} />
                        )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                        {step === 'email' && 'Forgot Password?'}
                        {step === 'otp' && 'OTP Verification'}
                        {step === 'reset' && 'Reset Password'}
                        {step === 'success' && 'Password Changed!'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {step === 'email' && "No worries, we'll send you reset instructions."}
                        {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
                        {step === 'reset' && 'Create a new secure password for your account.'}
                        {step === 'success' && 'Your password has been successfully updated.'}
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-3 p-3 mb-5 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm animate-shake">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* STEP 1: Enter Email */}
                {step === 'email' && (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                Email Address
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-gray-100 focus-within:border-indigo-600">
                                <Mail size={20} className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="email"
                                    placeholder="Enter registered email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 text-sm"
                        >
                            {loading ? 'Sending Code...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* STEP 2: Verify 6-digit OTP */}
                {step === 'otp' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div className="flex justify-between items-center gap-2 my-4" onPaste={handleOtpPaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (otpRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    className="w-11 h-12 text-center text-xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-white focus-within:border-indigo-600 focus-within:shadow-md outline-none transition-all"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 text-sm"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>

                        <p className="text-center text-xs text-gray-600">
                            Didn't receive code?{' '}
                            <button
                                type="button"
                                onClick={resendOTP}
                                className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                            >
                                Resend OTP
                            </button>
                        </p>
                    </form>
                )}

                {/* STEP 3: Enter New Password */}
                {step === 'reset' && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                New Password
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-gray-100 focus-within:border-indigo-600">
                                <Lock size={20} className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                Confirm New Password
                            </label>
                            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-gray-100 focus-within:border-indigo-600">
                                <Lock size={20} className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setError('');
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 text-sm"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {/* STEP 4: Success Message */}
                {step === 'success' && (
                    <div className="text-center space-y-4">
                        <button
                            type="button"
                            onClick={() => alert('Redirecting to login page...')}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5 text-sm"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .animate-shake { animation: shake 0.4s ease-in-out; }
            `}</style>
        </div>
    );
}
