import React from "react";
import { prisma } from "../../../lib/prisma";

export default async function News() {
  const posts = await prisma.newsPost.findMany({
    orderBy: {
      time: "desc",
    },
  });
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="font-bold text-2xl my-1 px-4 w-full">Aktuelles Event</h2>
      <ul className="flex flex-col items-center w-full">
        <li
          key={posts[0].id}
          className={`border-2 ${"border-green px-10 w-full "} rounded-lg  p-4 mb-4 bg-light-bg`}
        >
          <div className="flex justify-between mb-1">
            <h1 className="text-xl font-bold mr-4">{posts[0].title}</h1>
            <h1 className="text-xl">
              {new Date(posts[0].time.getTime()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h1>
          </div>
          <p className="text-lg">{posts[0].content}</p>
        </li>
      </ul>
      <h2 className="font-bold text-xl my-1 px-4 w-[90%]">Ältere Events</h2>
      <ul className="mb-8 flex flex-col items-center w-full">
        {posts.map((post, i) => (
          <li
            key={post.id}
            className={`border-2 ${
              i === 0
                ? "border-green px-10 w-full hidden"
                : "border-border w-[90%]"
            } rounded-lg  p-4 mb-4 bg-light-bg`}
          >
            <div className="flex justify-between mb-1">
              <h1 className="text-xl font-bold mr-4">{post.title}</h1>
              <h1 className="text-xl">
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
