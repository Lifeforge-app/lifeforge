import express from "express";

import achievementsEntriesRouter from "./controllers/entries.controller";

const router = express.Router();

router.use("/entries", achievementsEntriesRouter);

export default router;
