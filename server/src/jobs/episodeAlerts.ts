import cron from 'node-cron';
import { EpisodeRelease } from '../models/EpisodeRelease.js';
import { Notification } from '../models/Notification.js';
import { AnimeListEntry } from '../models/AnimeListEntry.js';

const JIKAN_BASE = 'https://api.jikan.moe/v4';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

interface JikanScheduleAnime {
  mal_id: number;
  title: string;
  images: {
    webp: { image_url: string };
    jpg: { image_url: string };
  };
  episodes: number | null;
  aired: {
    from: string | null;
  };
}

interface JikanScheduleResponse {
  data: JikanScheduleAnime[];
  pagination: {
    has_next_page: boolean;
    last_visible_page: number;
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSchedulePage(day: string, page: number): Promise<JikanScheduleResponse> {
  const url = `${JIKAN_BASE}/schedules?filter=${day}&page=${page}`;
  const res = await fetch(url);

  if (res.status === 429) {
    console.log('[EpisodeAlerts] Rate limited, waiting 2s...');
    await delay(2000);
    return fetchSchedulePage(day, page);
  }

  if (!res.ok) {
    throw new Error(`Jikan API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<JikanScheduleResponse>;
}

async function fetchAllScheduleForDay(day: string): Promise<JikanScheduleAnime[]> {
  const allAnime: JikanScheduleAnime[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await fetchSchedulePage(day, page);
    allAnime.push(...response.data);
    hasNext = response.pagination.has_next_page;
    page++;

    if (hasNext) {
      await delay(500);
    }
  }

  return allAnime;
}

async function processEpisodeAlerts(): Promise<void> {
  const now = new Date();
  const day = DAYS[now.getUTCDay()];
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  console.log(`[EpisodeAlerts] Running for ${day} (${today.toISOString().split('T')[0]})`);

  try {
    const animeList = await fetchAllScheduleForDay(day);
    console.log(`[EpisodeAlerts] Found ${animeList.length} anime airing on ${day}`);

    let releasesCreated = 0;
    let notificationsCreated = 0;

    for (const anime of animeList) {
      const imageUrl = anime.images.webp?.image_url || anime.images.jpg?.image_url || '';

      // Upsert EpisodeRelease (skip if already exists for this anime+date)
      const existingRelease = await EpisodeRelease.findOne({ mal_id: anime.mal_id, aired_date: today });

      if (!existingRelease) {
        await EpisodeRelease.create({
          mal_id: anime.mal_id,
          title: anime.title,
          image_url: imageUrl,
          episode_number: anime.episodes,
          aired_date: today,
        });
        releasesCreated++;
      }

      // Find all users watching this anime
      const watchers = await AnimeListEntry.find(
        { mal_id: anime.mal_id, status: 'watching' },
        { user: 1 },
      );

      if (watchers.length > 0) {
        const notifications = watchers.map((entry) => ({
          updateOne: {
            filter: { user: entry.user, mal_id: anime.mal_id, aired_date: today },
            update: {
              $setOnInsert: {
                user: entry.user,
                mal_id: anime.mal_id,
                title: anime.title,
                image_url: imageUrl,
                episode_number: anime.episodes,
                aired_date: today,
                read: false,
              },
            },
            upsert: true,
          },
        }));

        const result = await Notification.bulkWrite(notifications);
        notificationsCreated += result.upsertedCount;
      }
    }

    console.log(`[EpisodeAlerts] Done: ${releasesCreated} releases, ${notificationsCreated} notifications created`);
  } catch (error) {
    console.error('[EpisodeAlerts] Error:', error);
  }
}

export function startEpisodeAlertsJob(): void {
  // Run daily at 06:00 UTC
  cron.schedule('0 6 * * *', () => {
    processEpisodeAlerts();
  });

  console.log('[EpisodeAlerts] Cron job scheduled (daily at 06:00 UTC)');
}

// Export for manual trigger (useful for testing)
export { processEpisodeAlerts };
