import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import taskPoolMiddleware from "@middlewares/taskPoolMiddleware";

import { CORS_ALLOWED_ORIGINS } from "./constants/corsAllowedOrigins";
import morganMiddleware from "./middlewares/morganMiddleware";
import pocketbaseMiddleware from "./middlewares/pocketbaseMiddleware";
import rateLimitingMiddleware from "./middlewares/rateLimitingMiddleware";
import router from "./routes";

dotenv.config({
  path: "./env/.env.local",
});

const app = express();

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
app.use(
  cors({
    origin: CORS_ALLOWED_ORIGINS,
  }),
);
app.use(express.raw());
app.use(express.json({ limit: "50mb" }));
app.use(morganMiddleware);
app.use(pocketbaseMiddleware);
app.use(taskPoolMiddleware);
app.use(rateLimitingMiddleware);

app.use("/", router);

export default app;
