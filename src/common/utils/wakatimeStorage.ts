import fs from 'fs';
import path from 'path';
const TOKEN_FILE_PATH = path.resolve(process.cwd(), 'data/wakatime_token.json');

export const getStoredRefreshToken = (): string | null => {
  if (!fs.existsSync(TOKEN_FILE_PATH)) return null;
  try {
    const raw = fs.readFileSync(TOKEN_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed?.refresh_token ?? null;
  } catch (e) {
    console.error('[wakatime-storage] read error', e);
    return null;
  }
};

export const saveRefreshToken = (refresh_token: string): void => {
  try {
    fs.mkdirSync(path.dirname(TOKEN_FILE_PATH), { recursive: true });
    fs.writeFileSync(
      TOKEN_FILE_PATH,
      JSON.stringify({ refresh_token }, null, 2),
      'utf-8'
    );
    console.log('[wakatime-storage] saved refresh token');
  } catch (e) {
    console.error('[wakatime-storage] save error', e);
  }
};
