import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { BOOKSY_APPOINTMENT_URL, SITE_NAV_LINKS } from "../components/site-nav-links";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "BottleRock | West Coast Beauty Co.",
  description:
    "BottleRock-ready curated piercing services, lineup details, and booking for West Coast Beauty Co.",
};

export default function BottleRockPage() {
  return (
    <div className={styles.page}>
      <SiteHeader links={SITE_NAV_LINKS} activeHref="/bottlerock" />

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroFrame}>
            <Image
              src="/bottlerockstage.png"
              alt="Crowd and stage lights at BottleRock"
              fill
              priority
              sizes="100vw"
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroGlow} />

            <div className={styles.heroContentWrap}>
              <div className={styles.heroContent}>
                <p className={styles.heroEyebrow}>BottleRock Beauty Weekend</p>
                <h1>Festival-ready, fully curated. Book before the first set starts.</h1>
                <p>
                  West Coast Beauty Co. is bringing luxury piercing and curated ear styling to 
                  BottleRock all weekend long.
                </p>
                <div className={styles.heroActions}>
                  <a href={BOOKSY_APPOINTMENT_URL} className={styles.primaryButton}>
                    Book Your Spot
                  </a>
                  <a href="#lineup" className={styles.secondaryButton}>
                    View The Lineup
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.transitionSection} aria-label="BottleRock mood transition">
          <div className={styles.transitionSticky}>
            <p className={styles.transitionText}>Plan your look before the first set</p>
          </div>
        </section>

        <section className={styles.beautySection}>
          <div className={styles.contentWrap}>
            <div className={styles.beautyGrid}>
              <div className={styles.menuPanel}>
                <div className={styles.menuImageWrap}>
                  <Image
                    src="/479B6213-CEE5-42D8-A4B1-B5895D6F3944.png"
                    alt="West Coast Beauty x BottleRock Beauty Bar menu"
                    fill
                    sizes="(max-width: 1100px) 100vw, 42vw"
                    className={styles.coverImage}
                  />
                </div>
              </div>

              <div className={styles.servicesPanel}>
                <p className={styles.sectionEyebrow}>BottleRock Beauty Bar</p>
                <h2>Luxury piercing and ear curation, designed for your festival look.</h2>
                <p className={styles.narrativeLead}>
                  Step into BottleRock fully styled with West Coast Beauty Co.&apos;s luxury
                  piercing and ear curation experience. From single piercings to curated ear stacks,
                  each service is designed to complement your look using high-quality titanium and
                  gold jewelry, expert placement, and a seamless, elevated experience.
                </p>
                <p className={styles.narrativeCopy}>
                  Choose from a single piercing or elevate your look with a curated or signature
                  stack - our most popular option for a fully styled, festival-ready finish.
                  Appointments are limited and fill quickly, so reserve your spot in advance and
                  arrive ready to enjoy the weekend.
                </p>

                <div className={styles.servicesActions}>
                  <a href={BOOKSY_APPOINTMENT_URL} className={styles.primaryButton}>
                    Reserve your piercing
                  </a>
                  <a href="/contact" className={styles.inlineLink}>
                    Questions? Contact our team.
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="lineup" className={styles.posterSection}>
          <div className={styles.contentWrap}>
            <div className={styles.posterPanel}>
              <div className={styles.posterImageWrap}>
                <Image
                  src="/bottlerock-lineup.webp"
                  alt="BottleRock lineup poster"
                  fill
                  sizes="(max-width: 1100px) 100vw, 760px"
                  className={styles.coverImage}
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.lineupSection}>
          <div className={styles.contentWrap}>
            <div className={styles.lineupGrid}>
              <div className={styles.lineupCopy}>
                <p className={styles.sectionEyebrow}>Weekend Preview</p>
                <h2>From lineup favorites to sunset sets, arrive ready.</h2>
                <p>
                  Plan your piercing before gates open. Watch the BottleRock preview, lock in your
                  appointment time, and head into the weekend feeling elevated.
                </p>
                <a href={BOOKSY_APPOINTMENT_URL} className={styles.primaryButton}>
                  Reserve Festival Appointment
                </a>
              </div>

              <div className={styles.videoShell}>
                <div className={styles.videoFrame}>
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/lu7ZeNRr0TI?si=zGOPUoZwEj6H5n2O"
                    title="BottleRock lineup preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.closingSection}>
          <div className={styles.contentWrap}>
            <div className={styles.closingCard}>
              <div className={styles.closingImages}>
                <div className={styles.mainClosingImage}>
                  <Image
                    src="/BR25_Fri_C Helkey_0008829-drone.JPEG"
                    alt="Festival crowd celebrating at BottleRock"
                    fill
                    sizes="(max-width: 1100px) 100vw, 52vw"
                    className={styles.coverImage}
                  />
                </div>
              </div>

              <div className={styles.closingContent}>
                <p className={styles.sectionEyebrow}>Last Call</p>
                <h2>Secure your BottleRock piercing appointment now.</h2>
                <p>
                  Prime slots fill quickly during festival weekend. Reserve your service now and
                  step into BottleRock with your full look handled.
                </p>
                <div className={styles.closingActions}>
                  <a href={BOOKSY_APPOINTMENT_URL} className={styles.primaryButton}>
                    Book Now
                  </a>
                  <a href="/contact" className={styles.secondaryButton}>
                    Contact Team  
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
