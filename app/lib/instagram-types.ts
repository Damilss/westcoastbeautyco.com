export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type InstagramFeedChild = {
  id: string;
  mediaType: InstagramMediaType;
  mediaUrl: string;
  thumbnailUrl: string | null;
  permalink: string;
};

export type InstagramFeedItem = {
  id: string;
  permalink: string;
  caption: string;
  timestamp: string;
  mediaType: InstagramMediaType;
  thumbnailUrl: string | null;
  mediaUrl: string;
  children: InstagramFeedChild[];
};

export type InstagramFeedSource = "instagram_api" | "fallback_local";

export type InstagramFeedResult = {
  items: InstagramFeedItem[];
  source: InstagramFeedSource;
  fetchedAt: string;
};
