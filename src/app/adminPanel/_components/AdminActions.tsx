"use client";
import { deleteAllPrices, deleteUser, modifyMoney } from "@/actions/actions";
import React, { useActionState } from "react";

export default function AdminActions() {
  const [deleteAllPricesMsg, deleteAllPricesAction] = useActionState(
    deleteAllPrices,
    {
      message: null,
    }
  );
  const [deleteUserMsg, deleteUserAction] = useActionState(deleteUser, {
    message: null,
  });
  const [modifyMoneyMsg, modifyMoneyAction] = useActionState(modifyMoney, {
    message: null,
  });
  return (
    <div className="">
      <h1 className="text-2xl mb-4">Admin Actions</h1>
      <h2 className="text-lg">Delete all Stock prices</h2>
      <form action={deleteAllPricesAction}>
        <input
          type="password"
          name="password"
          placeholder="Admin Key"
          className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
        />
        <div>
          {deleteAllPricesMsg.message && (
            <p
              className={`mb-1 px-4 rounded text-sm text-center ${
                deleteAllPricesMsg.message.includes("success")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {deleteAllPricesMsg.message}
            </p>
          )}
          <button
            type="submit"
            className="bg-red rounded-lg p-2 w-full hover:bg-red transition-colors duration-200 cursor-pointer"
          >
            Delete all Prices
          </button>
        </div>
      </form>
      <h2 className="text-lg mt-4">Delete a User</h2>
      <form action={deleteUserAction}>
        <input
          type="text"
          name="userId"
          placeholder="User Id"
          className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
        />
        <div>
          {deleteUserMsg.message && (
            <p
              className={`mb-1 px-4 rounded text-sm text-center ${
                deleteUserMsg.message.includes("success")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {deleteUserMsg.message}
            </p>
          )}
          <button
            type="submit"
            className="bg-red rounded-lg p-2 w-full hover:bg-red transition-colors duration-200 cursor-pointer"
          >
            Delete User
          </button>
        </div>
      </form>
      <h2 className="text-lg mt-4">Modify User Money</h2>
      <form action={modifyMoneyAction}>
        <input
          type="text"
          name="userId"
          placeholder="User Id"
          className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
        />
        <input
          type="number"
          step={0.01}
          name="money"
          placeholder="± Money"
          className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
        />
        <div>
          {modifyMoneyMsg.message && (
            <p
              className={`mb-1 px-4 rounded text-sm text-center ${
                modifyMoneyMsg.message.includes("success")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {modifyMoneyMsg.message}
            </p>
          )}
          <button
            type="submit"
            className="bg-red rounded-lg p-2 w-full hover:bg-red transition-colors duration-200 cursor-pointer"
          >
            Modify
          </button>
        </div>
      </form>
    </div>
  );
}
