import "./globals.css";
import type { Metadata } from "next";
// Used for font optimization
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Wrapped So Far",
  description: "Access your spotify wrapped throughout the year",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="p-2 text-slate-200 font-thin fixed bottom-0">
          Photo by{" "}
          <a href="https://unsplash.com/@silivan?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Silivan Munguarakarama
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/photos/NrR9gn3lFKU?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Unsplash
          </a>
        </footer>
      </body>
    </html>
  );
}
