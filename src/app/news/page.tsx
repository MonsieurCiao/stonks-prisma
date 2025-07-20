import React from "react";
import { prisma } from "../../../lib/prisma";

export default async function News() {
  const posts = await prisma.newsPost.findMany({
    orderBy: {
      time: "desc",
    },
  });
  return (
    <div className="flex flex-col items-center">
      <ul className="my-8 flex flex-col items-center">
        {posts.map((post, i) => (
          <li
            key={post.id}
            className={`border-2 ${
              i === 0 ? "border-green px-10" : "border-border w-[90%]"
            } rounded-lg  p-4 mb-4`}
          >
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">{post.title}</h1>
              <h1 className="text-2xl font-bold">
                {post.time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h1>
            </div>
            <p className="text-lg">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
