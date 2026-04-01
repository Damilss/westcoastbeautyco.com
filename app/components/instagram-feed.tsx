"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FALLBACK_INSTAGRAM_ITEMS } from "../lib/instagram-fallback";
import type { InstagramFeedItem, InstagramFeedResult, InstagramMediaType } from "../lib/instagram-types";
import styles from "./instagram-feed.module.css";

type InstagramFeedProps = {
  limit?: number;
  accountHandle?: string;
};

type FeedSource = "instagram_api" | "fallback_local";

const DEFAULT_LIMIT = 10;

function getPrimaryMedia(item: InstagramFeedItem): {
  mediaUrl: string;
  mediaType: InstagramMediaType;
} {
  if (item.mediaType === "CAROUSEL_ALBUM" && item.children.length > 0) {
    const firstChild = item.children[0];

    return {
      mediaUrl: firstChild.thumbnailUrl ?? firstChild.mediaUrl,
      mediaType: firstChild.mediaType,
    };
  }

  if (item.mediaType === "VIDEO") {
    return {
      mediaUrl: item.thumbnailUrl ?? item.mediaUrl,
      mediaType: "VIDEO",
    };
  }

  return {
    mediaUrl: item.mediaUrl,
    mediaType: "IMAGE",
  };
}

function getModalMedia(item: InstagramFeedItem): {
  mediaUrl: string;
  mediaType: InstagramMediaType;
} {
  if (item.mediaType === "CAROUSEL_ALBUM" && item.children.length > 0) {
    const firstChild = item.children[0];

    return {
      mediaUrl: firstChild.mediaUrl,
      mediaType: firstChild.mediaType,
    };
  }

  return {
    mediaUrl: item.mediaUrl,
    mediaType: item.mediaType,
  };
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  }).format(date);
}

export function InstagramFeed({
  limit = DEFAULT_LIMIT,
  accountHandle = "westcoastbeauty.co",
}: InstagramFeedProps) {
  const fallbackItems = useMemo(() => FALLBACK_INSTAGRAM_ITEMS.slice(0, limit), [limit]);
  const [items, setItems] = useState<InstagramFeedItem[]>(fallbackItems);
  const [source, setSource] = useState<FeedSource>("fallback_local");
  const [fetchedAt, setFetchedAt] = useState<string>(new Date().toISOString());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadFeed() {
      try {
        const response = await fetch(`/api/instagram/feed?limit=${limit}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Feed request failed (${response.status})`);
        }

        const payload = (await response.json()) as InstagramFeedResult;
        const nextItems = Array.isArray(payload.items) && payload.items.length > 0 ? payload.items : fallbackItems;

        if (!cancelled) {
          setItems(nextItems);
          setSource(payload.source ?? "fallback_local");
          setFetchedAt(typeof payload.fetchedAt === "string" ? payload.fetchedAt : new Date().toISOString());
        }
      } catch {
        if (!cancelled) {
          setItems(fallbackItems);
          setSource("fallback_local");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadFeed();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fallbackItems, limit]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => {
          if (current === null) return null;
          return (current - 1 + items.length) % items.length;
        });
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => {
          if (current === null) return null;
          return (current + 1) % items.length;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, items.length]);

  const activeItem = activeIndex === null ? null : items[activeIndex];
  const activeMedia = activeItem ? getModalMedia(activeItem) : null;
  const handleLabel = accountHandle.startsWith("@") ? accountHandle : `@${accountHandle}`;

  const goPrevious = () => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current - 1 + items.length) % items.length;
    });
  };

  const goNext = () => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + 1) % items.length;
    });
  };

  return (
    <section className={styles.section} aria-label="Instagram feed">
      <h2 className={styles.visuallyHidden}>Instagram</h2>
      <div className={styles.grid}>
        {items.map((item, index) => {
          const media = getPrimaryMedia(item);
          const isVideoTile = media.mediaType === "VIDEO";

          return (
            <button
              key={item.id}
              type="button"
              className={styles.tile}
              onClick={() => setActiveIndex(index)}
              aria-label={`Open Instagram post ${index + 1}`}
            >
              <Image
                src={media.mediaUrl}
                alt=""
                fill
                sizes="(max-width: 1100px) 50vw, 20vw"
                className={styles.tileImage}
              />
              {isVideoTile ? (
                <span className={styles.videoBadge} aria-hidden="true">
                  <PlayIcon />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <p className={styles.meta} aria-live="polite">
        {source === "instagram_api" ? `Live feed updated ${formatDate(fetchedAt)}` : "Curated Instagram preview"}
        {isLoading ? "..." : ""}
      </p>

      {activeItem && activeMedia ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Instagram post details"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            onClick={(event) => {
              event.stopPropagation();
              goPrevious();
            }}
            aria-label="Previous post"
          >
            <ChevronLeftIcon />
          </button>

          <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setActiveIndex(null)}
              aria-label="Close dialog"
            >
              <CloseIcon />
            </button>

            <div className={styles.modalMedia}>
              {activeMedia.mediaType === "VIDEO" ? (
                <video
                  className={styles.mediaAsset}
                  src={activeMedia.mediaUrl}
                  controls
                  playsInline
                  autoPlay
                  preload="metadata"
                />
              ) : (
                <Image
                  src={activeMedia.mediaUrl}
                  alt=""
                  fill
                  sizes="(max-width: 1100px) 100vw, 60vw"
                  className={styles.mediaAsset}
                />
              )}
            </div>

            <div className={styles.modalDetails}>
              <div className={styles.detailsHeader}>{handleLabel}</div>
              <div className={styles.captionWrap}>
                <p className={styles.captionText}>
                  {activeItem.caption || "View this post on Instagram for full details."}
                </p>
                <a
                  href={activeItem.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewLink}
                >
                  View on Instagram
                </a>
              </div>
              <time className={styles.postDate} dateTime={activeItem.timestamp}>
                {formatDate(activeItem.timestamp)}
              </time>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.navButton} ${styles.navButtonRight}`}
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next post"
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : null}
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

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 5-7 7 7 7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9.5 5 7 7-7 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
