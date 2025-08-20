import React, { Suspense } from 'react';
import './globals.css';
import type { Metadata } from 'next';
// eslint-disable-next-line camelcase
import { Roboto_Mono } from 'next/font/google';

const inter = Roboto_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spotify Wrapped So Far',
  description: 'Access your spotify wrapped throughout the year',
};

const HEADER_HEIGHT = '4rem'; // 16 * 0.25rem = 4rem
const FOOTER_HEIGHT = '2rem'; // 8 * 0.25rem = 2rem

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Fixed Header */}
        <header
          className="fixed top-0 left-0 w-full h-16 border border-grey p-2 bg-black z-10"
          style={{ height: HEADER_HEIGHT }}
        >
          <h1 className="text-white text-xl">The Music You Love</h1>
          <h4 className="text-white text-xs">
            Explore your favourite tracks and artists
          </h4>
        </header>

        {/* Main Content */}
        <main
          className="w-full overflow-y-auto"
          style={{
            paddingTop: HEADER_HEIGHT,
            paddingBottom: FOOTER_HEIGHT,
            minHeight: `calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT})`,
          }}
        >
          <Suspense fallback={(
            <div className="w-full h-full flex-1 overflow-y-auto place-content-center">
              <h1 className="text-white text-5xl py-8 self-center">Loading...</h1>
            </div>
          )}
          >
            {children}
          </Suspense>
        </main>

        {/* Fixed Footer */}
        <footer
          className="fixed bottom-0 left-0 w-full h-8 flex-none border border-grey bg-black z-10"
          style={{ height: FOOTER_HEIGHT }}
        >
          <div className="p-2">
            <h2 className="text-white text-xs">🎁 Spotify Wrapped So Far</h2>
          </div>
        </footer>
      </body>
    </html>
  );
}
