import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { setUser, clearUser } from "./redux/slices/userSlice.js";
import { setSubscription, clearSubscription } from "./redux/slices/Subcription.js";
import { setTheme } from "./redux/slices/themeSlice.js";
import { useNavigate, useLocation } from "react-router-dom";

import Login from "./components/comman/Login.jsx";
import Loading from "./components/comman/Loading.jsx";
import SubscriptionExpired from "./components/comman/SubscriptionExpired.jsx";
import Subscription from "./components/comman/Subscription.jsx";
import HomePage from "./components/Home/HomePage.jsx";
import SavedServicesPage from "./components/Home/SavedServicesPage.jsx";
import AboutUsPage from "./components/Home/AboutUsPage.jsx";
import AdvanceOptionPage from "./components/Home/AdvanceOptionPage.jsx";
import Error404 from "./components/Home/Error404.jsx";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [appLoading, setAppLoading] = useState(true);
  const theme = useSelector((state) => state.theme.theme);

  // Keep the <html> element's "dark" class in sync with Redux theme state.
  // This is what actually makes every Tailwind `dark:` class in the app work.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  

  // Only auto-follow the OS theme if the user hasn't picked one manually.
  function setupTheme() {
    if (!window.matchMedia) return;

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const hasStoredPreference = localStorage.getItem("theme");

    if (!hasStoredPreference) {
      dispatch(setTheme(query.matches ? "dark" : "light"));
    }

    const listener = (e) => {
      if (!localStorage.getItem("theme")) {
        dispatch(setTheme(e.matches ? "dark" : "light"));
      }
    };
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }


  async function knowSbcription() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscription/know-subscription`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      // User has no subscription
      if (response.status === 409) {
        dispatch(clearSubscription());
        navigate("/subscription", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch subscription");
      }

      const subscription = data.subscription;

      dispatch(setSubscription(subscription));

      // Check whether subscription has expired
      const isExpired =
        subscription.status === "expired" ||
        (subscription.expiresAt &&
          new Date(subscription.expiresAt) <= new Date());

      if (
        isExpired &&
        location.pathname !== "/subscription"
      ) {
        navigate("/subscription-expired", { replace: true });
      }

    } catch (error) {
      console.error("Failed to fetch subscription details:", error);
    }
  }

  async function checkAuth() {
    try {
      let response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      let data = await response.json();

      if (response.status === 401) {
        const refreshResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshResponse.ok) {
          dispatch(clearUser());
          navigate("/register");
          return false;
        }

        response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            credentials: "include",
          }
        );

        data = await response.json();
      }

      if (!response.ok) {
        dispatch(clearUser());
        navigate("/register");
        return false;
      }

      dispatch(setUser(data.user));

      return true;

    } catch (error) {
      console.error("Authentication check failed:", error);

      dispatch(clearUser());
      navigate("/register");

      return false;
    }
  }

  useEffect(() => {
    const cleanupTheme = setupTheme();

    (async () => {
      try {
        const isAuthenticated = await checkAuth();

        if (isAuthenticated) {
          await knowSbcription();
        }
      } finally {
        setAppLoading(false);
      }
    })();

    return () => {
      if (typeof cleanupTheme === "function") {
        cleanupTheme();
      }
    };
  }, [dispatch, navigate]);

  if (appLoading) {
    return (
      <Loading
        text="Checking your account..."
        subtext="Please wait while we verify your subscription"
      />
    );
  }
  
  return (
    <Routes>
      <Route path="/register" element={<Login />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/subscription-expired" element={<SubscriptionExpired />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/SavedServices" element={<SavedServicesPage />} />
      <Route path="/AboutUs" element={<AboutUsPage />} />
      <Route path="/Advance" element={<AdvanceOptionPage />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
export default App;