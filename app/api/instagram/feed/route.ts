import { getInstagramCacheTtlSeconds, getInstagramFeed } from "../../../lib/instagram-feed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10);
  const limit = Number.isFinite(limitParam) ? limitParam : undefined;

  const result = await getInstagramFeed({ limit });
  const ttlSeconds = getInstagramCacheTtlSeconds();

  return Response.json(result, {
    headers: {
      "Cache-Control": `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`,
    },
  });
}
