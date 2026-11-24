import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { RefreshCw, Home } from "lucide-react";
import PageLayout from "./PageLayout";

// The stamp lands once on page load. Skipped for people who prefer reduced motion.
const stampStyles = `
@keyframes sx-stamp-in {
  0%   { opacity: 0;  transform: rotate(-10deg) scale(1.8); }
  60%  { opacity: 1;  transform: rotate(-10deg) scale(0.94); }
  100% { opacity: .9; transform: rotate(-10deg) scale(1); }
}
.sx-stamp {
  opacity: .9;
  transform: rotate(-10deg);
  animation: sx-stamp-in .55s cubic-bezier(.2,.8,.2,1) .15s both;
}
@media (prefers-reduced-motion: reduce) {
  .sx-stamp { animation: none; }
}
`;

const ruledPaper = {
    backgroundImage:
        "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(99,102,241,.12) 31px, rgba(99,102,241,.12) 32px)",
};

function formatDate(date) {
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function timeAgo(date) {
    const days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    return `${days} days ago`;
}

export default function SubscriptionExpired() {
    const navigate = useNavigate();
    const { plan, expiresAt, status } = useSelector((state) => state.subscription);

    const expiryDate = expiresAt ? new Date(expiresAt) : null;
    const stillValid =
        expiryDate && expiryDate > new Date() && status !== "expired";

    // Someone with a valid plan opened this page directly, so send them home.
    if (stillValid) return <Navigate to="/" replace />;

    const isFree = plan === "Free";
    const title = isFree
        ? "Your free trial has ended"
        : plan
            ? `Your ${plan} plan has expired`
            : "Your plan has expired";

    const details = [
        plan && { label: "Plan", value: plan },
        expiryDate && {
            label: "Ended",
            value: `${formatDate(expiryDate)} (${timeAgo(expiryDate)})`,
        },
    ].filter(Boolean);

    const focusRing =
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

    return (
        <PageLayout>
            <style>{stampStyles}</style>

            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <section
                    aria-labelledby="expired-title"
                    className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                    style={ruledPaper}
                >
                    {/* Notebook margin line */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-y-0 left-10 w-px bg-rose-400/50 sm:left-14"
                    />

                    <div className="flex flex-col gap-6 py-10 pl-16 pr-6 sm:pl-24 sm:pr-10">
                        <div className="flex flex-col items-start gap-5 sm:flex-row-reverse sm:justify-between">
                            <span
                                aria-hidden="true"
                                className="sx-stamp select-none rounded-md border-4 border-double border-rose-600 px-3 py-1 text-xl font-black tracking-wide text-rose-600 dark:border-rose-400 dark:text-rose-400"
                            >
                                EXPIRED
                            </span>

                            <h1
                                id="expired-title"
                                className="font-serif text-3xl font-bold leading-tight text-slate-900 dark:text-slate-50 sm:max-w-[16ch]"
                            >
                                {title}
                            </h1>
                        </div>

                        <p className="max-w-[46ch] text-base leading-7 text-slate-600 dark:text-slate-300">
                            Renew to keep creating exam papers, quizzes, flashcards and
                            summaries. Pick the same plan again or switch to another one.
                        </p>

                        {details.length > 0 && (
                            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                                {details.map((item) => (
                                    <div key={item.label} className="contents">
                                        <dt className="text-slate-500 dark:text-slate-400">
                                            {item.label}
                                        </dt>
                                        <dd className="font-medium text-slate-900 dark:text-slate-100">
                                            {item.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => navigate("/subscription")}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 ${focusRing}`}
                            >
                                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                                Renew plan
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}