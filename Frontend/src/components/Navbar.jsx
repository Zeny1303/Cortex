import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "Features",  href: "#features"  },
  { label: "Method",    href: "#method"    },
  { label: "Questions", href: "#questions" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`
        nav-enter fixed top-0 left-0 w-full z-50
        border-b-2 border-black dark:border-white
        bg-white dark:bg-black
        transition-shadow duration-200
        ${scrolled ? "shadow-[0_2px_0_0_#000] dark:shadow-[0_2px_0_0_#fff]" : ""}
      `}
      aria-label="Main navigation"
    >
      <div className="flex items-stretch h-14">

        {/* Logo cell */}
        <a
          href="/"
          className="flex items-center px-6 border-r-2 border-black dark:border-white
                     font-black text-sm uppercase tracking-widest
                     text-black dark:text-white
                     hover:bg-black hover:text-white
                     dark:hover:bg-white dark:hover:text-black
                     transition-colors duration-150"
          aria-label="Cortex home"
        >
          CORTEX
        </a>

        {/* Nav links */}
        <div className="flex items-stretch ml-auto">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleAnchor(e, link.href)}
              className="
                relative flex items-center px-6
                text-xs font-bold uppercase tracking-widest
                border-l-2 border-black dark:border-white
                text-black dark:text-white
                overflow-hidden group
                transition-colors duration-150
                hover:bg-black hover:text-white
                dark:hover:bg-white dark:hover:text-black
              "
            >
              {link.label}
            </a>
          ))}

          {/* Theme Toggle */}
          <ThemeToggle variant="minimal" />

          {/* CTA */}
          <button
            onClick={() => navigate("/login")}
            className="
              flex items-center px-6
              text-xs font-black uppercase tracking-widest
              border-l-2 border-black dark:border-white
              bg-swiss-accent text-white
              hover:bg-black dark:hover:bg-white
              hover:text-white dark:hover:text-black
              transition-colors duration-150
            "
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
