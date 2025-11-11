import { getReadStats, getALLTimeSinceToday } from '@/services/wakatime';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [stats, all_time] = await Promise.all([
      getReadStats(),
      getALLTimeSinceToday(),
    ]);

    if (stats.status !== 200 && all_time.status !== 200) {
      return res.status(500).json({
        message: 'Failed to load WakaTime data',
        error: { stats: stats.status, all_time: all_time.status },
      });
    }

    return res.status(200).json({
      message: 'OK',
      stats: stats.data,
      all_time: all_time.data,
    });
  } catch (err: any) {
    console.error('[API] read-stats error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
