import { useQuery } from '@tanstack/react-query';
import type { Language } from '@/i18n/translations';

// MyMemory free API — no key required, limit ~5000 chars/day per IP
// Max 450 chars per request, so we split on sentence boundaries

function splitIntoChunks(text: string, maxSize = 450): string[] {
  if (text.length <= maxSize) return [text];

  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxSize && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function translateSynopsis(synopsis: string): Promise<string> {
  const chunks = splitIntoChunks(synopsis);

  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|pt-BR`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Translation failed');
      const data = (await res.json()) as {
        responseData: { translatedText: string };
        responseStatus: number;
      };
      if (data.responseStatus !== 200) throw new Error('Translation failed');
      return data.responseData.translatedText;
    }),
  );

  return results.join(' ');
}

export function useTranslatedSynopsis(synopsis: string | null, language: Language) {
  return useQuery({
    queryKey: ['synopsis-translation', synopsis?.slice(0, 60), language],
    queryFn: () => translateSynopsis(synopsis!),
    enabled: language === 'pt-BR' && !!synopsis,
    staleTime: Infinity,   // translation never goes stale
    gcTime: 1000 * 60 * 60, // keep in cache 1h
    retry: 1,
  });
}
