"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  fetchProfile,
  fetchTop10ArtistsLast6Months,
  fetchTop10TracksLast6Months,
} from "../utils/apiRequests";
import TracksListItem from "@/app/components/TracksListItem";
import ArtistListItem from "../components/ArtistListItem";

interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  link_to_spotify_page: string;
  followers: number;
  profile_image_url: string | undefined;
}

export interface Artist {
  id: string;
  link_to_spotify_page: string;
  profile_image_url: string;
  artist_name: string;
  genres: string[];
  popularity: number;
}

export interface Track {
  id: string;
  link_to_spotify_page: string;
  thumbnail_image_url: string;
  track_name: string;
  artist_name: string;
  popularity: number;
}

const Dashboard = () => {
  const [accessToken, setAccessToken] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [top10TracksLast6Months, setTop10TracksLast6Months] = useState<Track[]>([]);
  const [top10ArtistsLast6Months, setTop10ArtistsLast6Months] = useState<Artist[]>([]);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [showAllArtists, setShowAllArtists] = useState(false);

  useEffect(() => {
    // Get token from sessionStorage on mount
    let token = sessionStorage.getItem("access_token");
    setAccessToken(token || "");

    // Listen for changes to sessionStorage (e.g., after login/refresh)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "access_token") {
        setAccessToken(event.newValue || "");
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const getProfile = async (accessToken: string) => {
    const response = accessToken && (await fetchProfile(accessToken));

    response &&
      setProfile({
        country: response.country,
        display_name: response.display_name,
        email: response.email,
        link_to_spotify_page: response.external_urls?.spotify,
        followers: response.followers?.total,
        profile_image_url: response.images[0]?.url,
      });
  };

  const getTop10ArtistsLast6Months = async (accessToken: string) => {
    const response =
      accessToken && (await fetchTop10ArtistsLast6Months(accessToken));

    response &&
      setTop10ArtistsLast6Months(
        response.items.map((artist: any): Artist => {
          return {
            id: artist.id,
            link_to_spotify_page: artist.external_urls?.spotify,
            profile_image_url: artist?.images[0]?.url,
            artist_name: artist.name,
            genres: artist.genres,
            popularity: artist.popularity,
          };
        })
      );
  };

  const getTop10TracksLast6Months = async (accessToken: string) => {
    const response =
      accessToken && (await fetchTop10TracksLast6Months(accessToken));

    response &&
      setTop10TracksLast6Months(
        response.items.map((track: any): Track => {
          return {
            id: track.id,
            link_to_spotify_page: track.external_urls?.spotify,
            thumbnail_image_url: track.album?.images[2]?.url,
            track_name: track.name,
            artist_name: track.artists[0]?.name,
            popularity: track.popularity,
          };
        })
      );
  };

  useEffect(() => {
    if (!accessToken) return;
    getProfile(accessToken);
    getTop10ArtistsLast6Months(accessToken);
    getTop10TracksLast6Months(accessToken);
  }, [accessToken]);

  return (
    <div className="flex-col">
      {profile ? (
        <div className="flex m-5 items-center justify-between">
          <div className="flex items-center">
            {profile.profile_image_url &&
              <Image
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white mr-4"
                src={profile.profile_image_url}
                alt="profile picture avatar"
                height="32"
                width="32"
              />
            }
            <h2 className="text-white font-semibold text-lg">
              {profile.display_name}
            </h2>
          </div>
          <a
            href={profile?.link_to_spotify_page}
            target="_blank"
            className="flex items-center w-fit bg-black p-2 rounded-full"
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
      <div className="flex m-4 items-start gap-4 justify-between">
        {top10TracksLast6Months ? (
          <div className="bg-black rounded-xl w-fit px-4 border border-grey mt-10 mx-auto">
            <h2 className="font-bold text-lg p-4 text-white">
              Your Favourite Tracks
            </h2>
            <ol className="list-decimal list-inside p-4">
              {(showAllTracks ? top10TracksLast6Months : top10TracksLast6Months.slice(0, 5)).map((track) => (
                <TracksListItem track={track} key={track.id} className="my-4" />
              ))}
            </ol>
            {top10TracksLast6Months.length > 5 && (
              <button
                className="mb-4 ml-4 px-4 py-2 rounded-full font-semibold text-black transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--accent-green)',
                  color: 'var(--spotify-black)',
                  boxShadow: '0 0 0 2px var(--accent-green-ring)',
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--accent-green-hover)')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--accent-green)')}
                onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-green-ring)')}
                onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                onClick={() => setShowAllTracks((prev) => !prev)}
              >
                {showAllTracks ? "See less" : "See more"}
              </button>
            )}
          </div>
        ) : null}
        {top10ArtistsLast6Months ? (
          <div className="bg-black rounded-xl w-fit px-4 border border-grey mt-10 mx-auto">
            <h2 className="font-bold text-lg p-4 text-white">
              Your Favourite Artists
            </h2>
            <ol className="list-decimal list-inside p-4">
              {(showAllArtists ? top10ArtistsLast6Months : top10ArtistsLast6Months.slice(0, 5)).map((artist) => (
                <ArtistListItem artist={artist} key={artist.id} className="my-4" />
              ))}
            </ol>
            {top10ArtistsLast6Months.length > 5 && (
              <button
                className="mb-4 ml-4 px-4 py-2 rounded-full font-semibold text-black transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--accent-green)',
                  color: 'var(--spotify-black)',
                  boxShadow: '0 0 0 2px var(--accent-green-ring)',
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--accent-green-hover)')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--accent-green)')}
                onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-green-ring)')}
                onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
                onClick={() => setShowAllArtists((prev) => !prev)}
              >
                {showAllArtists ? "See less" : "See more"}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
