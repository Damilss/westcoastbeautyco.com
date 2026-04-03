"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_BEHOLD_FEED_URL,
  fetchBeholdFeed,
  type InstagramFeedItem,
} from "../lib/behold-feed";
import styles from "./instagram-feed.module.css";

type InstagramFeedProps = {
  feedUrl?: string;
  limit?: number;
  className?: string;
};

function formatDate(timestamp: string): string {
  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(parsed);
}

export function InstagramFeed({
  feedUrl = DEFAULT_BEHOLD_FEED_URL,
  limit = 10,
  className,
}: InstagramFeedProps) {
  const [items, setItems] = useState<InstagramFeedItem[]>([]);
  const [username, setUsername] = useState("westcoastbeauty.co");
  const [hasError, setHasError] = useState(false);

  const resolvedFeedUrl = feedUrl.trim();
  const profileUrl = useMemo(() => {
    const cleanHandle = username.replace(/^@/, "").trim();
    return `https://www.instagram.com/${cleanHandle}/`;
  }, [username]);

  useEffect(() => {
    if (!resolvedFeedUrl) {
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    fetchBeholdFeed({
      feedUrl: resolvedFeedUrl,
      limit,
      signal: controller.signal,
    })
      .then((payload) => {
        if (cancelled) return;
        setItems(payload.items);
        setUsername(payload.username);
        setHasError(false);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
        setHasError(true);
        setItems([]);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [limit, resolvedFeedUrl]);

  if (!resolvedFeedUrl) {
    return null;
  }

  const statusMessage = hasError
    ? "Instagram feed is temporarily unavailable."
    : items.length > 0
      ? `Latest posts from @${username}`
      : "Loading latest posts...";

  return (
    <section
      className={[styles.instagramSection, className].filter(Boolean).join(" ")}
      aria-labelledby="instagram-heading"
    >
      <div className={styles.instagramSectionInner}>
        <header className={styles.instagramHeader}>
          <div>
            <p className={styles.eyebrow}>Instagram</p>
            <h2 id="instagram-heading">Follow the latest work</h2>
            <p className={styles.instagramSubcopy}>Live posts from our public Instagram feed.</p>
          </div>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
            View profile
          </a>
        </header>

        <p className={styles.status} aria-live="polite">
          {statusMessage}
        </p>

        {items.length > 0 ? (
          <div className={styles.grid}>
            {items.map((item) => {
              const caption = item.caption || "View this post on Instagram";
              const dateLabel = formatDate(item.timestamp);

              return (
                <a
                  key={item.id}
                  href={item.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                  aria-label="Open Instagram post"
                >
                  <img src={item.previewUrl} alt={caption} loading="lazy" className={styles.cardImage} />
                  {item.mediaType === "VIDEO" || item.isReel ? (
                    <span className={styles.videoBadge} aria-hidden="true">
                      <PlayIcon />
                    </span>
                  ) : null}
                  <div className={styles.cardMeta}>
                    <p className={styles.cardCaption}>{caption}</p>
                    {dateLabel ? (
                      <time className={styles.cardDate} dateTime={item.timestamp}>
                        {dateLabel}
                      </time>
                    ) : null}
                  </div>
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6.4 18 12 8 17.6V6.4Z" />
    </svg>
  );
}
