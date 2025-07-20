import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getUserIdFromSession } from "../../../lib/session";

export default async function Navbar() {
  const { userId } = await getUserIdFromSession();
  return (
    <nav className="fixed bottom-4 md:bottom-auto md:top-4 left-4 right-4 rounded-lg border-2 border-border px-8 flex justify-center items-center bg-background z-10">
      <div className="flex justify-between items-center w-full md:w-auto md:gap-10">
        {userId ? (
          <Link
            href={`/users/${userId}`}
            className="text-lg group px-4 rounded-lg active:bg-border py-3"
          >
            <div className="flex gap-1 md:gap-2 flex-col items-center md:flex-row ">
              <Image
                src={"/Dashboard.svg"}
                alt="Dashboard"
                width={18}
                height={18}
              />
              <p className="text-sm md:text-lg">Dashboard</p>
            </div>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-white"></span>
          </Link>
        ) : (
          <Link
            href={"/"}
            className="text-lg group px-4 rounded-lg active:bg-border py-3"
          >
            <div className="flex gap-1 md:gap-2 flex-col items-center md:flex-row">
              <Image src={"/Home.svg"} alt="Home" width={18} height={18} />
              <p className="text-sm md:text-lg">Home</p>
            </div>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-white"></span>
          </Link>
        )}
        <Link
          href={"/news"}
          className="text-lg group px-4 rounded-lg active:bg-border py-3"
        >
          <div className="flex gap-1 md:gap-2 flex-col items-center md:flex-row">
            <Image src={"/TV.svg"} alt="News" width={20} height={20} />
            <p className="text-sm md:text-lg">News</p>
          </div>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-white"></span>
        </Link>
        <Link
          href={"/leaderboard"}
          className="text-lg group px-4 rounded-lg active:bg-border py-3"
        >
          <div className="flex gap-1 md:gap-2 flex-col items-center md:flex-row">
            <Image src={"/Target.svg"} alt="leader" width={18} height={18} />
            <p className="text-sm md:text-lg">Leaderboard</p>
          </div>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-white"></span>
        </Link>
      </div>
    </nav>
  );
}
