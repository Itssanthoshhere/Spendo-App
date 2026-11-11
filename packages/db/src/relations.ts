import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";
import { authRelations } from "./schema/_relations";

export const relations = {
  ...defineRelations(schema),
  ...authRelations,
};
