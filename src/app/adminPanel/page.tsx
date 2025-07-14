import React from "react";
import UserList from "./_components/UserList";
import AddUserForm from "./_components/AddUserForm";

export default function AdminPanel() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="mt-16 text-4xl">Admin Panel</h1>
      <div className="mt-8 text-lg flex justify-between w-full max-w-2xl px-4">
        <UserList />
        <AddUserForm />
      </div>
    </div>
  );
}
