import express from "express";

import momentVaultEntriesRouter from "./controllers/entries.controller";
import momentVaultTranscriptionRouter from "./controllers/transcription.controller";

const router = express.Router();

router.use("/entries", momentVaultEntriesRouter);
router.use("/transcribe", momentVaultTranscriptionRouter);

export default router;
