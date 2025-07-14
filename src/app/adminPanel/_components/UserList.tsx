import React from "react";
import { prisma } from "../../../../lib/prisma";
import Link from "next/link";

export default async function UserList() {
  const users = await prisma.user.findMany({});
  return (
    <div>
      <ul className="list-disc">
        {users.map((user) => (
          <li key={user.id} className="py-2">
            <Link href={`/adminPanel/${user.id}`} className="hover:underline">
              <span className="font-bold">{user.name}</span> - {user.money}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
