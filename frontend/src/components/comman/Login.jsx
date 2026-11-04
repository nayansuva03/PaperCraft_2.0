import React, { useState, useRef } from 'react';
import { Mail, Lock, User, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setUser } from "../../redux/slices/userSlice";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState('auth'); // 'auth' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    // 'idle' | 'checking' | 'success' | 'error' -> drives the box coloring/animation
    const [otpStatus, setOtpStatus] = useState('idle');
    const otpRefs = useRef([]);

    // Refs for enter-to-next-field navigation
    const loginRefs = useRef([]);
    const signupRefs = useRef([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const resetFormState = () => {
        setError('');
        setOtp(['', '', '', '', '', '']);
        setOtpStatus('idle');
        setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    };

    // ---- Enter-key navigation helper ----
    // Pressing Enter moves focus to the next field in the form instead of
    // submitting. Only when the LAST field is focused does Enter fall through
    // to the browser's native submit behavior (which then hits our existing
    // "fill in all fields" validation inside handleLoginSubmit/handleSignUpSubmit).
    const handleFieldKeyDown = (e, refsArray, index) => {
        if (e.key !== 'Enter') return;

        const isLast = index === refsArray.current.length - 1;
        if (!isLast) {
            e.preventDefault();
            refsArray.current[index + 1]?.focus();
        }
        // If it IS the last field, we do nothing here and let the native
        // Enter-submits-form behavior fire -> handleLoginSubmit/handleSignUpSubmit
        // still validates that every field is filled before doing anything.
    };

    // Updated OTP Input Handlers
    const handleOtpChange = (index, value) => {
        const digit = value.slice(-1); // Takes last entered character (allows overwriting)

        // Allow empty string (deletion) or single digit only
        if (digit !== '' && !/^\d$/.test(digit)) return;

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);
        setError('');
        setOtpStatus('idle');

        // Move to next field if a digit was entered
        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-verify the moment the 6th (last) digit is filled in
        if (digit && index === 5 && newOtp.every((d) => d !== '')) {
            otpRefs.current[5]?.blur();
            handleVerifyOtp(null, newOtp);
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                otpRefs.current[index - 1]?.focus();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const isAllFilled = otp.every((digit) => digit !== '');

            if (isAllFilled) {
                handleVerifyOtp(e);
            } else {
                const nextEmptyIndex = otp.findIndex((digit) => digit === '');
                if (nextEmptyIndex !== -1) {
                    otpRefs.current[nextEmptyIndex]?.focus();
                }
            }
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtp(digits);
            setOtpStatus('idle');
            otpRefs.current[5]?.focus();
            handleVerifyOtp(null, digits);
        }
    };

    // Auth Submit Handlers
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            dispatch(setUser(data.user));
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = formData;

        if (
            !firstName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            setError("Please fill in all fields");
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
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
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            setStep('otp');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // handleVerifyOtp now accepts an optional otpArray so it can be called
    // programmatically (auto-verify / paste) with the freshly computed digits,
    // instead of relying on the (possibly stale) `otp` state value.
    const handleVerifyOtp = async (e, otpArray) => {
        if (e && e.preventDefault) e.preventDefault();

        const digits = otpArray || otp;
        const enteredOtp = digits.join("");

        if (enteredOtp.length < 6) {
            setError("Please enter all 6 digits of the OTP");
            return;
        }

        setLoading(true);
        setOtpStatus('checking');

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-signup`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        formData,
                        otp: enteredOtp,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Flash the boxes green, then move on
            setOtpStatus('success');
            dispatch(setUser(data.user));

            setTimeout(() => {
                setStep("auth");
                resetFormState();
                navigate("/subscription");
            }, 500);

        } catch (error) {
            // Flash the boxes red, then clear them so the user can retry
            setOtpStatus('error');
            setError(error.message);

            setTimeout(() => {
                setOtp(['', '', '', '', '', '']);
                setOtpStatus('idle');
                otpRefs.current[0]?.focus();
            }, 900);
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-signup-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }
            alert('OTP successfully resent.');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-400 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
                {/* Header / Step Navigation */}
                {step === 'otp' ? (
                    <div className="mb-6 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setStep('auth');
                                setError('');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-4"
                        >
                            <ArrowLeft size={16} /> Back to {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                        <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                            <KeyRound size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            We've sent a 6-digit OTP code to{' '}
                            <span className="font-semibold text-gray-700">{formData.email}</span>
                        </p>
                    </div>
                ) : (
                    /* Tab Toggle */
                    <div className="flex gap-3 mb-7 bg-gray-100 p-1.5 rounded-lg">
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                resetFormState();
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${isLogin
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'bg-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                resetFormState();
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${!isLogin
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'bg-transparent text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="flex items-center gap-3 p-3 mb-5 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm animate-shake">
                        <AlertCircle size={18} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* STEP 1: Main Auth Forms */}
                {step === 'auth' && (
                    <>
                        {isLogin ? (
                            <form onSubmit={handleLoginSubmit} className="space-y-4 mb-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg transition-all focus-within:bg-gray-100 focus-within:border-indigo-600">
                                        <Mail size={20} className="text-gray-400 flex-shrink-0" />
                                        <input
                                            ref={(el) => (loginRefs.current[0] = el)}
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleFieldKeyDown(e, loginRefs, 0)}
                                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        Password
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg transition-all focus-within:bg-gray-100 focus-within:border-indigo-600">
                                        <Lock size={20} className="text-gray-400 flex-shrink-0" />
                                        <input
                                            ref={(el) => (loginRefs.current[1] = el)}
                                            type="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleFieldKeyDown(e, loginRefs, 1)}
                                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 text-sm"
                                >
                                    {loading ? 'Logging in...' : 'Log In'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSignUpSubmit} className="space-y-4 mb-6">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                            First Name
                                        </label>
                                        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-gray-100 focus-within:border-indigo-600">
                                            <User size={18} className="text-gray-400 flex-shrink-0" />
                                            <input
                                                ref={(el) => (signupRefs.current[0] = el)}
                                                type="text"
                                                name="firstName"
                                                placeholder="First name"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => handleFieldKeyDown(e, signupRefs, 0)}
                                                className="flex-1 min-w-0 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                            Last Name(optional)
                                        </label>
                                        <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-gray-100 focus-within:border-indigo-600">
                                            <User size={18} className="text-gray-400 flex-shrink-0" />
                                            <input
                                                ref={(el) => (signupRefs.current[1] = el)}
                                                type="text"
                                                name="lastName"
                                                placeholder="Last name"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => handleFieldKeyDown(e, signupRefs, 1)}
                                                className="flex-1 min-w-0 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-gray-100 focus-within:border-indigo-600">
                                        <Mail size={20} className="text-gray-400 flex-shrink-0" />
                                        <input
                                            ref={(el) => (signupRefs.current[2] = el)}
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleFieldKeyDown(e, signupRefs, 2)}
                                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        Set Password
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-gray-100 focus-within:border-indigo-600">
                                        <Lock size={20} className="text-gray-400 flex-shrink-0" />
                                        <input
                                            ref={(el) => (signupRefs.current[3] = el)}
                                            type="password"
                                            name="password"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleFieldKeyDown(e, signupRefs, 3)}
                                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                                        Confirm Password
                                    </label>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg focus-within:bg-gray-100 focus-within:border-indigo-600">
                                        <Lock size={20} className="text-gray-400 flex-shrink-0" />
                                        <input
                                            ref={(el) => (signupRefs.current[4] = el)}
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleFieldKeyDown(e, signupRefs, 4)}
                                            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 text-sm"
                                >
                                    {loading ? 'Sending Code...' : 'Sign Up'}
                                </button>
                            </form>
                        )}

                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-gray-400 text-xs uppercase tracking-wide">Or</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        {/* Styled Google Login Container */}
                        <div className="flex justify-center w-full [&>div]:w-full [&>div>iframe]:mx-auto">
                            <GoogleLogin
                                width="384"
                                theme="outline"
                                shape="rectangular"
                                onSuccess={async (credentialResponse) => {
                                    try {
                                        const response = await fetch(
                                            `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                credentials: "include",
                                                body: JSON.stringify({
                                                    credential: credentialResponse.credential,
                                                }),
                                            }
                                        );

                                        const data = await response.json();

                                        if (!response.ok) {
                                            throw new Error(data.message);
                                        }

                                        dispatch(setUser(data.user));
                                        navigate("/");

                                    } catch (error) {
                                        console.error(error);
                                        setError(error.message);
                                    }
                                }}
                                onError={() => {
                                    console.error("Google Login Failed");
                                    setError("Google sign-in failed. Please try again.");
                                }}
                            />
                        </div>
                    </>
                )}

                {/* STEP 2: 6-Digit OTP Form */}
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
                                    disabled={loading || otpStatus === 'success'}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    className={`w-11 h-12 text-center text-xl font-bold rounded-lg outline-none border-2 transition-all duration-300 ${otpStatus === 'success'
                                            ? 'bg-green-50 border-green-500 text-green-700 animate-otp-success'
                                            : otpStatus === 'error'
                                                ? 'bg-red-50 border-red-500 text-red-600 animate-shake'
                                                : 'bg-gray-50 border-gray-300 text-gray-900 focus-within:bg-white focus-within:border-indigo-600 focus-within:shadow-md'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold uppercase tracking-wider rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 text-sm"
                        >
                            {otpStatus === 'checking'
                                ? 'Verifying OTP...'
                                : otpStatus === 'success'
                                    ? 'Verified!'
                                    : 'Verify OTP'}
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

                {/* Footer Switch Button */}
                {step === 'auth' && (
                    <p className="text-center text-sm text-gray-600 mt-5">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(false);
                                        resetFormState();
                                    }}
                                    className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                                >
                                    Sign up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(true);
                                        resetFormState();
                                    }}
                                    className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                                >
                                    Log in
                                </button>
                            </>
                        )}
                    </p>
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
                @keyframes otp-success {
                    0% { transform: scale(1); }
                    40% { transform: scale(1.12); }
                    100% { transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.5s ease-out; }
                .animate-shake { animation: shake 0.4s ease-in-out; }
                .animate-otp-success { animation: otp-success 0.35s ease-in-out; }
            `}</style>
        </div>
    );
}