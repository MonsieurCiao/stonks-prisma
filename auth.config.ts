import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages:{
    signIn: "/authentication",
  },
  callbacks:{
    authorized({auth,request:{nextUrl}}){
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/users");
      if(isOnDashboard){
        if(isLoggedIn) return true;
        return false;
      }else if(isLoggedIn){
        return Response.redirect(new URL("/users", nextUrl));
      }
      return true;
    },
  },
  providers:[],
} satisfies NextAuthConfig;