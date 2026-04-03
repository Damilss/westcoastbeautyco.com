"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_BEHOLD_FEED_URL,
  fetchBeholdFeed,
  type InstagramFeedItem,
  type InstagramFeedPayload,
} from "../lib/behold-feed";
import styles from "./instagram-feed.module.css";

type InstagramFeedProps = {
  feedUrl?: string;
  limit?: number;
  className?: string;
};

type InstagramProfile = Omit<InstagramFeedPayload, "items">;

const DEFAULT_PROFILE: InstagramProfile = {
  username: "westcoastbeauty.co",
  biography: "",
  website: null,
  followersCount: 0,
  followsCount: 0,
  postsCount: 0,
  profilePictureUrl: null,
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

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function getWebsiteLabel(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

export function InstagramFeed({
  feedUrl = DEFAULT_BEHOLD_FEED_URL,
  limit = 9,
  className,
}: InstagramFeedProps) {
  const [items, setItems] = useState<InstagramFeedItem[]>([]);
  const [profile, setProfile] = useState<InstagramProfile>(DEFAULT_PROFILE);
  const [hasError, setHasError] = useState(false);

  const resolvedFeedUrl = feedUrl.trim();
  const profileUrl = useMemo(() => {
    const cleanHandle = profile.username.replace(/^@/, "").trim();
    return `https://www.instagram.com/${cleanHandle}/`;
  }, [profile.username]);

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
        setProfile({
          username: payload.username,
          biography: payload.biography,
          website: payload.website,
          followersCount: payload.followersCount,
          followsCount: payload.followsCount,
          postsCount: payload.postsCount,
          profilePictureUrl: payload.profilePictureUrl,
        });
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
    ? "Feed temporarily unavailable."
    : items.length > 0
      ? `Live preview from @${profile.username}`
      : "Loading profile and posts...";

  return (
    <section
      className={[styles.instagramSection, className].filter(Boolean).join(" ")}
      aria-labelledby="instagram-heading"
    >
      <div className={styles.instagramSectionInner}>
        <p className={styles.eyebrow}>Instagram</p>
        <h2 id="instagram-heading">Inside West Coast Beauty</h2>
        <p className={styles.instagramSubcopy}>
          A miniature desktop-style profile preview, styled to match the site.
        </p>

        <article className={styles.desktopMockup} aria-label="Instagram profile preview">
          <header className={styles.chromeBar}>
            <div className={styles.chromeDots} aria-hidden="true">
              <span className={styles.dotRose} />
              <span className={styles.dotCream} />
              <span className={styles.dotCharcoal} />
            </div>
            <p className={styles.chromeTitle}>instagram.com/{profile.username}</p>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
              Open Profile
            </a>
          </header>

          <div className={styles.mockupBody}>
            <aside className={styles.profilePanel}>
              <div className={styles.profileCard}>
                <div className={styles.avatarWrap}>
                  {profile.profilePictureUrl ? (
                    <Image
                      src={profile.profilePictureUrl}
                      alt={`@${profile.username} profile photo`}
                      width={108}
                      height={108}
                      className={styles.avatarImage}
                      sizes="108px"
                    />
                  ) : (
                    <div className={styles.avatarFallback} aria-hidden="true">
                      WC
                    </div>
                  )}
                </div>

                <p className={styles.handle}>@{profile.username}</p>

                <dl className={styles.statGrid}>
                  <div>
                    <dt>Posts</dt>
                    <dd>{formatCount(profile.postsCount)}</dd>
                  </div>
                  <div>
                    <dt>Followers</dt>
                    <dd>{formatCount(profile.followersCount)}</dd>
                  </div>
                  <div>
                    <dt>Following</dt>
                    <dd>{formatCount(profile.followsCount)}</dd>
                  </div>
                </dl>

                {profile.biography ? <p className={styles.bio}>{profile.biography}</p> : null}

                {profile.website ? (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteLink}
                  >
                    {getWebsiteLabel(profile.website)}
                  </a>
                ) : null}
              </div>

              <p className={styles.status} aria-live="polite">
                {statusMessage}
              </p>
            </aside>

            <section className={styles.feedPanel} aria-label="Recent Instagram posts">
              <p className={styles.feedPanelLabel}>Recent Posts</p>

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
                        <Image
                          src={item.previewUrl}
                          alt={caption}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 980px) 31vw, 24vw"
                          className={styles.cardImage}
                        />
                        {item.mediaType === "VIDEO" || item.isReel ? (
                          <span className={styles.videoBadge} aria-hidden="true">
                            <PlayIcon />
                          </span>
                        ) : null}
                        {dateLabel ? <time className={styles.cardDate}>{dateLabel}</time> : null}
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyState}>No posts are available right now.</div>
              )}
            </section>
          </div>
        </article>
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
