"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { SiteHeader } from "./site-header";
import { SITE_NAV_LINKS } from "./site-nav-links";
import styles from "./home-bottlerock-promo.module.css";

const BOTTLE_ROCK_ROUTE = "/bottlerock";
const PROMO_VISITED_KEY = "wcbc:bottlerock:visited";
const POPUP_DISMISSED_AT_KEY = "wcbc:bottlerock:popup-dismissed-at";
const BANNER_DISMISSED_SESSION_KEY = "wcbc:bottlerock:banner-dismissed-session";
const PROMO_STATE_EVENT = "wcbc:bottlerock:state-change";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const ALWAYS_SHOW_POPUP_FOR_DEMO = true;

type PromoState = {
  hydrated: boolean;
  showPopup: boolean;
  showBanner: boolean;
};

const INITIAL_PROMO_STATE: PromoState = {
  hydrated: false,
  showPopup: false,
  showBanner: false,
};

let cachedPromoSnapshot: PromoState = INITIAL_PROMO_STATE;
let popupDismissedForCurrentView = false;
let bannerDismissedForCurrentView = false;

function computePromoState(): PromoState {
  if (typeof window === "undefined") {
    return INITIAL_PROMO_STATE;
  }

  if (ALWAYS_SHOW_POPUP_FOR_DEMO) {
    if (popupDismissedForCurrentView) {
      return {
        hydrated: true,
        showPopup: false,
        showBanner: !bannerDismissedForCurrentView,
      };
    }

    return { hydrated: true, showPopup: true, showBanner: false };
  }

  const hasVisited = window.localStorage.getItem(PROMO_VISITED_KEY) === "1";
  if (hasVisited) {
    return { hydrated: true, showPopup: false, showBanner: false };
  }

  const dismissedAtRaw = window.localStorage.getItem(POPUP_DISMISSED_AT_KEY);
  const dismissedAt = dismissedAtRaw ? Number(dismissedAtRaw) : NaN;
  const dismissedRecently = Number.isFinite(dismissedAt) && Date.now() - dismissedAt < ONE_DAY_MS;
  const bannerDismissedThisSession =
    window.sessionStorage.getItem(BANNER_DISMISSED_SESSION_KEY) === "1";

  if (dismissedRecently) {
    return {
      hydrated: true,
      showPopup: false,
      showBanner: !bannerDismissedThisSession,
    };
  }

  return { hydrated: true, showPopup: true, showBanner: false };
}

function snapshotsEqual(a: PromoState, b: PromoState) {
  return (
    a.hydrated === b.hydrated &&
    a.showPopup === b.showPopup &&
    a.showBanner === b.showBanner
  );
}

function readPromoState(): PromoState {
  const nextSnapshot = computePromoState();

  if (snapshotsEqual(cachedPromoSnapshot, nextSnapshot)) {
    return cachedPromoSnapshot;
  }

  cachedPromoSnapshot = nextSnapshot;
  return cachedPromoSnapshot;
}

