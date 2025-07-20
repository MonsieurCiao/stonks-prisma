import React from "react";

export default function SignupForm() {
  return (
    <form className="">
      <input
        type="text"
        name="name"
        placeholder="Username"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <input
        type="email"
        name="email"
        placeholder="Luinet Email"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <button
        type="submit"
        className="bg-secondary-blue rounded-lg p-2 w-full hover:bg-primary-blue transition-colors duration-200 cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
}
