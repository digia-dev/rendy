import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySession } from "./admin-auth";

/** Cek sesi admin dari cookie request. Pakai di route handler / server action. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(ADMIN_COOKIE)?.value);
}
