const SPOTIFY_CLIENT_ID: string = '81f30010134047e194e7e7f748721d40';

function generateRandomString(length: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  function base64encode(arrayBuffer: ArrayBuffer): string {
    const uint8Array = new Uint8Array(arrayBuffer);
    const byteArray = Array.from(uint8Array);
    return btoa(String.fromCharCode.apply(null, byteArray))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return base64encode(digest);
}

export const authorize = async () => {
  const codeVerifier = generateRandomString(128);

  const isVercelPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
  const isVercelProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  // Define the base URL for your web app
  let baseUrl;
  if (isVercelPreview) {
    baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  } else if (isVercelProduction) {
    baseUrl = 'https://spotify-wrapped-so-far.vercel.app';
  } else {
    baseUrl = 'http://localhost:3000';
  }

  // Construct the dynamic redirectUri
  const redirectUri: string = `${baseUrl}/`;

  // For dev reference, can be removed when no longer needed
  localStorage.setItem(
    'next_public_vercel_env',
    process.env.NEXT_PUBLIC_VERCEL_ENV
      ? process.env.NEXT_PUBLIC_VERCEL_ENV
      : 'value is undefined',
  );
  localStorage.setItem(
    'next_public_vercel_url',
    process.env.NEXT_PUBLIC_VERCEL_URL
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : 'value is undefined',
  );
  localStorage.setItem('redirect_uri', redirectUri);

  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    const state: string = generateRandomString(16);
    const scope: string = 'user-read-private user-read-email user-top-read';

    localStorage.setItem('code_verifier', codeVerifier);

    const args = new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: redirectUri,
      state,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${args}`;
  });
};

export const getAccessToken = async (code: string) => {
  const codeVerifier = localStorage.getItem('code_verifier');
  const redirectUri = localStorage.getItem('redirect_uri');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code || '',
    redirect_uri: redirectUri || '',
    client_id: SPOTIFY_CLIENT_ID || '',
    code_verifier: codeVerifier || '',
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    const json = await response.json();
    return json;
  } catch (error) {
    window.location.href = '/';
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    return null;
  }
};

export const refreshSpotifyToken = async (refreshToken: string) => {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: SPOTIFY_CLIENT_ID || '',
  });
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    return response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error:', error);
    return null;
  }
};
