"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

type NavLink = {
  label: string;
  href: string;
};

type SiteHeaderProps = {
  links: NavLink[];
  activeHref?: string;
};

export function SiteHeader({ links, activeHref }: SiteHeaderProps) {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY <= 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${atTop ? styles.headerAtTop : styles.headerScrolled}`}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.brand}>
          West Coast Beauty Co
        </Link>
        <nav className={styles.nav} aria-label="Main navigation">
          {links.map((link) => {
            const isActive = link.href === activeHref;
            const className = isActive ? styles.navLinkActive : styles.navLink;

            if (link.href.startsWith("/")) {
              return (
                <Link key={link.label} href={link.href} className={className}>
                  {link.label}
                </Link>
              );
            }

            return (
              <a key={link.label} href={link.href} className={className}>
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className={styles.headerIcons}>
          <SearchIcon />
          <UserIcon />
          <BagIcon />
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 20c1.3-3.2 4.2-5 8-5s6.7 1.8 8 5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
