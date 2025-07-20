import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="position-stick top-0 left-0 right-0  border-b-2 border-border px-8 py-3 flex justify-center align-center">
      <div className="flex justify-between align-center gap-10">
        <Link href={"/"} className="text-lg group">
          <div className="flex gap-2">
            <Image src={"/Home.svg"} alt="Home" width={18} height={18} />
            Home
          </div>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-white"></span>
        </Link>
        <Link href={"/"} className="text-lg group">
          <div className="flex gap-2">
            <Image src={"/TV.svg"} alt="Home" width={20} height={20} />
            News
          </div>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-white"></span>
        </Link>
        <Link href={"/"} className="text-lg group">
          <div className="flex gap-2">
            <Image src={"/Target.svg"} alt="Home" width={20} height={20} />
            Leaderboard
          </div>
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-white"></span>
        </Link>
      </div>
    </nav>
  );
}
