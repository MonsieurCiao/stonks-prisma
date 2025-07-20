import React from "react";
import { stocks } from "../../../../lib/constants";
import { addPost } from "@/actions/actions";

export default function AddNews() {
  return (
    <form
      className="flex flex-col items-center mt-8 w-xs max-w-md"
      action={addPost}
    >
      <h2 className="text-2xl mb-4">Post News</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <textarea
        name="content"
        placeholder="Content"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <p className="text-border text-center">Influences</p>
      <div className="flex gap-4">
        {stocks.map((stock) => (
          <div key={stock} className="flex flex-col items-center">
            <label className="text-white">{stock}</label>
            <input
              type="number"
              name={stock}
              placeholder={stock}
              step={0.01}
              defaultValue={0.5}
              className="border border-border rounded-lg p-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-secondary-blue rounded-lg p-2 w-full hover:bg-primary-blue transition-colors duration-200 cursor-pointer"
      >
        Post
      </button>
    </form>
  );
}
