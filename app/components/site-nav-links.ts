export type SiteNavLink = {
  label: string;
  href: string;
};

export const BOOKSY_APPOINTMENT_URL = "http://westcoastbeautyco.booksy.com/a/";

export const SITE_NAV_LINKS: SiteNavLink[] = [
  { label: "Home", href: "/" },
  { label: "Book appointment", href: BOOKSY_APPOINTMENT_URL },
  { label: "The Beauty Consultant", href: "/the-beauty-consultant" },
  { label: "Meet The Team", href: "/meet-the-team" },
  { label: "Contact", href: "/contact" },
];
