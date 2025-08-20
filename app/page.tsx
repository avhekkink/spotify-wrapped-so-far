'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authorize } from './utils/authorization.ts';
import useRefreshToken from './hooks/useRefreshToken.tsx';

function Home() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  useRefreshToken(code as string);

  return (
    <div className="w-full h-full flex-1 overflow-y-auto place-content-center">
      <div className="w-full h-full rounded-lg flex flex-col place-content-center">
        {!code ? (
          <h1 className="text-white text-5xl py-8 self-center">
            Connect your Spotify
          </h1>
        ) : null}
        <div className="bg-blue rounded-full shadow w-80 self-center py-1 px-32 flex justify-center">
          {code ? (
            <Link href="/dashboard">Continue</Link>
          ) : (
            <button type="button" onClick={authorize} className="btn btn-accent font-bold">
              LOG IN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
