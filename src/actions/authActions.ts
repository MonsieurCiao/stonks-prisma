"use server";

import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { cookies } from "next/headers";

export async function signUp(prevState: {message: string | null}, formData: FormData): Promise<{message: string | null}> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  //check
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { name },
        { email }
      ],
    },
  });
  if (existingUser) {
    return { message: "Username oder Email existiert bereits" };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  //set cookie
  const cookieStore = await cookies();
  cookieStore.set('userId', user.id);
  redirect(`/users/${user.id}`);
}
export async function login(prevState: {message: string | null},formData: FormData): Promise<{message: string | null}> {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { name, password },
  });

  if (!user) {
    return { message: "Passwort oder Email falsch" };
  }

  //set cookie
  const cookieStore = await cookies();
  cookieStore.set('userId', user.id);
  redirect(`/users/${user.id}`);
}