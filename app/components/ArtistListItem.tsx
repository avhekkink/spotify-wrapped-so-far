import Image from 'next/image';
import * as React from 'react';
import { Artist } from '../types/spotify.ts';

interface ArtistListItemProps {
    className?: string;
    artist: Artist;
}

const ArtistListItem = React.forwardRef((
  { className = '', artist }: ArtistListItemProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
) => (
  <a
    href={artist.link_to_spotify_page}
    target="_blank"
    rel="noopener noreferrer"
    className={`block m-auto ${className}`}
    ref={ref}
  >
    <div className="flex items-center space-x-8 bg-grey rounded-lg p-2 hover:bg-green-700 transition-colors cursor-pointer">
      <Image
        src={artist.profile_image_url}
        alt="Track cover photo"
        width="64"
        height="64"
        className="flex-none rounded-lg"
        loading="lazy"
      />
      <div className="min-w-0 flex flex-col items-start">
        <h1 className="text-md text-white font-semibold leading-normal">
          {artist.artist_name}
        </h1>
      </div>
    </div>
  </a>
));

export default ArtistListItem;
