import type { Metadata } from "next";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SITE_NAV_LINKS } from "../components/site-nav-links";
import { ContactForm } from "./contact-form";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact | West Coast Beauty Co.",
  description: "Contact West Coast Beauty Co. by form, call, or text.",
};

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <SiteHeader links={SITE_NAV_LINKS} activeHref="/contact" />

      <main className={styles.main}>
        <section className={styles.contactSection}>
          <p className={styles.hook}>
            To speak with our team call or text 707-633-3323, or fill out the following form.
          </p>

          <ContactForm />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
