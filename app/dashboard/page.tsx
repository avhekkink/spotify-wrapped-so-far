"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  fetchProfile,
  fetchTop10ArtistsLast6Months,
  fetchTop10TracksLast6Months,
} from "../utils/apiRequests";
import TracksListItem from "@/app/components/TracksListItem";

const Dashboard = () => {
  interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    link_to_spotify_page: string;
    followers: number;
    profile_image_url: string | undefined;
  }

  interface Artist {
    id: string;
    link_to_spotify_page: string;
    profile_image_url: string;
    artist_name: string;
    genres: string[];
    popularity: number;
  }

  interface Track {
    id: string;
    link_to_spotify_page: string;
    thumbnail_image_url: string;
    track_name: string;
    artist_name: string;
    popularity: number;
  }

  const [accessToken, setAccessToken] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [top10TracksLast6Months, setTop10TracksLast6Months] = useState<Track[]>(
    []
  );
  const [top10artistsThisMonth, setTop10ArtistsThisMonth] = useState<Artist[]>(
    []
  );

  useEffect(() => {
    let token = sessionStorage.getItem("access_token");
    setAccessToken(token || "");
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
      setTop10ArtistsThisMonth(
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
    getProfile(accessToken);
    getTop10ArtistsLast6Months(accessToken);
    getTop10TracksLast6Months(accessToken);
  }, [accessToken]);

  return (
    <div className="flex-col">
      {profile ? (
        <div className="flex m-5 items-center justify-between">
          <div className="flex items-center">
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white mr-4"
              src={profile?.profile_image_url}
              alt="profile picture avatar"
            />
            <h2 className="text-white font-semibold text-lg">
              {profile?.display_name}
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
      <div className="flex m-5 items-center justify-between">
        {top10TracksLast6Months ? (
          <div className="bg-black rounded-xl w-fit px-4 mx-auto mt-10 border border-grey">
            <h2 className="font-bold text-lg p-4 text-white">
              Top Tracks Over The Last 6 Months
            </h2>
            <ol className="list-decimal list-inside p-4">
              {top10TracksLast6Months.map((track) => (
                <TracksListItem track={track} key={track.id} className="my-4" />
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
