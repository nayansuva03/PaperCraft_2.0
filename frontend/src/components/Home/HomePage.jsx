import Navbar from "../comman/Navbar";
import {
    FileText,
    BookOpenText,
    MessageCircle,
    Files,
    PenTool,
    BrainCircuit,
    Target,
    Scale,
    ArrowUpRight
} from 'lucide-react';

const iconBackgrounds = {
    blue: {
        bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 group-hover:border-blue-500/40 group-hover:bg-blue-500/20',
        glow: 'group-hover:shadow-blue-500/10',
    },
    purple: {
        bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 group-hover:border-purple-500/40 group-hover:bg-purple-500/20',
        glow: 'group-hover:shadow-purple-500/10',
    },
    green: {
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/20',
        glow: 'group-hover:shadow-emerald-500/10',
    },
    orange: {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 group-hover:border-amber-500/40 group-hover:bg-amber-500/20',
        glow: 'group-hover:shadow-amber-500/10',
    },
    red: {
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 group-hover:border-rose-500/40 group-hover:bg-rose-500/20',
        glow: 'group-hover:shadow-rose-500/10',
    },
};

const options = [
    {
        title: 'Online Quiz',
        description: 'Engage with interactive test modules for quick recall assessment.',
        icon: <Target className="w-6 h-6" />,
        style: iconBackgrounds.red,
    },
    {
        title: 'Generate Maximum Questions',
        description: 'Create an extensive question bank tailored for deep content coverage.',
        icon: <Files className="w-6 h-6" />,
        style: iconBackgrounds.purple,
    },
    {
        title: 'Generate Exam Paper',
        description: 'Structure comprehensive, multi-format assessments in seconds.',
        icon: <PenTool className="w-6 h-6" />,
        style: iconBackgrounds.orange,
    },
    {
        title: 'Generate Summary',
        description: 'Distill large documents into concise key-point summaries.',
        icon: <FileText className="w-6 h-6" />,
        style: iconBackgrounds.blue,
    },
    {
        title: 'Upload Question & Get Answer',
        description: 'Get instant, structured solutions to your specific uploaded questions.',
        icon: <Scale className="w-6 h-6" />,
        style: iconBackgrounds.green,
    },
    {
        title: 'Translate Material',
        description: 'Convert study resources accurately into multiple languages.',
        icon: <BookOpenText className="w-6 h-6" />,
        style: iconBackgrounds.blue,
    },
    {
        title: 'Make Flashcards / Notes',
        description: 'Create efficient, high-retention study aids with minimal effort.',
        icon: <BrainCircuit className="w-6 h-6" />,
        style: iconBackgrounds.purple,
    },
    {
        title: 'Talk to the Material',
        description: 'Interact conversationally with your content for deep clarification.',
        icon: <MessageCircle className="w-6 h-6" />,
        style: iconBackgrounds.green,
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-300">
            <Navbar />

            {/* Background Glow Overlay */}
            <div className="relative isolate overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl opacity-50 pointer-events-none" />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    {/* Header Section */}
                    <div className="mb-12 lg:mb-16 max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-4">
                            Workspace Tools
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                            Select an Action
                        </h1>
                        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                            Choose a tool to streamline your question building, study workflow, or content interaction pipeline.
                        </p>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                className="group relative flex items-start gap-5 p-6 sm:p-7 bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl text-left transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700/80 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                                {/* Icon Container */}
                                <div className={`flex items-center justify-center rounded-xl w-14 h-14 flex-shrink-0 border transition-all duration-300 ${option.style.bg} ${option.style.glow}`}>
                                    {option.icon}
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-200">
                                        {option.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 font-normal leading-relaxed">
                                        {option.description}
                                    </p>
                                </div>

                                {/* Action Indicator Icon */}
                                <div className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </button>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}