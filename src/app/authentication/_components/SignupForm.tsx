import { signUp } from "@/actions/authActions";
import React, { useActionState } from "react";

export default function SignupForm() {
  const [form, formAction] = useActionState(signUp, {
    message: null,
  });
  return (
    <form className="" action={formAction}>
      <input
        type="text"
        name="name"
        placeholder="Username"
        className="border border-border focus:outline-none focus:ring-2 focus:ring-primary-blue rounded-lg p-2 mb-4 w-full"
        maxLength={30}
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
