import React from "react";
import { createUser } from "@/actions/actions";

export default function AddUserForm() {
  return (
    <form
      className="flex flex-col items-center mt-8 w-xs max-w-md"
      action={createUser}
    >
      <h2 className="text-2xl mb-4">Add New User</h2>
      <input
        type="text"
        name="name"
        placeholder="Nickname"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <input
        type="email"
        name="email"
        placeholder="Luinet Email"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <input
        type="text"
        name="password"
        placeholder="Password"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <button
        type="submit"
        className="bg-secondary-blue rounded-lg p-2 w-full hover:bg-primary-blue transition-colors duration-200 cursor-pointer"
      >
        Add User
      </button>
    </form>
  );
}
