import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SITE_NAV_LINKS } from "../components/site-nav-links";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Beauty Consultant | West Coast Beauty Co.",
  description:
    "Personalized consulting for beauty professionals with founder Amber Clemons.",
};

export default function BeautyConsultantPage() {
  return (
    <div className={styles.page}>
      <SiteHeader links={SITE_NAV_LINKS} activeHref="/the-beauty-consultant" />

      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.card}>
            <div className={styles.contentPanel}>
              <h1 className={styles.title}>The Beauty Consultant</h1>
              <p className={styles.copy}>
                With nearly two decades of hands-on experience in the beauty industry, West Coast
                Beauty Co. founder Amber Clemons now shares her expertise through personalized
                consulting services designed for fellow beauty professionals. Whether you&apos;re
                launching your first studio or looking to elevate your existing brand, The Beauty
                Consultant offers the guidance and strategy to help you thrive.
              </p>
              <a href="/contact" className={styles.button}>
                BOOK NOW
              </a>
            </div>
            <div className={styles.imagePanel}>
              <Image
                src="/amber-hammock-chair.jpg"
                alt="Amber Clemons seated in a woven chair"
                fill
                priority
                sizes="(max-width: 990px) 100vw, 50vw"
                className={styles.image}
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
