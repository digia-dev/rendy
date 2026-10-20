import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next 16: konvensi `middleware` digantikan `proxy` (lihat next/dist/docs/01-app/01-getting-started/16-proxy.md)
const handleI18nRouting = createMiddleware(routing);

export function proxy(request: Parameters<typeof handleI18nRouting>[0]) {
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
