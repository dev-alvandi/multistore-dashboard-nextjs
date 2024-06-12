import {
  authMiddleware,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/"]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// });

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
