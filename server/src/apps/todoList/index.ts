import express from "express";

import todoListEntriesRouter from "./controllers/entries.controller";
import todoListListsRouter from "./controllers/lists.controller";
import todoListPrioritiesRouter from "./controllers/priorities.controller";
import todoListTagsRouter from "./controllers/tags.controller";

const router = express.Router();

router.use("/entries", todoListEntriesRouter);
router.use("/priorities", todoListPrioritiesRouter);
router.use("/lists", todoListListsRouter);
router.use("/tags", todoListTagsRouter);

export default router;
