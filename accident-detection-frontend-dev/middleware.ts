// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { cookies } from "next/headers";
// import { getCookie } from "cookies-next";

// export function middleware(request: NextRequest) {
//   const cookieStore = cookies();
//   const token = cookieStore.get("token")?.value;
//   const path = request.nextUrl.pathname;
//   console.log("cookie", token);

//   if (path.startsWith("/auth") && token) {
//     return NextResponse.redirect(new URL("/auth/bbb", request.url));
//   }

//   if (path.startsWith("/auth/bbb") && !token) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getCookie } from "cookies-next";

// export function middleware(request: NextRequest) {
//   const token = getCookie("access_token", { req: request });

//   const path = request.nextUrl.pathname;
//   console.log("cookie", token);

//   if (path.startsWith("/auth/bbb") && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   if (path.startsWith("/dashboard") && !token) {
//     return NextResponse.redirect(new URL("/auth/bbb", request.url));
//   }
// }
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.headers.get("Authorization");

  const path = request.nextUrl.pathname;
  console.log("Authorization header", token);

  // if (path.startsWith("/auth") && token) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  if (path.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
