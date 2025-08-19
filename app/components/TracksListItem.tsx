import Image from "next/image";
import * as React from "react";
import { Track } from "../dashboard/page";

interface TracksListItemProps {
  className?: string;
  track: Track;
  key: string;
}

const TracksListItem = React.forwardRef(function TracksListItem(
  { className = "", track }: TracksListItemProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <a
      href={track.link_to_spotify_page}
      target="_blank"
      rel="noopener noreferrer"
      className={`block m-auto ${className}`}
      ref={ref}
    >
      <div className="flex items-center space-x-8 bg-grey rounded-lg p-1 hover:bg-green-700 transition-colors cursor-pointer">
        <Image
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
    </a>
  );
});

export default TracksListItem;
