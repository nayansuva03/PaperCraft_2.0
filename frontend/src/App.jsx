import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { setUser, clearUser } from "./redux/slices/userSlice.js";
import { setSubscription, clearSubscription } from "./redux/slices/Subcription.js";
import { setTheme } from "./redux/slices/themeSlice.js";

import Login from "./components/comman/Login.jsx";
import Subscription from "./components/comman/Subscription.jsx";
import HomePage from "./components/Home/HomePage.jsx";
import SavedServicesPage from "./components/Home/SavedServicesPage.jsx";
import AboutUsPage from "./components/Home/AboutUsPage.jsx";
import AdvanceOptionPage from "./components/Home/AdvanceOptionPage.jsx";
import Error404 from "./components/Home/Error404.jsx";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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

      // User has no subscription yet
      if (response.status === 409) {
        dispatch(clearSubscription());

        // Send them to subscription page
        navigate("/subscription");

        return;
      }

      // Other errors
      if (!response.ok) {
        console.log("Failed to fetch subscription details:", data);
        return;
      }

      // User has an active subscription
      dispatch(setSubscription(data.subscription));

    } catch (error) {
      console.log("Failed to fetch subscription details.", error);
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
        ); signIn

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
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        return;
      }

      await knowSbcription();
    })();

    return () => {
      if (typeof cleanupTheme === "function") {
        cleanupTheme();
      }
    };
  }, [dispatch, navigate]);
  return (
    <Routes>
      <Route path="/register" element={<Login />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/SavedServices" element={<SavedServicesPage />} />
      <Route path="/AboutUs" element={<AboutUsPage />} />
      <Route path="/Advance" element={<AdvanceOptionPage />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
export default App;