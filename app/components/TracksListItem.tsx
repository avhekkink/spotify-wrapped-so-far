import Image from 'next/image';
import * as React from 'react';
import { Track } from '../types/spotify.ts';

interface TracksListItemProps {
  className?: string;
  track: Track;
}

const TracksListItem = React.forwardRef((
  { className = '', track }: TracksListItemProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) => (
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
        width="40"
        height="40"
        className="flex-none rounded-lg"
        loading="lazy"
      />
      <div className="min-w-0 flex flex-col items-start">
        <h3 className="text-sm text-white font-semibold leading-normal">
          {track.track_name}
        </h3>
        <h4 className="text-white text-xs leading-normal">
          {track.artist_name}
        </h4>
      </div>
    </div>
  </a>
));

export default TracksListItem;
