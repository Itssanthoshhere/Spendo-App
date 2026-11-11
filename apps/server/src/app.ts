import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { ENV } from "./env.server";
import { auth } from "./services";

export const app = new Hono()
  .use(logger())
  .use(
    "/*",
    cors({
      origin: ENV.CORS_ORIGIN,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "Cookie"],
      credentials: true,
    }),
  )
  .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.onError((err, c) => {
  console.error("[Server Error]", err);
  return c.json(
    {
      error: err.message || "Internal Server Error",
      ...(ENV.NODE_ENV === "development" ? { stack: err.stack } : {}),
    },
    500,
  );
});

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

export type AppType = typeof app;
export default app;
