"use client";

import Link from "next/link";
import { authorize } from "@/app/utils/authorization";
import useRefreshToken from "@/app/hooks/useRefreshToken";
import { useSearchParams } from "next/navigation";

const Home = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  useRefreshToken(code as string);

  return (
    <div className="w-full p-4">
      <main className="w-full flex flex-col h-screen content-center justify-center">
        <div className="w-full sm:w-1/2 lg:w-1/3 rounded-lg m-auto">
          <div className="bg-green-500 rounded-full shadow p-4 flex justify-center">
            {code ? (
              <Link href="/dashboard">Continue</Link>
            ) : (
              <button onClick={authorize} className="btn btn-accent font-bold">
                Connect Your Spotify
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
