import { expo } from "@better-auth/expo";
import type { Database } from "@spendo/db";
import * as schema from "@spendo/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export type AuthConfig = {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  CORS_ORIGIN: string;
  NODE_ENV?: "development" | "production" | "test";
};

export function createAuth(
  env: AuthConfig,
  database: Database,
  desktopOrigins: readonly string[] = [],
) {
  const devOrigins = env.NODE_ENV === "development" ? ["*"] : [];

  return betterAuth({
    database: drizzleAdapter(database, {
      provider: "pg",
      schema,
    }),
    trustedOrigins: [
      env.CORS_ORIGIN,
      ...desktopOrigins,
      "spendo://",
      "spendo.exp.direct://",
      "cashory://",
      "cashory.exp.direct://",
      "mybettertapp://",
      "exp://",
      "http://localhost:8081",
      ...devOrigins,
    ],
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        onboardingCompleted: {
          type: "boolean",
          required: false,
          input: true,
        },
        country: {
          type: "string",
          required: false,
          input: true,
        },
        phone: {
          type: "string",
          required: false,
          input: true,
        },
        image: {
          type: "string",
          required: false,
          input: true,
        },
        currency: {
          type: "string",
          required: false,
          input: true,
        },
      },
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
      disableCSRFCheck: env.NODE_ENV === "development",
    },
    plugins: [expo()],
  });
}

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
