// This file enables type checking and editor autocomplete for this Ponder project.
// After upgrading, you may find that changes have been made to this file.
// If this happens, please commit the changes. Do not manually edit this file.
// See https://ponder.sh/docs/getting-started/installation#typescript for more information.

/// <reference types="@ponder/core/virtual" />

declare module "@/generated" {
  import type { Virtual } from "@ponder/core";

  type config = typeof import("./ponder.config.ts").default;
  type schema = typeof import("./ponder.schema.ts").default;

  export const ponder: Virtual.Registry<config, schema>;

  export type EventNames = Virtual.EventNames<config>;
  export type Event<name extends EventNames = EventNames> = Virtual.Event<
    config,
    name
  >;
  export type Context<name extends EventNames = EventNames> = Virtual.Context<
    config,
    schema,
    name
  >;
  export type IndexingFunctionArgs<name extends EventNames = EventNames> =
    Virtual.IndexingFunctionArgs<config, schema, name>;
  export type Schema = Virtual.Schema<schema>;
}

declare module "ponder:db" {
  import type { ConvertToDrizzleTable } from "@ponder/core";

  type schema = typeof import("./ponder.schema.ts").default;

  const drizzleTables: {
    [tableName in keyof schema]: ConvertToDrizzleTable<
      tableName,
      schema[tableName]["table"],
      schema
    >;
  };

  export = drizzleTables;
}
