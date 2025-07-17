import express from "express";

import virtualWardrobeEntriesRouter from "./controllers/entries.controller";
import virtualWardrobeSessionRouter from "./controllers/session.controller";

const router = express.Router();

router.use("/entries", virtualWardrobeEntriesRouter);
router.use("/session", virtualWardrobeSessionRouter);

export default router;
