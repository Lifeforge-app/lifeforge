import express from "express";

import guitarTabsEntriesRouter from "./controllers/entries.controller";
import guitarTabsGuitarWorldRouter from "./controllers/guitarWorld.controller";

const router = express.Router();

router.use("/entries", guitarTabsEntriesRouter);
router.use("/guitar-world", guitarTabsGuitarWorldRouter);

export default router;
