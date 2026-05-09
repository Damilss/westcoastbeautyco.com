import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { BOOKSY_APPOINTMENT_URL, SITE_NAV_LINKS } from "./components/site-nav-links";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found | West Coast Beauty Co.",
  description: "The page you're looking for has wandered off. Find your way back home.",
};

const SUGGESTIONS = [
  { label: "Home", href: "/" },
  { label: "Meet the Team", href: "/meet-the-team" },
  { label: "The Beauty Consultant", href: "/the-beauty-consultant" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <SiteHeader links={SITE_NAV_LINKS} forceSolidBackground />

      <main className={styles.main}>
        <section className={styles.card} aria-labelledby="not-found-heading">
          <div className={styles.content}>
            <span className={styles.eyebrow}>Error 404</span>
            <div className={styles.numberWrap}>
              <span className={styles.numberGlow} aria-hidden="true" />
              <p className={styles.number} aria-hidden="true">
                404
              </p>
            </div>
            <h1 id="not-found-heading" className={styles.headline}>
              This page slipped away.
            </h1>
            <p className={styles.copy}>
              We can&apos;t find what you&apos;re looking for, but everything else is right
              where you left it. Take a breath, then carry on.
            </p>
            <div className={styles.actions}>
              <Link href="/" className={styles.softButton}>
                RETURN HOME
              </Link>
              <a href={BOOKSY_APPOINTMENT_URL} className={styles.darkButton}>
                BOOK AN APPOINTMENT
              </a>
            </div>
            <nav className={styles.suggestions} aria-label="Helpful links">
              <span className={styles.suggestionsLabel}>Or visit</span>
              {SUGGESTIONS.map((item) => (
                <Link key={item.href} href={item.href} className={styles.suggestionLink}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className={styles.imagePanel}>
            <Image
              src="/Westcoastbeauty-29.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 48vw"
              className={styles.image}
              priority
            />
            <span className={styles.imageVignette} aria-hidden="true" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