export function HomeBottleRockPromo() {
  const promoState = useSyncExternalStore(subscribeToPromoState, readPromoState, () =>
    INITIAL_PROMO_STATE
  );

  useEffect(() => {
    if (!promoState.showPopup) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [promoState.showPopup]);

  const markPromoVisited = () => {
    window.localStorage.setItem(PROMO_VISITED_KEY, "1");
    window.localStorage.removeItem(POPUP_DISMISSED_AT_KEY);
    window.sessionStorage.removeItem(BANNER_DISMISSED_SESSION_KEY);
    window.dispatchEvent(new Event(PROMO_STATE_EVENT));
  };

  const dismissPopup = () => {
    if (ALWAYS_SHOW_POPUP_FOR_DEMO) {
      popupDismissedForCurrentView = true;
      bannerDismissedForCurrentView = false;
      window.dispatchEvent(new Event(PROMO_STATE_EVENT));
      return;
    }

    window.localStorage.setItem(POPUP_DISMISSED_AT_KEY, String(Date.now()));
    window.dispatchEvent(new Event(PROMO_STATE_EVENT));
  };

  const dismissBannerForSession = () => {
    if (ALWAYS_SHOW_POPUP_FOR_DEMO) {
      bannerDismissedForCurrentView = true;
      window.dispatchEvent(new Event(PROMO_STATE_EVENT));
      return;
    }

    window.sessionStorage.setItem(BANNER_DISMISSED_SESSION_KEY, "1");
    window.dispatchEvent(new Event(PROMO_STATE_EVENT));
  };

  const promoSlot = promoState.hydrated ? (
    <AnimatePresence>
      {promoState.showBanner ? (
        <motion.div
          className={styles.bannerWrap}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.2, 1, 0.36, 1] }}
        >
          <section className={styles.banner} aria-label="BottleRock event promotion">
            <div className={styles.bannerInner}>
              <div className={styles.bannerLogoWrap}>
                <Image
                  src="/BR25-Logo-Black-NapaValley.avif"
                  alt="BottleRock Napa Valley logo"
                  fill
                  sizes="(max-width: 749px) 98px, 124px"
                  className={styles.bannerLogo}
                />
              </div>
              <p className={styles.bannerCopy}>
                BottleRock weekend is live. Explore the West Coast Beauty Co. event experience.
              </p>
              <Link
                href={BOTTLE_ROCK_ROUTE}
                className={styles.bannerCta}
                onClick={markPromoVisited}
              >
                View Event
              </Link>
              <button
                type="button"
                className={styles.bannerDismiss}
                onClick={dismissBannerForSession}
                aria-label="Dismiss BottleRock promotion banner for this session"
              >
                Close
              </button>
            </div>
          </section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  ) : undefined;

  return (
    <>
      <SiteHeader
        links={SITE_NAV_LINKS}
        activeHref="/"
        promoSlot={promoSlot}
        forceSolidBackground={promoState.hydrated && promoState.showBanner}
      />
      <AnimatePresence>
        {promoState.hydrated && promoState.showPopup ? (
          <motion.div
            className={styles.popupBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <motion.section
              className={styles.popupCard}
              role="dialog"
              aria-modal="true"
              aria-label="BottleRock event promotion"
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              transition={{ duration: 0.36, ease: [0.2, 1, 0.36, 1] }}
            >
              <button
                type="button"
                className={styles.popupDismiss}
                onClick={dismissPopup}
                aria-label="Close BottleRock promotion"
              >
                Close
              </button>

              <div className={styles.popupImageWrap}>
                <Image
                  src="/bottlerockstage.png"
                  alt="BottleRock stage crowd scene"
                  fill
                  priority
                  sizes="(max-width: 980px) 100vw, 64vw"
                  className={styles.popupBackgroundImage}
                />
                <Image
                  src="/bottlerockconfetti.jpg"
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(max-width: 980px) 100vw, 64vw"
                  className={styles.popupConfettiImage}
                />
                <div className={styles.popupImageGradient} />
              </div>

              <div className={styles.popupContent}>
                <div className={styles.popupLockupWrap}>
                  <Image
                    src="/West Coast Beauty Co. x BottleRock.png"
                    alt="West Coast Beauty Co. x BottleRock event lockup"
                    fill
                    sizes="(max-width: 749px) 128px, 146px"
                    className={styles.popupLockup}
                  />
                </div>
                <p className={styles.popupEyebrow}>Napa Valley | Limited-time Event</p>
                <h2 className={styles.popupTitle}>Step Into Our BottleRock Experience</h2>
                <p className={styles.popupCopy}>
                  Discover the full event lineup, highlights, and where to find West Coast Beauty
                  Co. throughout the weekend.
                </p>
                <div className={styles.popupActions}>
                  <Link
                    href={BOTTLE_ROCK_ROUTE}
                    className={styles.popupPrimaryCta}
                    onClick={markPromoVisited}
                  >
                    Go To Event Page
                  </Link>
                  <button
                    type="button"
                    className={styles.popupSecondaryAction}
                    onClick={dismissPopup}
                  >
                    Not now
                  </button>
                </div>
              </div>
            </motion.section>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function subscribeToPromoState(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === PROMO_VISITED_KEY ||
      event.key === POPUP_DISMISSED_AT_KEY ||
      event.key === BANNER_DISMISSED_SESSION_KEY
    ) {
      onStoreChange();
    }
  };

  const onLocalStateChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(PROMO_STATE_EVENT, onLocalStateChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PROMO_STATE_EVENT, onLocalStateChange);
  };
}
