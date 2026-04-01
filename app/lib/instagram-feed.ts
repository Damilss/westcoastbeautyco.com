import "server-only";

import { getFallbackInstagramItems } from "./instagram-fallback";
import type {
  InstagramFeedChild,
  InstagramFeedItem,
  InstagramFeedResult,
  InstagramMediaType,
} from "./instagram-types";

const DEFAULT_FEED_LIMIT = 10;
const MAX_FEED_LIMIT = 20;
const DEFAULT_CACHE_TTL_SECONDS = 1800;
const GRAPH_API_VERSION = "v23.0";
const PROFILE_URL = "https://www.instagram.com/westcoastbeauty.co/";

type InstagramApiChild = {
  id?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
};

type InstagramApiMedia = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: {
    data?: InstagramApiChild[];
  };
};

type InstagramApiDataResponse<T> = {
  data?: T[];
};

type CacheEntry = {
  expiresAt: number;
  value: InstagramFeedResult;
};

const feedCache = new Map<number, CacheEntry>();

function getCacheTtlSeconds(): number {
  const raw = Number.parseInt(process.env.INSTAGRAM_CACHE_TTL_SECONDS ?? "", 10);

  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_CACHE_TTL_SECONDS;
  }

  return raw;
}

function getDefaultFeedLimit(): number {
  const raw = Number.parseInt(process.env.INSTAGRAM_FEED_LIMIT ?? "", 10);

  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_FEED_LIMIT;
  }

  return Math.min(raw, MAX_FEED_LIMIT);
}

function sanitizeLimit(limit?: number): number {
  if (!Number.isFinite(limit)) {
    return getDefaultFeedLimit();
  }

  const normalized = Math.trunc(limit ?? getDefaultFeedLimit());
  if (normalized <= 0) {
    return getDefaultFeedLimit();
  }

  return Math.min(normalized, MAX_FEED_LIMIT);
}

function normalizeMediaType(value: string | undefined): InstagramMediaType {
  if (value === "VIDEO") return "VIDEO";
  if (value === "CAROUSEL_ALBUM") return "CAROUSEL_ALBUM";
  return "IMAGE";
}

function normalizeHandle(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/^@/, "");
}

function normalizeTimestamp(value: string | undefined): string {
  if (!value) return new Date().toISOString();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function normalizeChildren(children: InstagramApiChild[] | undefined): InstagramFeedChild[] {
  if (!children?.length) return [];

  return children
    .map((child, index) => {
      const mediaUrl = child.media_url ?? child.thumbnail_url;
      if (!mediaUrl) return null;

      return {
        id: child.id ?? `child-${index}`,
        mediaType: normalizeMediaType(child.media_type),
        mediaUrl,
        thumbnailUrl: child.thumbnail_url ?? null,
        permalink: child.permalink ?? PROFILE_URL,
      } satisfies InstagramFeedChild;
    })
    .filter((item): item is InstagramFeedChild => Boolean(item));
}

function normalizeItem(item: InstagramApiMedia): InstagramFeedItem | null {
  const children = normalizeChildren(item.children?.data);
  const mediaType = normalizeMediaType(item.media_type);
  const resolvedMediaUrl =
    item.media_url ?? item.thumbnail_url ?? children[0]?.mediaUrl ?? children[0]?.thumbnailUrl;

  if (!item.id || !resolvedMediaUrl) return null;

  return {
    id: item.id,
    permalink: item.permalink ?? PROFILE_URL,
    caption: item.caption ?? "",
    timestamp: normalizeTimestamp(item.timestamp),
    mediaType,
    thumbnailUrl: item.thumbnail_url ?? children[0]?.thumbnailUrl ?? null,
    mediaUrl: resolvedMediaUrl,
    children,
  };
}

function normalizeItems(data: InstagramApiMedia[] | undefined, limit: number): InstagramFeedItem[] {
  if (!data?.length) return [];

  return data.map(normalizeItem).filter((item): item is InstagramFeedItem => Boolean(item)).slice(0, limit);
}

async function fetchJson<T>(url: URL): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Instagram API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

async function fetchInstagramUsername(
  accessToken: string,
  igUserId?: string,
): Promise<string | null> {
  try {
    if (igUserId) {
      const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igUserId}`);
      url.searchParams.set("fields", "username");
      url.searchParams.set("access_token", accessToken);

      const result = await fetchJson<{ username?: string }>(url);
      return result.username ?? null;
    }

    const url = new URL("https://graph.instagram.com/me");
    url.searchParams.set("fields", "username");
    url.searchParams.set("access_token", accessToken);

    const result = await fetchJson<{ username?: string }>(url);
    return result.username ?? null;
  } catch {
    return null;
  }
}

async function fetchInstagramItems(accessToken: string, limit: number): Promise<InstagramFeedItem[]> {
  const fields =
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{id,media_type,media_url,thumbnail_url,permalink}";
  const igUserId = process.env.INSTAGRAM_IG_USER_ID?.trim();

  const primaryUrl = igUserId
    ? new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igUserId}/media`)
    : new URL("https://graph.instagram.com/me/media");

  primaryUrl.searchParams.set("fields", fields);
  primaryUrl.searchParams.set("limit", String(limit));
  primaryUrl.searchParams.set("access_token", accessToken);

  const response = await fetchJson<InstagramApiDataResponse<InstagramApiMedia>>(primaryUrl);
  return normalizeItems(response.data, limit);
}

function fallbackResult(limit: number): InstagramFeedResult {
  return {
    items: getFallbackInstagramItems(limit),
    source: "fallback_local",
    fetchedAt: new Date().toISOString(),
  };
}

async function resolveLiveFeed(limit: number): Promise<InstagramFeedResult> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const expectedHandle = normalizeHandle(process.env.INSTAGRAM_ACCOUNT_HANDLE ?? "westcoastbeauty.co");
  const igUserId = process.env.INSTAGRAM_IG_USER_ID?.trim();

  if (!accessToken) {
    return fallbackResult(limit);
  }

  try {
    const [items, username] = await Promise.all([
      fetchInstagramItems(accessToken, limit),
      fetchInstagramUsername(accessToken, igUserId),
    ]);

    if (!items.length) {
      return fallbackResult(limit);
    }

    const normalizedUsername = normalizeHandle(username ?? undefined);
    if (expectedHandle && normalizedUsername && normalizedUsername !== expectedHandle) {
      return fallbackResult(limit);
    }

    return {
      items,
      source: "instagram_api",
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return fallbackResult(limit);
  }
}

export function getInstagramCacheTtlSeconds(): number {
  return getCacheTtlSeconds();
}

export async function getInstagramFeed(options?: { limit?: number }): Promise<InstagramFeedResult> {
  const limit = sanitizeLimit(options?.limit);
  const now = Date.now();
  const existing = feedCache.get(limit);

  if (existing && existing.expiresAt > now) {
    return existing.value;
  }

  const value = await resolveLiveFeed(limit);
  const ttlMs = getCacheTtlSeconds() * 1000;

  feedCache.set(limit, {
    expiresAt: now + ttlMs,
    value,
  });

  return value;
}
