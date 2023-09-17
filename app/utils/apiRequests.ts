export const fetchProfile = async (token: string): Promise<any> => {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await result.json();
};

export const fetchTop10ArtistsLast6Months = async (
  token: string
): Promise<any> => {
  const result = await fetch(
    "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10&offset=0",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await result.json();
};
