import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { REF_CODE_RE, REF_COOKIE } from "@/lib/referral";

export async function middleware(request: NextRequest) {
  const needsAuth =
    request.nextUrl.pathname.startsWith("/portal") ||
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/api/portal") ||
    request.nextUrl.pathname.startsWith("/api/admin") ||
    request.nextUrl.pathname.startsWith("/auth");
  const response = needsAuth ? await updateSession(request) : NextResponse.next();

  // Referral tracking: ?ref=CODE -> 30-day first-party cookie (strictly necessary for payouts).
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref && REF_CODE_RE.test(ref)) {
    response.cookies.set(REF_COOKIE, ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      httpOnly: false, // read by the questionnaire to fill the hidden field
      secure: process.env.NODE_ENV === "production",
    });
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)",
  ],
};
