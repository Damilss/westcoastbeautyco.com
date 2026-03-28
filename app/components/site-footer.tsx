import styles from "../page.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <p>Want to chat with our team? Call or Text</p>
      <p className={styles.phone}>707-633-3323</p>
      <div className={styles.footerIcons}>
        <a href="https://www.facebook.com/boujiebeautybyamber" aria-label="Facebook">
          <FacebookIcon />
        </a>
        <a href="https://www.instagram.com/boujiebeautybenicia/" aria-label="Instagram">
          <InstagramIcon />
        </a>
      </div>
      <p className={styles.legal}>© 2026, West Coast Beauty Co</p>
    </footer>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.7 8.2h2V5.1h-2.4c-3 0-4.4 1.8-4.4 4.7v1.9H6.8v3h2.1V20h3.2v-5.3h2.5l.4-3h-2.9V9.9c0-1 .5-1.7 1.6-1.7Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.4" />
      <circle cx="12" cy="12" r="3.7" />
      <circle cx="17.2" cy="6.8" r="1" />
    </svg>
  );
}
