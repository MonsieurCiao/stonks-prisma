"use client";
import React from "react";
import LoginForm from "./_components/LoginForm";
import SignupForm from "./_components/SignupForm";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = React.useState(true);
  return (
    <div className="">
      <div className="max-w-md mx-auto mt-8 p-4 border border-border rounded-lg">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-l-lg w-full cursor-pointer ${
              isLogin
                ? "bg-secondary-blue text-white"
                : "bg-gray-200 text-border"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-r-lg w-full cursor-pointer ${
              !isLogin
                ? "bg-secondary-blue text-white"
                : "bg-gray-200 text-border"
            }`}
          >
            Signup
          </button>
        </div>
        {isLogin ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}
