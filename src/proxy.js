import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

console.log("🔥 proxy.js loaded");

export async function proxy(request) {
  console.log("🔥 PROXY REACHED:", request.nextUrl.pathname);

  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  try {
    // 1. Verify token and extract payload from cookie
    const secretKey = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_fallback_secret"
    );

    const { payload } = await jwtVerify(token, secretKey);

    // 2. Extract userRole from token payload
    const userRole = payload.userType;

    console.log("Proxy Check -> Path:", pathname, "| Role:", userRole);

    const isAdminRoute = pathname.startsWith("/d/admin");
    const isTeacherRoute = pathname.startsWith("/d/teacher");
    const isStudentRoute = pathname.startsWith("/d/student");

    if(isAdminRoute || isTeacherRoute || isStudentRoute){
      if(isAdminRoute && userRole === "admin") {
        return NextResponse.next()
      }
      else if(isTeacherRoute && userRole === "teacher") {
        return NextResponse.next()
      }
     else if(isStudentRoute && userRole === "student") {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
      }
    }

    if (pathname === "/d" || pathname === "/d/" ) {
      if (userRole === "admin") {
        console.log('reached inside admin if')
        return NextResponse.redirect(
          new URL("/d/admin", request.url)
        );
      }

      if (userRole === "teacher") {
        return NextResponse.redirect(
          new URL("/d/teacher", request.url)
        );
      }

      if (userRole === "student") {
        return NextResponse.redirect(
          new URL("/d/student", request.url)
        );
      }

      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy error:", error);

    const response = NextResponse.redirect(
      new URL("/sign-in", request.url)
    );

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: ["/d", "/d/:path*"],
};
