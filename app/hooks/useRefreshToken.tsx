'use client';

import { useEffect, useState, useRef } from 'react';

import { getAccessToken, refreshSpotifyToken } from '@/app/utils/authorization.ts';

export default function useRefreshToken(code: string) {
  const codeUsedRef = useRef(false);
  const [expiresIn, setExpiresIn] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      if (code && !codeUsedRef.current) {
        codeUsedRef.current = true; // Prevent double usage
        const response = await getAccessToken(code);

        if (response && response.access_token) {
          setRefreshToken(response.refresh_token);
          setAccessToken(response.access_token);
          setExpiresIn(response.expires_in);
          sessionStorage.setItem('access_token', response.access_token);
          window.dispatchEvent(
            new StorageEvent('storage', {
              key: 'access_token',
              newValue: response.access_token,
            }),
          );
        } else {
          // eslint-disable-next-line no-console
          console.error('Token exchange failed:', response);
        }
      }
    };

    fetchToken();
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const refreshTokenFn = async () => {
      const response = await refreshSpotifyToken(refreshToken);
      setAccessToken(response.access_token);
      setExpiresIn(response.expires_in);
      sessionStorage.setItem('access_token', response.access_token);
      // Manually trigger storage event for same-tab listeners
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'access_token',
          newValue: response.access_token,
        }),
      );
    };

    const interval = setInterval(() => {
      refreshTokenFn();
    }, (expiresIn - 60) * 1000);

    // eslint-disable-next-line consistent-return
    return () => { clearInterval(interval); };
  }, [refreshToken, expiresIn]);
}
