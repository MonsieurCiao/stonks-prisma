import React from "react";
import UserList from "./_components/UserList";
import AddUserForm from "./_components/AddUserForm";
import AddNews from "./_components/AddNews";
import AdminActions from "./_components/AdminActions";

export default function AdminPanel() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="mt-16 text-4xl">Admin Panel</h1>
      <div className="my-16 text-lg flex justify-between gap-8 w-full max-w-4xl px-4">
        <UserList />
        <div className="flex flex-col gap-18 items-center max-w-xs">
          <AddUserForm />
          <AddNews />
          <AdminActions />
        </div>
      </div>
    </div>
  );
}
