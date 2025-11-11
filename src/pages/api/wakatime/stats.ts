import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const REFRESH_FILE =
  process.env.WAKATIME_REFRESH_STORE_FILE || '.wakatime_refresh_token';

async function readRefreshToken() {
  try {
    const abs = path.resolve(process.cwd(), REFRESH_FILE);
    const data = await fs.readFile(abs, 'utf8');
    return data.trim();
  } catch {
    return null;
  }
}

export default async function GET() {
  const refreshToken = await readRefreshToken();
  if (!refreshToken)
    return NextResponse.json(
      { error: 'No refresh token found' },
      { status: 400 }
    );

  const res = await fetch('https://wakatime.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.WAKATIME_CLIENT_ID!,
      client_secret: process.env.WAKATIME_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const tokenData: { access_token: string } = await res.json();
  if (!res.ok)
    return NextResponse.json({ error: 'Token refresh failed', tokenData });

  const api = await fetch(
    'https://wakatime.com/api/v1/users/current/stats/last_7_days',
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  );

  const data = await api.json();
  if (!api.ok)
    return NextResponse.json({ error: 'Failed to fetch WakaTime data', data });

  return NextResponse.json({ ok: true, data });
}
