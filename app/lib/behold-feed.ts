export const DEFAULT_BEHOLD_FEED_URL = "https://feeds.behold.so/jidFIqDLkPBGRR83dk3E";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;
const DEFAULT_USERNAME = "westcoastbeauty.co";
export const CONFIGURED_TOTAL_POSTS = 228;

type BeholdMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

type BeholdSize = {
  mediaUrl?: string;
  height?: number;
  width?: number;
};

type BeholdSizes = {
  small?: BeholdSize;
  medium?: BeholdSize;
  large?: BeholdSize;
  full?: BeholdSize;
};

type BeholdPostChild = {
  id?: string;
  mediaType?: string;
  mediaUrl?: string;
  sizes?: BeholdSizes;
};

type BeholdPost = {
  id?: string;
  timestamp?: string;
  permalink?: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  caption?: string;
  prunedCaption?: string;
  isReel?: boolean;
  sizes?: BeholdSizes;
  children?: BeholdPostChild[];
};

type BeholdFeedResponse = {
  username?: string;
  biography?: string;
  website?: string;
  followersCount?: number;
  followsCount?: number;
  profilePictureUrl?: string;
  posts?: BeholdPost[];
};

export type InstagramFeedItem = {
  id: string;
  timestamp: string;
  permalink: string;
  caption: string;
  mediaType: BeholdMediaType;
  previewUrl: string;
  isReel: boolean;
};

export type InstagramFeedPayload = {
  username: string;
  biography: string;
  website: string | null;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePictureUrl: string | null;
  items: InstagramFeedItem[];
};

function normalizeLimit(limit?: number): number {
  if (!Number.isFinite(limit)) {
    return DEFAULT_LIMIT;
  }

  const nextLimit = Math.trunc(limit ?? DEFAULT_LIMIT);
  if (nextLimit <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(nextLimit, MAX_LIMIT);
}

function normalizeMediaType(value: string | undefined): BeholdMediaType {
  if (value === "VIDEO") return "VIDEO";
  if (value === "CAROUSEL_ALBUM") return "CAROUSEL_ALBUM";
  return "IMAGE";
}

function pickBestSizedImage(sizes: BeholdSizes | undefined): string | undefined {
  return sizes?.medium?.mediaUrl ?? sizes?.small?.mediaUrl ?? sizes?.large?.mediaUrl ?? sizes?.full?.mediaUrl;
}

function normalizePreviewUrl(post: BeholdPost): string | null {
  if (post.mediaType === "CAROUSEL_ALBUM" && Array.isArray(post.children) && post.children.length > 0) {
    const firstChild = post.children[0];
    return pickBestSizedImage(firstChild.sizes) ?? pickBestSizedImage(post.sizes) ?? null;
  }

  if (post.mediaType === "VIDEO") {
    return pickBestSizedImage(post.sizes) ?? null;
  }

  return pickBestSizedImage(post.sizes) ?? null;
}

function normalizeTimestamp(value: string | undefined): string {
  if (!value) return new Date().toISOString();

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function normalizeCaption(post: BeholdPost): string {
  return (post.prunedCaption ?? post.caption ?? "").trim();
}

function normalizeCount(value: number | undefined): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.trunc(value ?? 0));
}

function normalizeWebsite(value: string | undefined): string | null {
  const nextValue = value?.trim();
  return nextValue ? nextValue : null;
}

function normalizePostsCount(posts: BeholdPost[]): number {
  return Math.max(CONFIGURED_TOTAL_POSTS, posts.length);
}

function normalizePost(post: BeholdPost): InstagramFeedItem | null {
  if (!post.id) return null;

  const previewUrl = normalizePreviewUrl(post);
  if (!previewUrl) return null;

  return {
    id: post.id,
    timestamp: normalizeTimestamp(post.timestamp),
    permalink: post.permalink ?? `https://www.instagram.com/${DEFAULT_USERNAME}/`,
    caption: normalizeCaption(post),
    mediaType: normalizeMediaType(post.mediaType),
    previewUrl,
    isReel: Boolean(post.isReel),
  };
}

export async function fetchBeholdFeed(options?: {
  feedUrl?: string;
  limit?: number;
  signal?: AbortSignal;
}): Promise<InstagramFeedPayload> {
  const feedUrl = options?.feedUrl?.trim() || DEFAULT_BEHOLD_FEED_URL;
  const limit = normalizeLimit(options?.limit);

  const response = await fetch(feedUrl, {
    signal: options?.signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Behold feed request failed (${response.status})`);
  }

  const payload = (await response.json()) as BeholdFeedResponse;
  const posts = Array.isArray(payload.posts) ? payload.posts : [];

  return {
    username: (payload.username ?? DEFAULT_USERNAME).replace(/^@/, ""),
    biography: (payload.biography ?? "").trim(),
    website: normalizeWebsite(payload.website),
    followersCount: normalizeCount(payload.followersCount),
    followsCount: normalizeCount(payload.followsCount),
    postsCount: normalizePostsCount(posts),
    profilePictureUrl: payload.profilePictureUrl ?? null,
    items: posts.map(normalizePost).filter((item): item is InstagramFeedItem => Boolean(item)).slice(0, limit),
  };
}
