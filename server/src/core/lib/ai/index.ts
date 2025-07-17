import express from "express";

import imageGenerationRouter from "./controllers/imageGeneration.controller";

const router = express.Router();

router.use("/image-generation", imageGenerationRouter);

export default router;
