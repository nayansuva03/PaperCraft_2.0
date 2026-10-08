import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Moon, Sun, Menu, X } from "lucide-react";
import { toggleTheme } from "../../redux/slices/themeSlice.js";

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const Tokens = useSelector((state) => state.subscription.tokens);
    const theme = useSelector((state) => state.theme.theme);
    const isDark = theme === "dark";

    const getLinkClass = ({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${isActive
            ? "text-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 dark:text-indigo-400 font-semibold"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
        }`;

    const getMobileLinkClass = ({ isActive }) =>
        `block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-lg ${isActive
            ? "text-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 dark:text-indigo-400 font-semibold"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
        }`;

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Brand Logo */}
                    <NavLink
                        to="/"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 text-xl font-extrabold tracking-tight hover:opacity-90 transition-opacity"
                    >
                        <span className="font-extrabold text-slate-800 dark:text-white text-xl tracking-tight">
                            Paper<span className="text-indigo-600 dark:text-indigo-400">Craft</span>
                        </span>
                    </NavLink>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink to="/" className={getLinkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/SavedServices" className={getLinkClass}>
                            Saved Services
                        </NavLink>
                        <NavLink to="/Advance" className={getLinkClass}>
                            Advance
                        </NavLink>
                        <NavLink to="/AboutUs" className={getLinkClass}>
                            About Us
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Tokens (desktop only) */}
                        <div className="hidden md:flex items-baseline gap-1.5 text-sm">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">
                                Tokens Left :
                            </span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {Tokens ?? "Loading..."}
                            </span>
                        </div>

                        

                        {/* Theme Toggle */}
                        <button
                            type="button"
                            onClick={() => dispatch(toggleTheme())}
                            aria-label="Toggle dark mode"
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Mobile Menu Toggle Button */}
                        <div className="flex md:hidden items-center">
                            <button
                                onClick={toggleMobileMenu}
                                type="button"
                                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-expanded={isMobileMenuOpen}
                                aria-label="Toggle navigation menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-4 space-y-1 shadow-lg">
                    {/* Mobile Profile Section */}
                    <div className="pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5 px-3 text-base">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                            {Tokens ?? "..."} tokens
                        </span>
                    </div>

                    <NavLink to="/" onClick={closeMobileMenu} className={getMobileLinkClass}>
                        Home
                    </NavLink>
                    <NavLink
                        to="/SavedServices"
                        onClick={closeMobileMenu}
                        className={getMobileLinkClass}
                    >
                        Saved Services
                    </NavLink>
                    <NavLink to="/Advance" onClick={closeMobileMenu} className={getMobileLinkClass}>
                        Advance
                    </NavLink>
                    {/* BUG FIX: this used to point to "/About", but the route is "/AboutUs" */}
                    <NavLink to="/AboutUs" onClick={closeMobileMenu} className={getMobileLinkClass}>
                        About Us
                    </NavLink>
                </div>
            )}
        </nav>
    );
}

export default Navbar;