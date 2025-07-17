import express from "express";

import passwordsEntriesRouter from "./controllers/entries.controller";
import passwordsMasterRouter from "./controllers/master.controller";

const router = express.Router();

router.use("/master", passwordsMasterRouter);
router.use("/entries", passwordsEntriesRouter);

export default router;
