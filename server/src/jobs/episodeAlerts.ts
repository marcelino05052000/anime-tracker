import cron from 'node-cron';
import { EpisodeRelease } from '../models/EpisodeRelease.js';
import { Notification } from '../models/Notification.js';
import { AnimeListEntry } from '../models/AnimeListEntry.js';
import { ForumPost } from '../models/ForumPost.js';
import { User } from '../models/User.js';

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

interface JikanEpisode {
  mal_id: number;
  title: string;
}

interface JikanEpisodesResponse {
  data: JikanEpisode[];
  pagination: {
    has_next_page: boolean;
    last_visible_page: number;
  };
}

async function fetchLatestEpisodeNumber(malId: number): Promise<number | null> {
  try {
    const url = `${JIKAN_BASE}/anime/${malId}/episodes?page=1`;
    const res = await fetch(url);

    if (res.status === 429) {
      await delay(2000);
      return fetchLatestEpisodeNumber(malId);
    }

    if (!res.ok) return null;

    const data = (await res.json()) as JikanEpisodesResponse;

    if (data.pagination.last_visible_page > 1) {
      await delay(500);
      const lastPageUrl = `${JIKAN_BASE}/anime/${malId}/episodes?page=${data.pagination.last_visible_page}`;
      const lastRes = await fetch(lastPageUrl);

      if (lastRes.status === 429) {
        await delay(2000);
        return fetchLatestEpisodeNumber(malId);
      }

      if (!lastRes.ok) return null;
      const lastData = (await lastRes.json()) as JikanEpisodesResponse;
      return lastData.data.length > 0 ? lastData.data[lastData.data.length - 1].mal_id : null;
    }

    return data.data.length > 0 ? data.data[data.data.length - 1].mal_id : null;
  } catch {
    return null;
  }
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
    let forumPostsCreated = 0;

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

      // Auto-create episode discussion forum post
      if (!existingRelease) {
        await delay(500);
        const episodeNum = await fetchLatestEpisodeNumber(anime.mal_id);

        if (episodeNum) {
          const existingPost = await ForumPost.findOne({
            mal_id: anime.mal_id,
            category: 'episode_discussion',
            episode_number: episodeNum,
          });

          if (!existingPost) {
            // Find or skip system user
            const systemUser = await User.findOne({ username: 'system' }).lean();
            if (systemUser) {
              await ForumPost.create({
                author: systemUser._id,
                mal_id: anime.mal_id,
                anime_title: anime.title,
                anime_image_url: imageUrl,
                title: `${anime.title} — Episode ${episodeNum} Discussion`,
                body: `Discussion thread for Episode ${episodeNum} of ${anime.title}. Share your thoughts!`,
                category: 'episode_discussion',
                episode_number: episodeNum,
                tags: [],
                last_activity: new Date(),
              });
              forumPostsCreated++;
            }
          }
        }
      }
    }

    console.log(`[EpisodeAlerts] Done: ${releasesCreated} releases, ${notificationsCreated} notifications, ${forumPostsCreated} forum posts created`);
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
