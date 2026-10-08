import PageLayout from "../comman/PageLayout";
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
import { useSelector } from "react-redux";

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
    const userName = useSelector((state) => state.user.firstName);

    return (
            <PageLayout>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    {/* Header Section */}
                    <div className="mb-12 lg:mb-16 max-w-3xl mx-auto flex flex-col items-center text-center">
                        <div className="flex items-baseline justify-center gap-1.5 text-3xl sm:text-4xl md:text-5xl">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">
                                Hi,
                            </span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {userName}
                            </span>
                        </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                className="group relative flex items-start gap-5 p-6 sm:p-7 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl border border-white/60 dark:border-slate-700/50 rounded-2xl text-left shadow-sm shadow-indigo-900/5 transition-all duration-300 hover:bg-white/90 dark:hover:bg-slate-900/80 hover:border-indigo-200 dark:hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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
            </PageLayout>
    );
}