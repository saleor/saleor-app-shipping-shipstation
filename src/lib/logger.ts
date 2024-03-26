import pino from "pino";
import { ENV_CONFIG } from "../env-config";

export const logger = pino({
  level: ENV_CONFIG.LOG_LEVEL,
  transport: {
    target: "pino-pretty",
  },
});

export const createLogger = (name: string) => logger.child({ name });
