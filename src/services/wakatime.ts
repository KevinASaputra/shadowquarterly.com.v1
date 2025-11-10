import fs from 'fs';
import path from 'path';
import axios from 'axios';
import querystring from 'querystring';

const CLIENT_ID = process.env.WAKATIME_CLIENT_ID!;
const CLIENT_SECRET = process.env.WAKATIME_CLIENT_SECRET!;
const TOKEN_FILE = path.join(process.cwd(), 'data', 'refreshToken.json');

const TOKEN_ENDPOINT = 'https://wakatime.com/oauth/token';
const STATS_ENDPOINT = 'https://wakatime.com/api/v1/users/current/stats';
const ALL_TIME_SINCE_TODAY =
  'https://wakatime.com/api/v1/users/current/all_time_since_today';
const API_KEY = process.env.WAKATIME_API_KEY!;

type TokenStore = {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: string;
};

function readTokenFile(): TokenStore | null {
  try {
    if (!fs.existsSync(TOKEN_FILE)) return null;
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

function saveTokenFile(data: TokenStore) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(data, null, 2));
}

function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() - 30_000 < Date.now();
}

export const getAccessToken = async (): Promise<string> => {
  const cached = readTokenFile();

  if (cached && cached.access_token && !isTokenExpired(cached.expires_at)) {
    console.log('[getAccessToken] Using cached token');
    return cached.access_token;
  }

  if (!cached?.refresh_token)
    throw new Error('No refresh_token available in local storage');

  console.log('[getAccessToken] Refreshing token from WakaTime...');

  try {
    const resp = await axios.post(
      TOKEN_ENDPOINT,
      querystring.stringify({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: cached.refresh_token,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );

    let access_token: string | null = null;
    let refresh_token: string | null = null;
    let expires_at: string | null = null;

    if (typeof resp.data === 'string') {
      const params = new URLSearchParams(resp.data);
      access_token = params.get('access_token');
      refresh_token = params.get('refresh_token') || cached.refresh_token;
      expires_at = decodeURIComponent(params.get('expires_at') || '');
    } else {
      access_token = resp.data.access_token;
      refresh_token = resp.data.refresh_token || cached.refresh_token;
      expires_at =
        decodeURIComponent(resp.data.expires_at || '') ||
        new Date(Date.now() + 3600 * 1000).toISOString();
    }

    if (!access_token)
      throw new Error('No access_token returned from WakaTime');

    saveTokenFile({ access_token, refresh_token, expires_at });
    console.log('[getAccessToken] Token refreshed successfully ✅');
    return access_token;
  } catch (err: any) {
    console.error(
      '[getAccessToken] Failed:',
      err.response?.data ?? err.message
    );
    if (cached?.access_token) {
      console.warn('[getAccessToken] Using last valid cached token (fallback)');
      return cached.access_token;
    }
    throw new Error('Failed to refresh access token');
  }
};

export const getReadStats = async (): Promise<{
  status: number;
  data: any;
}> => {
  try {
    const access_token = await getAccessToken();
    const resp = await axios.get(
      `${STATS_ENDPOINT}/last_7_days?api_key=${API_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: 'application/json',
        },
        timeout: 10000,
      }
    );

    const data = resp.data?.data;
    return {
      status: resp.status,
      data: {
        start_date: data?.start ?? null,
        end_date: data?.end ?? null,
        last_update: data?.modified_at ?? null,
        best_day: data?.best_day ?? null,
        categories: data?.categories ?? [],
        languages: (data?.languages ?? []).slice(0, 3),
        editors: data?.editors ?? [],
        human_readable_daily_average:
          data?.human_readable_daily_average_including_other_language ??
          data?.human_readable_daily_average ??
          '0 secs',
        human_readable_total:
          data?.human_readable_total_including_other_language ??
          data?.human_readable_total ??
          '0 secs',
      },
    };
  } catch (err: any) {
    console.error(
      '[getReadStats] Error:',
      err.response?.data ?? err.message ?? err
    );
    return { status: 500, data: { error: 'Failed to fetch stats' } };
  }
};

export const getALLTimeSinceToday = async (): Promise<{
  status: number;
  data: any;
}> => {
  try {
    const access_token = await getAccessToken();
    const resp = await axios.get(
      'https://wakatime.com/api/v1/users/current/all_time_since_today',
      {
        headers: { Authorization: `Bearer ${access_token}` },
        timeout: 10000,
      }
    );

    const d = resp.data?.data ?? {};

    if (!d.text && !d.total_seconds) {
      console.warn(
        '[getALLTimeSinceToday] Empty data received from WakaTime:',
        d
      );
    }

    return {
      status: resp.status,
      data: {
        text: d.text || 'N/A',
        total_seconds: d.total_seconds || 0,
      },
    };
  } catch (err: any) {
    console.error(
      '[getALLTimeSinceToday] Error:',
      err.response?.data ?? err.message ?? err
    );
    return { status: 500, data: { error: 'Failed to fetch all time stats' } };
  }
};
