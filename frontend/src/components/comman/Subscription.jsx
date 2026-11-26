import { useDispatch } from "react-redux";
import { setSubscription } from "../../redux/slices/Subcription"; 

const dispatch = useDispatch();

const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const handlePayment = async (planName) => {
    if (loading) return;
    setLoading(true);
    try {
        const loaded = await loadRazorpay();
        if (!loaded) throw new Error("Razorpay SDK failed to load");

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: planName }),
        });
        const { order } = await res.json();
        if (!res.ok) throw new Error("Could not create order");

        const rzp = new window.Razorpay({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "PaperCraft",
            description: `${planName} plan`,
            order_id: order.id,
            handler: async (response) => {
                const verifyRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/verify`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...response, plan: planName }),
                });
                const data = await verifyRes.json();
                if (verifyRes.ok) {
                    dispatch(setSubscription(data.subscription));
                    navigate("/");
                } else {
                    alert("Payment verification failed. Contact support.");
                }
            },
            modal: { ondismiss: () => setLoading(false) },
            theme: { color: "#4f46e5" },
        });

        rzp.on("payment.failed", () => setLoading(false));
        rzp.open();
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};