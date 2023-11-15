import * as React from "react";

interface Track {
  id: string;
  link_to_spotify_page: string;
  thumbnail_image_url: string;
  track_name: string;
  artist_name: string;
  popularity: number;
}

interface TracksListItemProps {
  className?: string;
  track: Track;
  key: string;
}

const TracksListItem = React.forwardRef(function TracksListItem(
  { className = "", track }: TracksListItemProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div className={`max-w-[540px] max-h-[80px] m-auto ${className}`} ref={ref}>
      <div className="flex items-center space-x-8 bg-grey rounded-lg p-1">
        <img
          src={track.thumbnail_image_url}
          alt="Track cover photo"
          width="64"
          height="64"
          className="flex-none rounded-lg"
          loading="lazy"
        />
        <div className="min-w-0 flex flex-col items-start">
          <h1 className="text-md text-white font-semibold leading-normal">
            {track.track_name}
          </h1>
          <h2 className="text-white text-sm leading-normal">
            {track.artist_name}
          </h2>
        </div>
      </div>
    </div>
  );
});

export default TracksListItem;
