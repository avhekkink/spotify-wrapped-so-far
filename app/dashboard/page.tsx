'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Artist, Track, CurrentUserProfile } from '../types/spotify.ts';
import {
  fetchProfile,
  fetchTop10ArtistsLast6Months,
  fetchTop10TracksLast6Months,
} from '../utils/apiRequests.ts';
import TracksListItem from '../components/TracksListItem.tsx';
import ArtistListItem from '../components/ArtistListItem.tsx';

function Dashboard() {
  const [accessToken, setAccessToken] = useState('');
  const [profile, setProfile] = useState<CurrentUserProfile | null>(null);
  const [top10TracksLast6Months, setTop10TracksLast6Months] = useState<Track[]>([]);
  const [top10ArtistsLast6Months, setTop10ArtistsLast6Months] = useState<Artist[]>([]);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [showAllArtists, setShowAllArtists] = useState(false);

  useEffect(() => {
    // Get token from sessionStorage on mount
    const token = sessionStorage.getItem('access_token');
    setAccessToken(token || '');

    if (!token) {
      // If no access token, redirect to home page
      window.location.href = '/';
    }

    // Listen for changes to sessionStorage (e.g., after login/refresh)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'access_token') {
        setAccessToken(event.newValue || '');
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      if (!accessToken) return;
      // Fetch user profile data using the access token
      const response = (await fetchProfile(accessToken));

      if (response) {
        setProfile({
          country: response.country,
          display_name: response.display_name,
          email: response.email,
          link_to_spotify_page: response.external_urls?.spotify,
          followers: response.followers?.total,
          profile_image_url: response.images ? response.images[0]?.url : undefined,
        });
      }
    };

    const getTop10ArtistsLast6Months = async () => {
      if (!accessToken) return;
      // Fetch top 10 artists from the last 6 months using the access token
      const response = await fetchTop10ArtistsLast6Months(accessToken);

      if (response) {
        setTop10ArtistsLast6Months(
          response.items.map((artist): Artist => ({
            id: artist.id,
            link_to_spotify_page: artist.external_urls?.spotify,
            profile_image_url: artist?.images[0]?.url,
            artist_name: artist.name,
            genres: artist.genres,
            popularity: artist.popularity,
            followers: artist.followers.total,
          })),
        );
      }
    };

    const getTop10TracksLast6Months = async () => {
      if (!accessToken) return;
      // Fetch top 10 tracks from the last 6 months using the access token
      const response = await fetchTop10TracksLast6Months(accessToken);

      if (response) {
        setTop10TracksLast6Months(
          response.items.map((track): Track => ({
            id: track.id,
            link_to_spotify_page: track.external_urls?.spotify,
            thumbnail_image_url: track.album?.images[2]?.url,
            track_name: track.name,
            artist_name: track.artists[0]?.name,
            popularity: track.popularity,
          })),
        );
      }
    };

    getProfile();
    getTop10ArtistsLast6Months();
    getTop10TracksLast6Months();
  }, [accessToken]);

  return (
    <div className="flex-col">
      {profile ? (
        <div className="flex m-2 items-center justify-between">
          <div className="flex items-center">
            {profile.profile_image_url
              && (
                <Image
                  className="inline-block rounded-full ring-2 ring-white mr-2"
                  src={profile.profile_image_url}
                  alt="profile picture avatar"
                  height="24"
                  width="24"
                />
              )}
            <h2 className="text-white text-sm">
              {profile.display_name}
            </h2>
          </div>
          <a
            href={profile?.link_to_spotify_page}
            target="_blank"
            className="flex items-center w-fit bg-black p-2 rounded-full"
            rel="noreferrer"
          >
            <Image
              src="/Spotify_Logo_RGB_Green.png"
              alt="Spotify logo in green"
              width="105"
              height="45"
            />
          </a>
        </div>
      ) : null}
      <div className="flex items-start gap-8 justify-center">
        {top10TracksLast6Months ? (
          <div className="bg-black rounded-xl w-fit px-4 pb-2 border border-grey m-4">
            <h2 className="font-bold text-lg p-2 text-white">
              Your Favourite Tracks
            </h2>
            <ol className="list-decimal list-inside">
              {(showAllTracks
                ? top10TracksLast6Months
                : top10TracksLast6Months.slice(0, 5)).map((track) => (
                  <TracksListItem track={track} key={track.id} className="my-4" />
                  // eslint-disable-next-line indent
                ))}
            </ol>
            {top10TracksLast6Months.length > 5 && (
              <button
                type="button"
                className="mb-2 ml-2 px-2 py-1 rounded-full font-semibold text-black transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--accent-green)',
                  color: 'var(--spotify-black)',
                  boxShadow: '0 0 0 2px var(--accent-green-ring)',
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-green-hover)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-green)'; }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-green-ring)'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                onClick={() => setShowAllTracks((prev) => !prev)}
              >
                {showAllTracks ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        ) : null}
        {top10ArtistsLast6Months ? (
          <div className="bg-black rounded-xl w-fit px-4 pb-2 border border-grey m-4">
            <h2 className="font-bold text-lg p-2 text-white">
              Your Favourite Artists
            </h2>
            <ol className="list-decimal list-inside">
              {(showAllArtists
                ? top10ArtistsLast6Months
                : top10ArtistsLast6Months.slice(0, 5)).map((artist) => (
                  <ArtistListItem artist={artist} key={artist.id} className="my-4" />
                  // eslint-disable-next-line indent
                ))}
            </ol>
            {top10ArtistsLast6Months.length > 5 && (
              <button
                type="button"
                className="mb-2 ml-2 px-2 py-1 rounded-full font-semibold text-black transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--accent-green)',
                  color: 'var(--spotify-black)',
                  boxShadow: '0 0 0 2px var(--accent-green-ring)',
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-green-hover)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-green)'; }}
                onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-green-ring)'; }}
                onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
                onClick={() => setShowAllArtists((prev) => !prev)}
              >
                {showAllArtists ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Dashboard;
