import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loading from "./Loading";
import { setSubscription } from "../../redux/slices/Subcription";

const BACKEND = import.meta.env.VITE_BACKEND_URL;

// Loads Razorpay's checkout script once
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

export default function Subscription() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState({
        text: "Activating your free trial...",
        subtext: "This will only take a moment",
    });
    const [error, setError] = useState("");

    const plans = [
        {
            name: 'Basic',
            price: '₹1',
            validity: '2 days',
            popular: false,
            features: [
                { label: '60 Tokens', included: true },
                { label: '25 Saved Services', included: true },
                { label: 'Ads Included', included: true, isAd: true },
            ],
        },
        {
            name: 'Pro',
            price: '₹2',
            validity: '2 days',
            popular: true,
            features: [
                { label: '150 Tokens', included: true },
                { label: '110 Saved Services', included: true },
                { label: 'No Ads', included: true },
            ],
        },
        {
            name: 'Ultra',
            price: '₹3',
            validity: '3 days',
            popular: false,
            features: [
                { label: '250 Tokens', included: true },
                { label: '300 Saved Services', included: true },
                { label: 'No Ads', included: true },
            ],
        },
    ];

    /* ---------------- Free trial ---------------- */
    const freeTryel = async () => {
        if (loading) return;          // ignore double clicks
        setError("");
        setLoadingText({
            text: "Activating your free trial...",
            subtext: "This will only take a moment",
        });
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND}/api/subscription/free-trial`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("error fetching the free trial api.");
                setError(data?.message || "Could not activate the free trial.");
                return;
            }

            navigate("/");
        } catch (error) {
            console.log("Error Fetching the free trial api.", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);        // runs on success, error and early return
        }
    };

    /* ---------------- Razorpay payment ---------------- */
    const handlePayment = async (planName) => {
        if (loading) return;
        setError("");
        setLoadingText({
            text: "Preparing your payment...",
            subtext: "Please wait",
        });
        setLoading(true);

        try {
            const loaded = await loadRazorpay();
            if (!loaded) {
                setError("Could not load Razorpay. Check your internet connection.");
                setLoading(false);
                return;
            }

            // 1. Create the order on the backend
            const orderRes = await fetch(`${BACKEND}/api/payment/create-order`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planName }),
            });
            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                setError(orderData?.message || "Could not create the order.");
                setLoading(false);
                return;
            }

            const { order } = orderData;

            // 2. Open Razorpay checkout
            const rzp = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "PaperCraft",
                description: `${planName} plan`,
                order_id: order.id,

                // 3. Runs after a successful payment
                handler: async (response) => {
                    setLoadingText({
                        text: "Verifying your payment...",
                        subtext: "Do not close this page",
                    });
                    setLoading(true);

                    try {
                        const verifyRes = await fetch(`${BACKEND}/api/payment/verify`, {
                            method: "POST",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plan: planName,
                            }),
                        });
                        const verifyData = await verifyRes.json();

                        if (!verifyRes.ok) {
                            setError(
                                verifyData?.message ||
                                "Payment verification failed. If money was deducted, contact support."
                            );
                            return;
                        }

                        dispatch(setSubscription(verifyData.subscription));
                        navigate("/");
                    } catch (err) {
                        console.error("Verify error:", err);
                        setError("Could not verify the payment. If money was deducted, contact support.");
                    } finally {
                        setLoading(false);
                    }
                },

                modal: {
                    // user closed the checkout without paying
                    ondismiss: () => setLoading(false),
                },
                theme: { color: "#4f46e5" },
            });

            rzp.on("payment.failed", (resp) => {
                console.error("Payment failed:", resp.error);
                setError(resp.error?.description || "Payment failed. Please try again.");
                setLoading(false);
            });

            // Hide our loader while Razorpay's modal is showing
            setLoading(false);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
            {loading && (
                <Loading
                    text={loadingText.text}
                    subtext={loadingText.subtext}
                />
            )}
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Choose Your subscription Plan
                    </h2>
                    <p className="mt-4 text-slate-600 text-lg">
                        Select the plan that fits your productivity requirements.
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="max-w-xl mx-auto mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
                        {error}
                    </div>
                )}

                {/* subscription Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl p-8 flex flex-col justify-between transition-all duration-200 border ${plan.popular
                                ? 'border-indigo-600 shadow-xl ring-2 ring-indigo-600/20'
                                : 'border-slate-200 shadow-sm hover:shadow-md'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm">
                                    Most Popular
                                </div>
                            )}

                            <div>
                                {/* Plan Title & Price */}
                                <div className="text-center pb-6 border-b border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                    <div className="mt-4 flex items-baseline justify-center">
                                        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                                            {plan.price}
                                        </span>
                                        <span className="ml-2 text-sm text-slate-500 font-medium">
                                            / {plan.validity}
                                        </span>
                                    </div>
                                </div>

                                {/* Features List */}
                                <ul className="mt-8 space-y-4">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-center gap-3">
                                            {feature.isAd ? (
                                                <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                                    !
                                                </div>
                                            ) : feature.included ? (
                                                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                            ) : (
                                                <X className="w-5 h-5 text-slate-300 flex-shrink-0" />
                                            )}
                                            <span className="text-sm font-medium text-slate-700">
                                                {feature.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Button */}
                            <div className="mt-8 pt-4">
                                <button
                                    onClick={() => handlePayment(plan.name)}
                                    disabled={loading}
                                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${plan.popular
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                                        }`}
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Free Trial Note at the bottom */}
            <div onClick={freeTryel}>
                <div className="mt-16 text-center">
                    <p className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
                        Try free trial with 10 tokens and 3 saved services.
                    </p>
                </div>
            </div>

        </div>
    );
}