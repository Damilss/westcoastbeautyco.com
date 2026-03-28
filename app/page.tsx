import Image from "next/image";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { ScrollReveal } from "./components/scroll-reveal";
import styles from "./page.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Book appointment", href: "#" },
  { label: "Shop", href: "#" },
  { label: "The Beauty Consultant", href: "#" },
  { label: "Meet The Team", href: "/meet-the-team" },
  { label: "Contact", href: "#" },
];

const STRIP_IMAGES = [
  { src: "/LuxeLinkcombo9.jpg", alt: "Gold jewelry on branch" },
  { src: "/543A3243.jpg", alt: "Two models wearing jewelry" },
  { src: "/543A3521.jpg", alt: "Hands clasping bracelet" },
  { src: "/Westcoastbeauty-100.jpg", alt: "Model smiling with flowers" },
  { src: "/Westcoastbeauty-111.jpg", alt: "Beauty product in hand" },
  { src: "/LuxeLinkcombo10.jpg", alt: "Gold jewelry on branch close-up" },
];

const TESTIMONIALS = [
  {
    name: "Jean S.",
    quote:
      "I have been getting my lashes done by Amber for the last couple of months and she does an amazing job! I highly recommend her services!",
  },
  {
    name: "Kim D.",
    quote:
      "We had a wonderful experience while getting my daughter's ears pierced. Amber displayed exceptional patience and care throughout the process, making my daughter feel comfortable and at ease. Amber is excellent with children and her calm and warm energy made the whole experience fun and stress-free.",
  },
  {
    name: "Michelle C.",
    quote:
      "West Coast Beauty Co is an amazing spa! I've been extremely happy with all my treatments from microblading to lash extensions to ear piercing. I felt immediately at ease and taken care of with Amber.",
  },
];

const INSTAGRAM_POSTS = [
  {
    src: "/Westcoastbeauty-62.jpg",
    caption: "Honored to be part of the She Drives Women's History event.",
  },
  {
    src: "/Westcoastbeauty-64.jpg",
    caption: "Talking entrepreneurship and all things beauty industry.",
  },
  {
    src: "/Westcoastbeauty-72.jpg",
    caption: "Celebrating Women's History Month with confidence and style.",
  },
  {
    src: "/543A2834.jpg",
    caption: "Something beautiful is blooming at West Coast Beauty Co.",
  },
  {
    src: "/Westcoastbeauty-94.jpg",
    caption: "New therapist alert. Meet Catherine and say hello.",
  },
  {
    src: "/Westcoastbeauty-48.jpg",
    caption: "Excited to be part of The Wellness Affair in Oakland.",
  },
];

export default function Home() {
  const loopingStrip = [...STRIP_IMAGES, ...STRIP_IMAGES];

  return (
    <div className={styles.page}>
      <SiteHeader links={NAV_LINKS} activeHref="/" />

      <main>
        <section className={styles.heroSection}>
          <div className={styles.heroFrame}>
            <Image
              src="/main-page.png"
              alt="West Coast Beauty team"
              fill
              priority
              className={styles.heroImage}
              sizes="100vw"
            />
            <div className={styles.heroGlow} />
          </div>
        </section>

        <ScrollReveal>
          <section className={styles.scrollerSection}>
            <div className={styles.marqueeViewport}>
              <div className={styles.marqueeTrack}>
                {loopingStrip.map((image, index) => (
                  <article key={`${image.src}-${index}`} className={styles.marqueeCard}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 220px, 300px"
                      className={styles.marqueeImage}
                    />
                  </article>
                ))}
              </div>
              <a href="#" className={styles.shopNowButton}>
                SHOP NOW
              </a>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={styles.darkSection}>
            <div className={styles.splitCard}>
              <div className={styles.splitImagePanel}>
                <Image
                  src="/472414e49c004a5382e6890fa6fd17ae.jpg"
                  alt="Ear jewelry close-up"
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                  className={styles.coverImage}
                />
              </div>
              <div className={`${styles.splitContent} ${styles.creamPanel}`}>
                <h2 className={styles.sectionTitle}>Book a salon service</h2>
                <p>
                  West Coast Beauty Co. offers a curated service menu designed to help you look and
                  feel your best. From lash extensions, lifts, and tints to expertly sculpted brows
                  through microblading, tinting, and lamination, our team has you covered.
                </p>
                <p>
                  We also offer safe and stylish ear and nose piercings, rejuvenating skin
                  treatments like microneedling, PRP, chemical peels, and PRX Derm Perfexion, as
                  well as injectable services including B-12 shots, Botox, and dermal fillers.
                </p>
                <a href="#" className={styles.softButton}>
                  BOOK NOW
                </a>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={styles.roomSection}>
            <div className={styles.roomFrame}>
              <Image
                src="/543A3020.jpg"
                alt="West Coast Beauty salon studio room"
                fill
                sizes="100vw"
                className={styles.coverImage}
              />
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={styles.consultantSection}>
            <div className={`${styles.splitCard} ${styles.consultantCard}`}>
              <div className={`${styles.splitContent} ${styles.pinkPanel}`}>
                <h2 className={styles.sectionTitle}>The Beauty Consultant</h2>
                <p>
                  With nearly two decades of hands-on experience in the beauty industry, West Coast
                  Beauty Co. founder Amber Clemons now shares her expertise through personalized
                  consulting services designed for fellow beauty professionals.
                </p>
                <p>
                  Whether you&apos;re launching your first studio or looking to elevate your existing
                  brand, The Beauty Consultant offers the guidance and strategy to help you thrive.
                </p>
                <a href="#" className={styles.darkButton}>
                  BOOK NOW
                </a>
              </div>
              <div className={styles.splitImagePanel}>
                <Image
                  src="/amber-hammock-chair.jpg"
                  alt="Amber Clemons in the salon"
                  fill
                  sizes="(max-width: 900px) 100vw, 48vw"
                  className={styles.coverImage}
                />
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={styles.testimonialsSection}>
            <div className={styles.contentWrap}>
              <h2 className={styles.sectionTitle}>Client Love</h2>
              <div className={styles.testimonialGrid}>
                {TESTIMONIALS.map((item) => (
                  <article key={item.name} className={styles.testimonialCard}>
                    <h3>{item.name}</h3>
                    <p>{item.quote}</p>
                  </article>
                ))}
              </div>
              <a href="#" className={styles.softButton}>
                BOOK NOW
              </a>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={styles.instagramSection}>
            <div className={styles.instagramGrid}>
              {INSTAGRAM_POSTS.map((post, index) => (
                <article key={post.src} className={styles.instagramCard}>
                  <div className={styles.instagramImageWrap}>
                    <Image
                      src={post.src}
                      alt={`Instagram post preview ${index + 1}`}
                      fill
                      sizes="(max-width: 900px) 50vw, 16vw"
                      className={styles.coverImage}
                    />
                  </div>
                  <p className={styles.instagramCaption}>{post.caption}</p>
                </article>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </main>

      <SiteFooter />
    </div>
  );
}
