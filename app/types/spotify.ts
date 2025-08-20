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

export interface CurrentUserProfile {
  country: string;
  display_name?: string;
  email: string;
  link_to_spotify_page: string;
  followers?: number;
  profile_image_url: string | undefined;
}
