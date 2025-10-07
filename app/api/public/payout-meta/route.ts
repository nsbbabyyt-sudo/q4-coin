export async function GET() {
  const periodDays = 7;
  const lastRunAt: string | null = null;
  return new Response(JSON.stringify({ ok: true, lastRunAt, periodDays }), {
    headers: { "content-type": "application/json" },
  });
}