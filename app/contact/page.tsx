import type { Metadata } from "next";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SITE_NAV_LINKS } from "../components/site-nav-links";
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

          <form
            className={styles.form}
            action="mailto:Hello@westcoastbeautyco.com"
            method="post"
            encType="text/plain"
          >
            <div className={styles.formRow}>
              <label htmlFor="contact-name" className={styles.srOnly}>
                Name
              </label>
              <input id="contact-name" name="name" type="text" placeholder="Name" />

              <label htmlFor="contact-email" className={styles.srOnly}>
                Email
              </label>
              <input id="contact-email" name="email" type="email" placeholder="Email *" required />
            </div>

            <label htmlFor="contact-phone" className={styles.srOnly}>
              Phone number
            </label>
            <input id="contact-phone" name="phone" type="tel" placeholder="Phone number" />

            <label htmlFor="contact-comment" className={styles.srOnly}>
              Comment
            </label>
            <textarea id="contact-comment" name="comment" placeholder="Comment" rows={7} />

            <button type="submit" className={styles.submitButton}>
              Send
            </button>
          </form>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
