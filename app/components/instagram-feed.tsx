"use client";

import BeholdWidget from "@behold/react";
import styles from "./instagram-feed.module.css";

type InstagramFeedProps = {
  feedId?: string;
  className?: string;
};

export function InstagramFeed({
  feedId = process.env.NEXT_PUBLIC_BEHOLD_FEED_ID,
  className,
}: InstagramFeedProps) {
  const resolvedFeedId = feedId?.trim();

  if (!resolvedFeedId) {
    return null;
  }

  return (
    <section
      className={[styles.instagramSection, className].filter(Boolean).join(" ")}
      aria-labelledby="instagram-heading"
    >
      <div className={styles.instagramSectionInner}>
        <header className={styles.instagramHeader}>
          <p className={styles.eyebrow}>Instagram</p>
          <h2 id="instagram-heading">Follow the latest work</h2>
          <p className={styles.instagramSubcopy}>Live feed powered by Instagram.</p>
        </header>
        <div className={styles.instagramWidgetShell}>
          <BeholdWidget feedId={resolvedFeedId} />
        </div>
      </div>
    </section>
  );
}
