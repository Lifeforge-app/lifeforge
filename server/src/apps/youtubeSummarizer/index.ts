import express from "express";

import youtubeSummarizerRouter from "./controllers/youtubeSummarizer.controller";

const router = express.Router();

router.use("/", youtubeSummarizerRouter);

export default router;
