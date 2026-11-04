import { createAuth } from "@spendo/auth";
import { createDb } from "@spendo/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);
