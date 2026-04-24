import express from "express";
import {
  createLog,
  getLogs,
  getLogLevelDistribution,
  getLogsOverTime,
  getLogsPerService,
  getTopErrorMessages,
} from "../controllers/log.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { enforceLogLimits } from "../middleware/plan.middleware.js";
import { logSchema } from "../validators/log.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/", auth, enforceLogLimits, validate(logSchema), createLog);
router.get("/analytics/services", auth, getLogsPerService);
router.get("/analytics/levels", auth, getLogLevelDistribution);
router.get("/analytics/timeseries", auth, getLogsOverTime);
router.get("/analytics/top-errors", auth, getTopErrorMessages);
router.get("/", auth, getLogs);

export default router;
