import { login } from "@/actions/authActions";
import React, { useActionState } from "react";

export default function LoginForm() {
  const [form, formAction] = useActionState(login, {
    message: null,
  });
  return (
    <form className="" action={formAction}>
      <input
        type="text"
        name="name"
        placeholder="Username"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
      />
      {form.message && (
        <p className="text-red-500 text-sm mb-4">{form.message}</p>
      )}
      <button
        type="submit"
        className="bg-secondary-blue rounded-lg p-2 w-full hover:bg-primary-blue transition-colors duration-200 cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
}
