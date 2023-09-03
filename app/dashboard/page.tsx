"use client";

import { useState, useEffect } from "react";
import { fetchProfile } from "../utils/apiRequests";

const Dashboard = () => {
  interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    link_to_spotify_page: string;
    followers: number;
    profile_image_url: string | undefined;
  }

  const [accessToken, setAccessToken] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    let token = sessionStorage.getItem("access_token");
    setAccessToken(token || "");
  }, []);

  const getProfile = async (accessToken: string) => {
    let response = accessToken && (await fetchProfile(accessToken));

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

  useEffect(() => {
    getProfile(accessToken);
  }, [accessToken]);

  return (
    <div className="flex-col">
      <div className="flex justify-center p-6 bg-green-500 w-full">
        <h1 className="font-bold text-xl">Your Spotify Wrapped So Far</h1>
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
            className="flex items-center text-black bg-green-500 hover:bg-green-600 font-bold rounded-full text-sm px-5 py-2.5 dark:hover:bg-green-600 w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            Spotify
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
