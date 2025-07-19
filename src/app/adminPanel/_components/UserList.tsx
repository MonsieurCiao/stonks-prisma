import React from "react";
import { prisma } from "../../../../lib/prisma";
import Link from "next/link";
import { deleteUser } from "@/actions/actions";

export default async function UserList() {
  const users = await prisma.user.findMany({});
  return (
    <div>
      <ul className="list-disc">
        {users.map((user) => (
          <li key={user.id} className="flex py-2 items-center justify-between">
            <Link href={`/adminPanel/${user.id}`} className="hover:underline">
              <span className="font-bold">{user.name}</span> -{" "}
              {Math.round(user.money * 100) / 100}
            </Link>
            <form className="absolute top-4 right-4" action={deleteUser}>
              <input type="hidden" name="userId" value={user.id} />
              <button
                className="p-1 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                type="submit"
              >
                delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
