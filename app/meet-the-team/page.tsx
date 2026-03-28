import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import styles from "./page.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Book appointment", href: "#" },
  { label: "Shop", href: "#" },
  { label: "The Beauty Consultant", href: "#" },
  { label: "Meet The Team", href: "/meet-the-team" },
  { label: "Contact", href: "#" },
];

type TeamMember = {
  name: string;
  role?: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  description: string[];
  buttonLabel: string;
  buttonHref: string;
};

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Amber",
    role: "Owner & Founder",
    imageSrc: "/543A2374.jpg",
    imageAlt: "Amber smiling in white top",
    imagePosition: "center 30%",
    description: [],
    buttonLabel: "Book with Amber",
    buttonHref: "http://boujiebeautybenicia.booksy.com/a/",
  },
  {
    name: "Angelina",
    imageSrc: "/angelina-headshot.jpg",
    imageAlt: "Angelina portrait",
    imagePosition: "center 24%",
    description: [
      "Angelina is a registered nurse with over 10 years of bedside experience and the owner of a successful Permanent Makeup Artistry business for the past five years. She is multi-level certified across all aspects of the permanent makeup field.",
      "With every client, Angelina's approach is rooted in blending medical expertise with refined artistry, always with the intention of enhancing natural beauty. She is deeply passionate about empowering women through confidence, precision, and aesthetics, and is committed to delivering results that are both balanced and beautiful. She will soon be expanding into advanced aesthetics, believing that beauty deserves both skill and science.",
    ],
    buttonLabel: "Book with Angelina",
    buttonHref:
      "https://booksy.com/en-us/718011_west-coast-beauty-co_wellness-day-spa_103417_american-canyon",
  },
  {
    name: "Cynthia",
    imageSrc: "/cynthia-headshot.jpg",
    imageAlt: "Cynthia portrait in pink scrubs",
    imagePosition: "center 22%",
    description: [
      "Cynthia is a registered nurse and certified aesthetic injector at West Coast Beauty, passionate about helping clients feel confident and refreshed. With years of clinical experience and a personalized approach to beauty, she offers advanced aesthetic treatments designed to enhance each client's natural features.",
      "Cynthia provides a wide range of services including Botox, Dysport, and Xeomin (neuromodulators), dermal filler, Sculptra, microneedling, PRP (platelet-rich plasma), chemical peels, PRX treatments, and B12 injections. Whether clients are seeking subtle rejuvenation or a more transformative treatment plan, Cynthia delivers safe, customized care with precision and intention.",
    ],
    buttonLabel: "Book with Cynthia",
    buttonHref:
      "https://booksy.com/en-us/718011_west-coast-beauty-co_wellness-day-spa_103417_american-canyon",
  },
  {
    name: "Kate",
    imageSrc: "/kate-headshot.jpg",
    imageAlt: "Kate reflected in mirror",
    imagePosition: "center 28%",
    description: [
      "Kate is a lash and brow artist at West Coast Beauty and a licensed esthetician specializing in eyelash and eyebrow enhancements, as well as face and body waxing. At 22 years old, she has been in the beauty industry for about five years, with five years of experience in lashes and brows and three years specializing in waxing.",
      "She is proud to be multi-certified by over eight private lash and brow companies. Kate tailors every service, whether lashes, brows, or waxing, to each guest based on their facial features and what will suit them best.",
      "Her goal at West Coast Beauty is to make every client glow with confidence and leave feeling renewed and beautiful. Feel free to explore her portfolio on Instagram @katebeautyy. Kate looks forward to welcoming you soon.",
    ],
    buttonLabel: "Book with Kate",
    buttonHref:
      "https://booksy.com/en-us/718011_west-coast-beauty-co_wellness-day-spa_103417_american-canyon",
  },
  {
    name: "Theresa",
    imageSrc: "/theresa-headshot.jpg",
    imageAlt: "Theresa smiling in white top",
    imagePosition: "center 26%",
    description: [
      "With over a decade in the beauty industry, Theresa has built a thriving business rooted in expertise, consistency, and genuine connection. As an experienced esthetician at West Coast Beauty, she takes immense pride in the relationships she has nurtured, with many loyal clients returning year after year, not just for her skilled work, but for the welcoming environment she creates.",
      "Theresa believes beauty should feel effortless and timeless, enhancing natural features rather than overpowering them. Her meticulous attention to detail and deep understanding of aesthetics ensure every treatment is customized to complement each client's unique look.",
      "For Theresa, this career is about more than providing a beauty service, it's about helping clients feel their absolute best. She has built her reputation on dependability, professionalism, and genuine connection.",
    ],
    buttonLabel: "Book with Theresa",
    buttonHref:
      "https://booksy.com/en-us/718011_west-coast-beauty-co_wellness-day-spa_103417_american-canyon",
  },
];

export const metadata: Metadata = {
  title: "Meet the Team | West Coast Beauty Co.",
  description: "Meet the West Coast Beauty Co. team and book your next appointment.",
};

export default function MeetTheTeamPage() {
  return (
    <div className={styles.page}>
      <SiteHeader links={NAV_LINKS} activeHref="/meet-the-team" />

      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Meet the Team</h1>

        <section className={styles.teamSection} aria-label="Meet the Team members">
          {TEAM_MEMBERS.map((member, index) => (
            <article
              key={member.name}
              className={`${styles.teamRow} ${index % 2 === 1 ? styles.rowReverse : ""}`}
            >
              <div className={styles.imagePanel}>
                <Image
                  src={member.imageSrc}
                  alt={member.imageAlt}
                  fill
                  sizes="(max-width: 990px) 100vw, 50vw"
                  className={styles.headshot}
                  style={{ objectPosition: member.imagePosition }}
                />
              </div>

              <div className={styles.textPanel}>
                <div className={styles.textShell}>
                  {member.role ? <p className={styles.role}>{member.role}</p> : null}
                  <h2 className={styles.memberName}>{member.name}</h2>
                  {member.description.map((paragraph) => (
                    <p key={paragraph} className={styles.description}>
                      {paragraph}
                    </p>
                  ))}
                  <a href={member.buttonHref} className={styles.bookButton}>
                    {member.buttonLabel}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
