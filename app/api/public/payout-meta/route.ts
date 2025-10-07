export async function GET() {
  // Minimal placeholder; replace with real KV-read later
  const periodDays = 7;
  const lastRunAt: string | null = null; // e.g., new Date().toISOString()
  return new Response(JSON.stringify({ ok: true, lastRunAt, periodDays }), {
    headers: { "content-type": "application/json" },
  });
}