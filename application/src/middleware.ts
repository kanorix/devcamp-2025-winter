import NextAuth from "next-auth";

import { type NextRequest } from "next/server";
import { authConfig } from "./server/auth/config";

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  const isOnDashboard = req.nextUrl.pathname.startsWith("/scrap");
  const authenticate = await auth();
  const isLoggedIn = !!authenticate?.user;
  if (isOnDashboard) {
    if (!isLoggedIn)
      return Response.redirect(new URL("/api/auth/signin", req.nextUrl));
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
