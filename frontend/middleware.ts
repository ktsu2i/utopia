import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authenticatedRoutes = ["/", "/demo"];

  if (authenticatedRoutes.includes(pathname)) {
    try {
      const token = req.cookies.get("token");
      console.log(token?.value);

      // eslint-disable-next-line
      const res = await fetch("http://utopia_backend:8080/api/validate-token", {
        method: "GET",
        credentials: "include",
      });

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
}

export const config = {
  matcher: [
    "/",
    "/demo",
  ],
};
