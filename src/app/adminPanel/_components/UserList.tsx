import React from "react";
import { prisma } from "../../../../lib/prisma";
import Link from "next/link";

export default async function UserList() {
  const users = await prisma.user.findMany({});
  return (
    <div>
      <h1 className="text-2xl">User List</h1>
      <ul className="list-disc">
        {users.map((user) => (
          <li key={user.id} className="flex py-2 items-center justify-between">
            <Link href={`/users/${user.id}`} className="hover:underline">
              <span className="font-bold">{user.name}</span> -{" "}
              {Math.round(user.money * 100) / 100}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
