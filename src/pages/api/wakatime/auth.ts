import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const clientId = process.env.WAKATIME_CLIENT_ID!;
  const redirectUri = process.env.WAKATIME_REDIRECT_URI!;
  const scope = encodeURIComponent('read_stats');

  const authorizeUrl = `https://wakatime.com/oauth/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;

  res.writeHead(302, { Location: authorizeUrl });
  res.end();
}
