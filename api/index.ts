/*
 * RUJAK.Co — Vercel Serverless Function Entry
 *
 * Same Express app as server/_core/index.ts, but exported for Vercel's
 * Node.js runtime instead of started with app.listen(). Static file
 * serving is intentionally omitted here — Vercel serves the built
 * client (dist/public) directly via its CDN, configured in vercel.json.
 */
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

registerStorageProxy(app);
registerOAuthRoutes(app);

app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
