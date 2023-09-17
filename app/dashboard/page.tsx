"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  fetchProfile,
  fetchTop10ArtistsLast6Months,
} from "../utils/apiRequests";

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
    link_to_spotify_page: string;
    genres: string[];
    profile_image_url: string;
    name: string;
    id: string;
    popularity: number;
  }

  const [accessToken, setAccessToken] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
            link_to_spotify_page: artist.external_urls?.spotify,
            genres: artist.genres,
            profile_image_url: artist?.images[0]?.url,
            name: artist.name,
            id: artist.id,
            popularity: artist.popularity,
          };
        })
      );
  };

  useEffect(() => {
    getProfile(accessToken);
    getTop10ArtistsLast6Months(accessToken);
  }, [accessToken]);

  console.log(top10artistsThisMonth);

  return (
    <div className="flex-col">
      <div className="flex justify-center p-2 bg-[#1DB954] w-full">
        <h1 className="font-bold text-xl">Your recent listening</h1>
      </div>
      {profile ? (
        <div className="flex m-5 items-center justify-between">
          <div className="flex items-center">
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white mr-4"
              src={profile?.profile_image_url}
              alt="profile picture avatar"
            />
            <h2 className="text-white font-bold text-lg">
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
      {top10artistsThisMonth ? (
        <div className="bg-gray-50 rounded-xl w-fit px-4 mx-auto mt-10">
          <h2 className="font-bold text-lg p-4">
            Top Artists Over The Last 6 Months
          </h2>
          <ol className="list-decimal list-inside p-4">
            {top10artistsThisMonth.map((artist) => (
              <li key={artist.id} className="p-2">
                {artist.name}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
