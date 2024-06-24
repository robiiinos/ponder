import type {
  ExtractNonVirtualColumnNames,
  Table as PonderTable,
} from "@/schema/common.js";
import type { InferScalarType } from "@/schema/infer.js";
import type {
  BuildColumns,
  ColumnBuilderBase,
  ColumnsSelection,
  Table,
  TableConfig,
  View,
} from "drizzle-orm";

/**
 * https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/table.ts#L49
 * https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/pg-core/table.ts#L43
 */
export type TableWithColumns<T extends TableConfig> = Table<T> & {
  [key in keyof T["columns"]]: T["columns"][key];
};

/**
 * https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/sqlite-core/view.ts#L154
 * https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/pg-core/view.ts#L305
 */
export type ViewWithSelection<
  TName extends string,
  TExisting extends boolean,
  TSelection extends ColumnsSelection,
> = View<TName, TExisting, TSelection> & TSelection;

/**
 * @returns TableWithColumns
 */
export type ConvertToDrizzleTable<
  tableName extends string,
  table extends PonderTable,
> = TableWithColumns<{
  name: tableName;
  schema: undefined;
  columns: BuildColumns<
    tableName,
    {
      [columnName in ExtractNonVirtualColumnNames<table>]: ColumnBuilderBase<{
        name: columnName & string;
        dataType: "string";
        columnType: "custom";
        data: InferScalarType<table[columnName][" scalar"]>;
        driverParam: unknown;
        enumValues: undefined;
        notNull: table[columnName][" optional"] extends true ? false : true;
        primaryKey: columnName extends "id" ? true : false;
      }>;
    },
    "common"
  >;
  dialect: "common";
}>;