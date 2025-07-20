import { cookies } from "next/headers";

export async function getUserIdFromSession(): Promise<{userId: string | null}> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  return {userId: userId ?? null};
}