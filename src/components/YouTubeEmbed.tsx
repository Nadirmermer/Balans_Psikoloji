import React from 'react';


interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  className?: string;
  autoplay?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title,
  className = '',
  autoplay = false
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;

  return (
    <div className={`relative aspect-video ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full rounded-lg"
        loading="lazy"
      />
    </div>
  );
};

export default YouTubeEmbed;