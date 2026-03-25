interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
}

export default function YouTubeEmbed({ youtubeId, title }: YouTubeEmbedProps) {
  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900">
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={`${title} trailer`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full border-0"
      />
    </div>
  );
}
