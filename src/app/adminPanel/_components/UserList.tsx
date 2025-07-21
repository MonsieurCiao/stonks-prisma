import React from "react";
import { prisma } from "../../../../lib/prisma";
import Link from "next/link";

export default async function UserList() {
  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <h1 className="text-2xl">User List</h1>
      <ul className="">
        {users.map((user) => (
          <li
            key={user.id}
            className=" flex flex-col p-2 px-4  border-2 border-border rounded-lg mb-2"
          >
            <Link href={`/users/${user.id}`} className="hover:underline">
              <span className="font-bold">{user.name}</span> -{" "}
              <span className="text-green">
                {Math.round(user.money * 100) / 100} ₲
              </span>
            </Link>
            <p className="text-border">{user.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
