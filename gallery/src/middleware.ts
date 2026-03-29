import PocketBase from "pocketbase";
import type { APIContext, MiddlewareNext } from "astro";
import { sequence } from "astro:middleware";
import { PocketBaseCollections } from "./models/PocketBase";

const isSafeRoute = (path: string) => {
  return path === "/admin/login" || !path.startsWith("/admin");
};

async function addPocketBase(context: APIContext, next: MiddlewareNext) {
  const pb = new PocketBase(import.meta.env.POKETBASE_URL);
  context.locals.pb = pb;

  pb.authStore.loadFromCookie(context.request.headers.get("cookie") || "");

  try {
    pb.authStore.isValid &&
      (await pb.collection(PocketBaseCollections.USERS).authRefresh());
  } catch {
    pb.authStore.clear();
  }

  const response = await next();

  response.headers.append("set-cookie", pb.authStore.exportToCookie());

  return response;
}

async function routeGuard(context: APIContext, next: MiddlewareNext) {
  const pathname = new URL(context.url).pathname;
  const isLoggedIn = context.locals.pb.authStore.isValid;

  if (isSafeRoute(pathname)) {
    if (pathname === "/admin/login" && isLoggedIn) {
      return context.redirect("/admin");
    }

    return next();
  }

  if (!isLoggedIn) {
    return context.redirect("/admin/login");
  }

  return next();
}

export const onRequest = sequence(addPocketBase, routeGuard);
