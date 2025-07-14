import { revalidatePath } from "next/cache";
import React from "react";
async function createUser(formData: FormData) {
  "use server";
  const { prisma } = require("../../../../lib/prisma");
  const name = formData.get("name") as string;
  await prisma.user.create({
    data: {
      name,
    },
  });
  revalidatePath("/adminPanel");
}
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
        placeholder="Name"
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-lg p-2 w-full hover:bg-blue-600"
      >
        Add User
      </button>
    </form>
  );
}
