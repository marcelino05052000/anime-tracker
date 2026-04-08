import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useCreatePost } from '../hooks/useCreatePost';
import AnimeSearchSelect from './AnimeSearchSelect';
import type { Anime, ForumCategory } from '@/types';

const CATEGORIES: ForumCategory[] = [
  'discussion',
  'theories',
  'reviews',
  'spoilers',
  'news',
  'episode_discussion',
];

export default function ForumNewPostForm() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const createPost = useCreatePost();

  const [selectedAnime, setSelectedAnime] = useState<{
    mal_id: number;
    title: string;
    image_url: string;
  } | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<ForumCategory>('discussion');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  function handleSelectAnime(anime: Anime) {
    setSelectedAnime({
      mal_id: anime.mal_id,
      title: anime.title,
      image_url: anime.images?.webp?.image_url || anime.images?.jpg?.image_url || '',
    });
  }

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAnime || !title.trim() || !body.trim()) return;

    createPost.mutate(
      {
        mal_id: selectedAnime.mal_id,
        anime_title: selectedAnime.title,
        anime_image_url: selectedAnime.image_url,
        title: title.trim(),
        body: body.trim(),
        category,
        episode_number: category === 'episode_discussion' && episodeNumber ? Number(episodeNumber) : undefined,
        tags,
      },
      {
        onSuccess: (post) => {
          navigate(`/forum/post/${post._id}`);
        },
      },
    );
  }

  const isValid = selectedAnime && title.trim() && body.trim();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Anime selector */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          Anime
        </label>
        <AnimeSearchSelect
          selected={selectedAnime}
          onSelect={handleSelectAnime}
          onClear={() => setSelectedAnime(null)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          {t.forum.newPost.category}
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ForumCategory)}
          className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t.forum.categories[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Episode number (only for episode_discussion) */}
      {category === 'episode_discussion' && (
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            {t.forum.newPost.episodeNumber}
          </label>
          <input
            type="number"
            min="1"
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
          />
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          {t.forum.newPost.postTitle}
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder={t.forum.newPost.postTitlePlaceholder}
          className="w-full px-3 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          {t.forum.newPost.postBody}
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={5000}
          rows={8}
          placeholder={t.forum.newPost.postBodyPlaceholder}
          className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          {t.forum.newPost.tags}
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-400 transition-colors cursor-pointer"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        {tags.length < 5 && (
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            maxLength={30}
            placeholder={t.forum.newPost.tagsPlaceholder}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
          />
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || createPost.isPending}
        className="self-start px-6 py-2.5 text-sm font-medium rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {t.forum.newPost.submit}
      </button>
    </form>
  );
}
