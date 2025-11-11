import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const TOKEN_ENDPOINT = 'https://wakatime.com/oauth/token';
const REFRESH_FILE =
  process.env.WAKATIME_REFRESH_STORE_FILE || '.wakatime_refresh_token';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const code = req.query.code as string;
    if (!code)
      return res.status(400).json({ error: 'Missing authorization code' });

    const body = new URLSearchParams({
      client_id: process.env.WAKATIME_CLIENT_ID ?? '',
      client_secret: process.env.WAKATIME_CLIENT_SECRET ?? '',
      redirect_uri: process.env.WAKATIME_REDIRECT_URI ?? '',
      grant_type: 'authorization_code',
      code,
    });

    const tokenRes = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const contentType = tokenRes.headers.get('content-type') || '';
    let data: any;

    if (contentType.includes('application/json')) {
      data = await tokenRes.json();
    } else {
      const text = await tokenRes.text();
      console.error('Unexpected non-JSON response from WakaTime:', text);
      return res.status(500).json({
        error: 'Invalid response from WakaTime',
        raw: text.slice(0, 300),
      });
    }

    if (!tokenRes.ok || data.error) {
      console.error('WakaTime error:', data);
      return res
        .status(500)
        .json({ error: data.error || 'Token exchange failed', details: data });
    }

    if (data.refresh_token) {
      const absPath = path.resolve(process.cwd(), REFRESH_FILE);
      await fs.writeFile(absPath, data.refresh_token, 'utf8');
    }

    return res.status(200).json({
      message: 'Successfully authorized WakaTime!',
      data: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      },
    });
  } catch (err: any) {
    console.error('Error in callback handler:', err);
    return res.status(500).json({ error: err.message });
  }
}
