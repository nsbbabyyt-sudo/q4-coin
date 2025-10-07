export async function GET() {
  const sha = (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0,7) || "local";
  const msg = process.env.VERCEL_GIT_COMMIT_MESSAGE || "";
  const url = process.env.VERCEL_URL || "";
  const builtAt = new Date().toISOString();
  return new Response(JSON.stringify({ sha, msg, url, builtAt }), {
    headers: { "content-type": "application/json" },
  });
}