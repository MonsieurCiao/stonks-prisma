import React from "react";
import UserList from "./_components/UserList";
import AddUserForm from "./_components/AddUserForm";
import AddNews from "./_components/AddNews";

export default function AdminPanel() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="mt-16 text-4xl">Admin Panel</h1>
      <div className="my-16 text-lg flex justify-between w-full max-w-2xl px-4">
        <UserList />
        <div className="flex flex-col gap-10">
          <AddUserForm />
          <AddNews />
        </div>
      </div>
    </div>
  );
}
