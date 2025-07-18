import express from "express";

import databaseCollectionsRouter from "./controllers/collections.controller";

const router = express.Router();

router.use("/collections", databaseCollectionsRouter);

export default router;
