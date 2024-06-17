import {
  setupAnvil,
  setupCommon,
  setupIsolatedDatabase,
} from "@/_test/setup.js";
import type { Build } from "@/build/index.js";
import * as codegen from "@/common/codegen.js";
import { buildGraphQLSchema } from "@/graphql/buildGraphqlSchema.js";
import { createSchema } from "@/schema/schema.js";
import { promiseWithResolvers } from "@ponder/common";
import { beforeEach, expect, test, vi } from "vitest";
import { run } from "./run.js";

beforeEach(setupCommon);
beforeEach(setupAnvil);
beforeEach(setupIsolatedDatabase);

const schema = createSchema((p) => ({
  TransferEvent: p.createTable({
    id: p.string(),
    timestamp: p.int(),
  }),
  Supply: p.createTable({
    id: p.string(),
    supply: p.bigint(),
  }),
}));

const graphQLSchema = buildGraphQLSchema(schema);

test("run() kill", async (context) => {
  const build: Build = {
    buildId: "buildId",
    schema,
    graphQLSchema,
    databaseConfig: context.databaseConfig,
    optionsConfig: {},
    networks: context.networks,
    sources: context.sources,
    indexingFunctions: {},
  };

  const codegenSpy = vi.spyOn(codegen, "runCodegen");

  const kill = await run({
    common: context.common,
    build,
    onFatalError: vi.fn(),
    onReloadableError: vi.fn(),
  });

  expect(codegenSpy).toHaveBeenCalledOnce();

  await kill();
});

test("run() setup", async (context) => {
  const indexingFunctions = {
    "Erc20:setup": vi.fn(),
  };

  const build: Build = {
    buildId: "buildId",
    schema,
    graphQLSchema,
    databaseConfig: context.databaseConfig,
    optionsConfig: {},
    networks: context.networks,
    sources: context.sources,
    indexingFunctions,
  };

  const kill = await run({
    common: context.common,
    build,
    onFatalError: vi.fn(),
    onReloadableError: vi.fn(),
  });

  expect(indexingFunctions["Erc20:setup"]).toHaveBeenCalledOnce();

  await kill();
});

test("run() setup error", async (context) => {
  const indexingFunctions = {
    "Erc20:setup": vi.fn(),
  };
  const onReloadableErrorPromiseResolver = promiseWithResolvers<void>();

  const build: Build = {
    buildId: "buildId",
    schema,
    graphQLSchema,
    databaseConfig: context.databaseConfig,
    optionsConfig: {},
    networks: context.networks,
    sources: context.sources,
    indexingFunctions,
  };

  indexingFunctions["Erc20:setup"].mockRejectedValue(new Error());

  const kill = await run({
    common: context.common,
    build,
    onFatalError: vi.fn(),
    onReloadableError: () => {
      onReloadableErrorPromiseResolver.resolve();
    },
  });

  await onReloadableErrorPromiseResolver.promise;

  expect(indexingFunctions["Erc20:setup"]).toHaveBeenCalledTimes(1);

  await kill();
});

test.todo("run() checkpoint");

test.todo("run() reorg ignored");

test.todo("run() reorg");

test.todo("run() finalize");

test.todo("run() error");

test.todo("run() healthy");
