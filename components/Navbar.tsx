"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
          scrolled ? "pt-6" : "pt-0"
        }`}
      >
        <nav
          className={`flex items-center justify-between transition-all duration-500 ease-in-out ${
            scrolled
              ? "w-[90%] max-w-4xl px-8 py-3 rounded-full border border-purple-900/15 dark:border-white/15 shadow-xl backdrop-blur-xl bg-white/85 dark:bg-black/70"
              : "w-full h-24 px-6 md:px-12 bg-transparent border-none"
          }`}
        >
          <a
            href="#"
            className="text-xl font-bold tracking-tight select-none flex items-center"
            style={{ fontFamily: "var(--font-vamos)" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-600 to-purple-400 font-extrabold">
              Zenvio
            </span>
         
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href} className="flex items-center gap-2 group">
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-purple-600 transition-opacity ${
                    active === link.label
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-60"
                  }`}
                />
                <a
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={`text-sm font-semibold transition-colors ${
                    active === link.label
                      ? "text-purple-700 dark:text-purple-400 font-bold"
                      : "text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--font-clash)" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2.5 rounded-full border border-gray-200 dark:border-white/15 bg-gray-100/80 dark:bg-white/10 hover:scale-105 transition-all text-gray-800 dark:text-white shadow-sm cursor-pointer"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-800 dark:text-white"
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] md:hidden flex flex-col transition-all duration-500 ease-in-out ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl"
          onClick={() => setMenuOpen(false)}
        />

        {/* Content */}
        <div
          className={`relative flex flex-col items-center justify-center h-full gap-8 transition-transform duration-500 ease-in-out ${
            menuOpen ? "translate-y-0" : "-translate-y-8"
          }`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-8 right-8 text-gray-800 dark:text-white"
            aria-label="Close Menu"
          >
            <X size={32} />
          </button>

          {navLinks.map((link, i) => (
            
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                setActive(link.label);
                setMenuOpen(false);
              }}
              className={`text-4xl font-bold transition-colors duration-200 ${
                active === link.label
                  ? "text-[#8027e0]"
                  : "text-gray-800 dark:text-white"
              }`}
              style={{
                fontFamily: "var(--font-clash)",
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Theme toggle in mobile menu */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mt-4 p-3 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 text-gray-800 dark:text-white shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </div>
      </div>
    </>
  );
}