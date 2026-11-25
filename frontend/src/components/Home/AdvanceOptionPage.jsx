import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Lock, KeyRound } from 'lucide-react';
import PageLayout from "../comman/PageLayout.jsx";

export default function AdvanceOptionPage() {
    // Comes from the backend (/api/auth/me, login, google login) -> Redux.
    // true  = the user has a password saved in MongoDB -> show "Change Password"
    // false = Google-only account                       -> show "Add Password"
    const hasPassword = useSelector((state) => state.user.hasPassword);

    // Form states (display only for now)
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // TODO: not connected to the backend yet.
    const handleAddPassword = (e) => {
        e.preventDefault();
    };

    // TODO: not connected to the backend yet.
    const handleChangePassword = (e) => {
        e.preventDefault();
    };

    const cardClass =
        'p-6 rounded-2xl border bg-white border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800';
    const inputClass =
        'w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder-slate-500';
    const labelClass =
        'block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-600 dark:text-slate-400';
    const buttonClass =
        'px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors';

    return (
        <PageLayout>
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

                {/* Header */}
                <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <h1 className="text-3xl font-extrabold tracking-tight">Advanced Settings</h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Manage how you sign in to your account.
                    </p>
                </div>

                <div className="space-y-8">

                    {hasPassword ? (
                        /* User already has a password -> Change Password */
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-lg font-bold">Change Password</h2>
                            </div>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className={labelClass}>Current Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={inputClass}
                                        autoComplete="current-password"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={inputClass}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Confirm New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={inputClass}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <button type="submit" className={buttonClass}>
                                    Update Password
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Google-only user (no password in MongoDB) -> Add Password */
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-4">
                                <KeyRound className="w-5 h-5 text-indigo-500" />
                                <h2 className="text-lg font-bold">Add Password</h2>
                            </div>
                            <form onSubmit={handleAddPassword} className="space-y-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    You currently sign in with Google. Add a password to also log in with your email.
                                </p>
                                <div>
                                    <label className={labelClass}>New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Create a password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={inputClass}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={inputClass}
                                        autoComplete="new-password"
                                    />
                                </div>
                                <button type="submit" className={buttonClass}>
                                    Add Password
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </main>
        </PageLayout>
    );
}