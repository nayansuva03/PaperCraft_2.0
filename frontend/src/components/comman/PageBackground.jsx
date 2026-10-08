export default function PageBackground() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
            <style>{`
                @keyframes pc-float {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-18px); }
                }
                .pc-float      { animation: pc-float 9s ease-in-out infinite; }
                .pc-float-slow { animation: pc-float 13s ease-in-out infinite reverse; }
                @media (prefers-reduced-motion: reduce) {
                    .pc-float, .pc-float-slow { animation: none; }
                }
            `}</style>

            {/* 1. Gradient base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 dark:from-slate-950 dark:via-indigo-950/60 dark:to-slate-900" />

            {/* 2. Blurred glows */}
            <div className="absolute -top-40 -right-32 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-blue-400/40 via-indigo-400/20 to-transparent blur-3xl dark:from-blue-500/25 dark:via-indigo-500/15" />
            <div className="absolute -bottom-48 -left-40 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-sky-300/40 via-blue-300/20 to-transparent blur-3xl dark:from-sky-500/20 dark:via-blue-500/10" />
            <div className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10" />

            {/* Glassy spheres */}
            <div className="pc-float absolute top-28 right-[14%] hidden h-32 w-32 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 opacity-70 shadow-[inset_0_-8px_20px_rgba(37,99,235,0.35)] md:block dark:opacity-40" />
            <div className="pc-float-slow absolute bottom-32 left-[8%] hidden h-16 w-16 rounded-full bg-gradient-to-br from-blue-300 to-indigo-500 opacity-70 shadow-[inset_0_-6px_14px_rgba(79,70,229,0.35)] md:block dark:opacity-40" />
            <div className="absolute top-[22%] left-[12%] h-4 w-4 rounded-full bg-slate-400/30 blur-[2px]" />
            <div className="absolute bottom-[28%] right-[30%] h-5 w-5 rounded-full bg-slate-400/30 blur-[2px]" />

            {/* 3. Wavy corner shapes */}
            <svg
                className="absolute bottom-0 right-0 h-[45%] w-[55%] min-w-[420px] text-indigo-700 opacity-[0.12] dark:text-indigo-300 dark:opacity-[0.10]"
                viewBox="0 0 600 400"
                preserveAspectRatio="xMaxYMax slice"
                fill="currentColor"
            >
                <path d="M600 60 C 520 40, 470 120, 430 190 C 390 260, 330 300, 250 330 C 190 352, 100 380, 0 400 L 600 400 Z" />
            </svg>
            <svg
                className="absolute top-0 left-0 h-[35%] w-[40%] min-w-[300px] text-blue-600 opacity-[0.10] dark:text-blue-300 dark:opacity-[0.08]"
                viewBox="0 0 500 300"
                preserveAspectRatio="xMinYMin slice"
                fill="currentColor"
            >
                <path d="M0 0 L 500 0 C 470 70, 400 90, 340 130 C 270 175, 200 230, 110 250 C 60 262, 20 250, 0 240 Z" />
            </svg>

            {/* 4. Line doodles */}
            <div className="text-indigo-900/25 dark:text-indigo-200/20">
                {/* Sigma */}
                <span className="absolute top-24 left-[6%] hidden font-serif text-7xl md:block">
                    Σ
                </span>

                {/* Scatter plot */}
                <svg
                    className="absolute top-20 right-[30%] hidden h-24 w-36 lg:block"
                    viewBox="0 0 150 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                >
                    <path d="M10 5 V90 H145" />
                    <path d="M20 75 L135 22" />
                    <g fill="currentColor" stroke="none">
                        <circle cx="30" cy="68" r="2.5" />
                        <circle cx="48" cy="55" r="2.5" />
                        <circle cx="62" cy="64" r="2.5" />
                        <circle cx="78" cy="45" r="2.5" />
                        <circle cx="95" cy="40" r="2.5" />
                        <circle cx="112" cy="28" r="2.5" />
                        <circle cx="126" cy="34" r="2.5" />
                    </g>
                </svg>

                {/* Histogram + bell curve */}
                <svg
                    className="absolute bottom-16 left-[4%] hidden h-28 w-44 md:block"
                    viewBox="0 0 180 110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                >
                    <path d="M5 100 H175" />
                    <rect x="15" y="75" width="18" height="25" />
                    <rect x="37" y="45" width="18" height="55" />
                    <rect x="59" y="15" width="18" height="85" />
                    <rect x="81" y="25" width="18" height="75" />
                    <rect x="103" y="55" width="18" height="45" />
                    <rect x="125" y="80" width="18" height="20" />
                    <path d="M10 95 C 40 70, 55 10, 85 10 C 115 10, 130 70, 165 95" />
                </svg>

                {/* Pie chart */}
                <svg
                    className="absolute top-1/2 right-[4%] hidden h-24 w-24 lg:block"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                >
                    <circle cx="50" cy="50" r="42" />
                    <path d="M50 50 L50 8 M50 50 L88 68 M50 50 L18 80" />
                </svg>

                {/* Sparkles */}
                <svg className="absolute top-[38%] left-[18%] hidden h-6 w-6 md:block" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
                </svg>
                <svg className="absolute bottom-[22%] right-[22%] hidden h-5 w-5 md:block" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
                </svg>
                <svg className="absolute top-[14%] left-[42%] hidden h-4 w-4 lg:block" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
                </svg>

                {/* Dashed path */}
                <svg
                    className="absolute bottom-10 left-1/3 hidden h-24 w-80 lg:block"
                    viewBox="0 0 320 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="6 7"
                    strokeLinecap="round"
                >
                    <path d="M5 80 C 70 10, 140 110, 210 50 S 290 30, 315 55" />
                </svg>
            </div>
        </div>
    );
}