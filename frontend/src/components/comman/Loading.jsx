import React from 'react';

export default function Loading({
    text = 'Loading...',
    subtext = 'Please wait while we process your request',
    fullScreen = true
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm z-50 transition-all ${fullScreen ? 'fixed inset-0 min-h-screen' : 'w-full h-full min-h-[300px] rounded-2xl'
                }`}
        >
            <div className="bg-white/95 dark:bg-slate-800/95 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center max-w-sm w-full mx-auto">

                {/* Spinner Animation */}
                <div className="relative w-16 h-16 mb-5">
                    {/* Outer glowing pulsing ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>

                    {/* Static track */}
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-slate-700"></div>

                    {/* Spinning active indicator */}
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
                </div>

                {/* Text Content */}
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                    {text}
                </h3>

                {subtext && (
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-normal">
                        {subtext}
                    </p>
                )}

                {/* Animated Loading Dots Bar */}
                <div className="mt-6 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-[bounce_1s_infinite_100ms]"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-[bounce_1s_infinite_200ms]"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-[bounce_1s_infinite_300ms]"></span>
                </div>

            </div>
        </div>
    );
}