"use client";

import Link from "next/link";
import { authorize, getToken } from "@/app/utils/authorization";
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
          <div className="bg-white rounded shadow px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex justify-center">
            {code ? (
              <Link href="/dashboard">Click To Enter</Link>
            ) : (
              <button onClick={authorize} className="btn btn-accent">
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
