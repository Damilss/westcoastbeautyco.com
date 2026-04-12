import type { Metadata } from "next";
import Image from "next/image";
import {
  type BottleRockConversationOption,
  BottleRockTextingDemo,
} from "../components/bottlerock-texting-demo";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SITE_NAV_LINKS } from "../components/site-nav-links";
import styles from "./page.module.css";

const BOTTLE_ROCK_BOOKING_URL = "https://westcoastbeautyco.as.me/";
const BOTTLE_ROCK_SITE_NAV_LINKS = SITE_NAV_LINKS.map((link) =>
  link.label === "Book appointment"
    ? { ...link, href: BOTTLE_ROCK_BOOKING_URL }
    : link
);

export const metadata: Metadata = {
  title: "BottleRock | West Coast Beauty Co.",
  description:
    "BottleRock-ready curated piercing services, lineup details, and booking for West Coast Beauty Co.",
};

const BOTTLE_ROCK_FAQS = [
  {
    question: "Do I need an appointment?",
    answer:
      "Appointments are highly recommended. Walk-ups are welcome based on availability.",
  },
  {
    question: "What jewelry options are available?",
    answer: "We offer high-quality titanium and gold options curated to your style.",
  },
  {
    question: "How long does it take?",
    answer: "Most services take 10-20 minutes depending on your selection.",
  },
  {
    question: "Is aftercare included?",
    answer: "Yes. Festival-friendly aftercare is included with your service.",
  },
] as const;

const BOTTLE_ROCK_FAQ_OPTIONS: readonly BottleRockConversationOption[] = BOTTLE_ROCK_FAQS.map(
  (faq, index) => ({
    id: `faq-${index + 1}`,
    userLabel: faq.question,
    userMessage: faq.question,
    botResponse: faq.answer,
  })
);

const BOTTLE_ROCK_EXTRA_PROMPT_OPTIONS: readonly BottleRockConversationOption[] = [
  {
    id: "walk-ups",
    userLabel: "Do you take walk-ups?",
    userMessage: "Hi! Do you take walk-ups at BottleRock?",
    botResponse:
      "Yes, we do when space opens up. We always recommend booking ahead for your preferred time.",
  },
  {
    id: "timing-detail",
    userLabel: "How long does an appointment take?",
    userMessage: "How long is a typical piercing appointment?",
    botResponse:
      "Most appointments are about 10-20 minutes, depending on your service and jewelry selection.",
    responseDelayMs: 1400,
  },
  {
    id: "jewelry-detail",
    userLabel: "What jewelry options?",
    userMessage: "What jewelry do you have available this weekend?",
    botResponse:
      "We offer curated titanium and solid gold options that are festival-ready and selected to match your look.",
  },
  {
    id: "group-booking",
    userLabel: "Can we book together?",
    userMessage: "Can I reserve spots for me and my friends together?",
    botResponse:
      "Absolutely. Book back-to-back times and we can style your group in one coordinated session.",
  },
  {
    id: "location",
    userLabel: "Where will West Coast Beauty Co. be located?",
    userMessage: "Where will West Coast Beauty Co. be located?",
    botResponse:
      "Find us inside the BottleRock Beauty Bar. Exact location details will be available on the festival map inside the event.",
    responseDelayMs: 1520,
  },
];

const BOTTLE_ROCK_FAQ_DEMO_OPTIONS: readonly BottleRockConversationOption[] = [
  ...BOTTLE_ROCK_FAQ_OPTIONS,
  ...BOTTLE_ROCK_EXTRA_PROMPT_OPTIONS,
];

export default function BottleRockPage() {
  return (
    <div className={styles.page}>
      <SiteHeader links={BOTTLE_ROCK_SITE_NAV_LINKS} activeHref="/bottlerock" />

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
                  <a href={BOTTLE_ROCK_BOOKING_URL} className={styles.primaryButton}>
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
                  <a href={BOTTLE_ROCK_BOOKING_URL} className={styles.primaryButton}>
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

        <section className={styles.expectSection} aria-label="What to expect and aftercare">
          <div className={styles.contentWrap}>
            <div className={styles.expectCluster}>
              <div className={styles.expectImagePanel}>
                <div className={styles.expectImageWrap}>
                  <Image
                    src="/472414e49c004a5382e6890fa6fd17ae.jpg"
                    alt="Close-up of a curated ear piercing with jewelry"
                    fill
                    sizes="(max-width: 1100px) 100vw, 38vw"
                    className={styles.coverImage}
                  />
                </div>
              </div>

              <div className={styles.expectContent}>
                <div className={styles.expectAftercareGrid}>
                  <div className={styles.expectCard}>
                    <p className={styles.sectionEyebrow}>What To Expect</p>
                    <h2>A seamless, elevated experience</h2>
                    <ul className={styles.expectList}>
                      <li>Guided jewelry selection</li>
                      <li>Clean + professional piercing environment</li>
                      <li>Expert placement + styling</li>
                      <li>Festival-friendly aftercare included</li>
                    </ul>
                  </div>

                  <div className={styles.aftercareCard}>
                    <p className={styles.sectionEyebrow}>Aftercare</p>
                    <h2>Keep it clean. Keep it effortless.</h2>
                    <p className={styles.aftercareCopy}>
                      Each client receives festival-friendly aftercare to make healing easy while
                      you enjoy your weekend.
                    </p>
                    <p className={styles.aftercareCopy}>
                      For continued care and future jewelry upgrades, visit us in studio after the
                      festival.
                    </p>
                  </div>
                </div>

                <div className={styles.expectGoalCard}>
                  <p className={styles.expectGoalLabel}>Our goal is simple:</p>
                  <p className={styles.expectGoal}>
                    To make you feel confident, styled, and taken care of.
                  </p>
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
                <a href={BOTTLE_ROCK_BOOKING_URL} className={styles.primaryButton}>
                  Reserve Piercing Appointment
                </a>
              </div>

              <div className={styles.videoShell}>
                <div className={styles.videoFrame}>
                  <iframe
                    src="https://www.youtube.com/embed/lu7ZeNRr0TI?rel=0&modestbranding=1&playsinline=1"
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

        <section className={styles.faqSection} aria-label="BottleRock FAQ">
          <div className={styles.contentWrap}>
            <div className={styles.faqCard}>
              <p className={styles.sectionEyebrow}>FAQ</p>
              <h2>BottleRock Beauty Bar questions, answered.</h2>
              <div className={styles.faqDemoWrap}>
                <BottleRockTextingDemo
                  bookingUrl={BOTTLE_ROCK_BOOKING_URL}
                  contactUrl="/contact"
                  conversationOptions={BOTTLE_ROCK_FAQ_DEMO_OPTIONS}
                />
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
                  <a href={BOTTLE_ROCK_BOOKING_URL} className={styles.primaryButton}>
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
