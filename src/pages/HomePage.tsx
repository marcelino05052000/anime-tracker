import SeasonalSection from '@/features/home/components/SeasonalSection';
import TopAnimeSection from '@/features/home/components/TopAnimeSection';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-12">
      <SeasonalSection />
      <TopAnimeSection />
    </div>
  );
}
