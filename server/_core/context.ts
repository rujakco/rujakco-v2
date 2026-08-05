import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures, so we still hide
    // the failure from the caller by falling back to `user = null` — but
    // we previously discarded the error entirely, which meant real auth
    // problems (expired secrets, DB unavailable, malformed sessions) were
    // invisible to us in logs. Log internally so they're diagnosable.
    console.error("[Auth] authenticateRequest failed:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
