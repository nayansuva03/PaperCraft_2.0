import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    User,
    Lock,
    Moon,
    Sun,
    Calendar,
    Bug,
    LogOut,
    Trash2,
    CheckCircle,
    Send
} from 'lucide-react';
import Navbar from '../comman/Navbar';
import { toggleTheme } from '../../redux/slices/themeSlice.js';

export default function AdvanceOptionPage() {
    const dispatch = useDispatch();
    // Theme now comes from Redux (shared app-wide) instead of a local,
    // disconnected useState that only ever affected this one page.
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === 'dark';

    // Form states
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [bugReport, setBugReport] = useState('');

    // Feedback messages
    const [nameSuccess, setNameSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [bugSubmitted, setBugSubmitted] = useState(false);

    const handleNameChange = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setNameSuccess(true);
        setTimeout(() => setNameSuccess(false), 3000);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) return;
        setPasswordSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordSuccess(false), 3000);
    };

    const handleBugSubmit = (e) => {
        e.preventDefault();
        if (!bugReport.trim()) return;
        setBugSubmitted(true);
        setBugReport('');
        setTimeout(() => setBugSubmitted(false), 3000);
    };

    const handleLogout = () => {
        alert('Logging out...');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
            alert('Account deletion request submitted.');
        }
    };

    // Shared card style used everywhere on this page — one place to tweak.
    const cardClass =
        'p-6 rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800';
    const inputClass =
        'w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder-slate-500';
    const labelClass =
        'block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-400';

    return (
        <>
            <Navbar />
            <div className="min-h-screen transition-colors duration-200 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

                    {/* Header */}
                    <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
                        <h1 className="text-3xl font-extrabold tracking-tight">Advanced Settings</h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Manage your profile, account preferences, security, and subscription status.
                        </p>
                    </div>

                    <div className="space-y-8">

                        {/* Section 1: Change Name */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-4">
                                <User className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-lg font-bold">Change Name</h2>
                            </div>
                            <form onSubmit={handleNameChange} className="space-y-4">
                                <div>
                                    <label className={labelClass}>New Display Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your new name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors"
                                    >
                                        Save Name
                                    </button>
                                    {nameSuccess && (
                                        <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                                            <CheckCircle className="w-4 h-4" /> Updated successfully!
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Section 2: Change Password */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-lg font-bold">Change Password</h2>
                            </div>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className={labelClass}>Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors"
                                    >
                                        Update Password
                                    </button>
                                    {passwordSuccess && (
                                        <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                                            <CheckCircle className="w-4 h-4" /> Password changed!
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Section 3: Dark Mode & Subscription Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Dark Mode Toggle — now dispatches to Redux, so it affects the whole app */}
                            <div className={`${cardClass} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    {isDark ? (
                                        <Moon className="w-5 h-5 text-indigo-400" />
                                    ) : (
                                        <Sun className="w-5 h-5 text-amber-500" />
                                    )}
                                    <div>
                                        <h3 className="font-bold text-sm">Dark Mode</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Toggle application theme
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => dispatch(toggleTheme())}
                                    aria-label="Toggle dark mode"
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isDark ? 'bg-indigo-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Subscription Info */}
                            <div className={`${cardClass} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-emerald-500" />
                                    <div>
                                        <h3 className="font-bold text-sm">Subscription Status</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Active Plan
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-slate-400 block">Expires at</span>
                                    <span className="text-sm font-bold text-emerald-500">13-Nov-2026</span>
                                </div>
                            </div>

                        </div>

                        {/* Section 4: Report a Bug */}
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-4">
                                <Bug className="w-5 h-5 text-amber-500" />
                                <h2 className="text-lg font-bold">Report a Bug</h2>
                            </div>
                            <form onSubmit={handleBugSubmit} className="space-y-4">
                                <textarea
                                    rows={4}
                                    placeholder="Describe the issue or error you encountered..."
                                    value={bugReport}
                                    onChange={(e) => setBugReport(e.target.value)}
                                    className={`${inputClass} resize-none`}
                                />
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-xl transition-colors border border-slate-700"
                                    >
                                        <Send className="w-4 h-4" /> Submit Bug Report
                                    </button>
                                    {bugSubmitted && (
                                        <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                                            <CheckCircle className="w-4 h-4" /> Report sent. Thank you!
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Section 5: Danger Zone */}
                        <div className="p-6 rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/10 space-y-4">
                            <h2 className="text-lg font-bold text-red-600 dark:text-red-500">Account Actions</h2>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600/10 border border-red-600/30 hover:bg-red-600 hover:border-red-600 text-red-500 dark:text-red-400 hover:text-white font-semibold text-sm rounded-xl transition-all"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-md"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Account
                                </button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </>
    );
}