import "./globals.css";
import type { Metadata } from "next";
// Used for font optimization
import { Roboto_Mono } from "next/font/google";

const inter = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Wrapped So Far",
  description: "Access your spotify wrapped throughout the year"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen min-h-screen">
          <header className="h-24 border border-grey p-4">
            <h1 className="text-white text-2xl">The Music You Love</h1>
            <h4 className="text-white text-xs">
              Explore your favourite tracks and artists
            </h4>
          </header>
          {children}
          <footer className="h-16 flex-none border border-grey">
            <div className="p-4">
              <h2 className="text-white text-sm"> Spotify Wrapped So Far</h2>
              <h4 className="text-white text-xs">
                Your favourite music on demand!
              </h4>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
