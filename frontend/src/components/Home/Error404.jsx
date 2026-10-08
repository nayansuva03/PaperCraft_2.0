import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageLayout from "../comman/PageLayout";

const Error404 = () => {
    const navigate = useNavigate();

    return (
        <PageLayout>
            <div className="text-center max-w-lg mx-auto">
                <h1 className="text-8xl font-bold text-indigo-600 dark:text-indigo-500">
                    404
                </h1>

                <h2 className="text-3xl font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">
                    Page Not Found
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mb-8 text-base">
                    Oops! The page you are looking for doesn't exist, was moved, or is temporarily unavailable.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </button>
            </div>
        </PageLayout>     
    );
};

export default Error404;