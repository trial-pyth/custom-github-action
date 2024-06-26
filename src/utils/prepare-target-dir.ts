import { existsSync, promises } from "fs";
import { logger } from "./logger";

export async function prepareTargetDirectory(targetDir: string) {

  if (existsSync(targetDir)) {
    const files = await promises.readdir(targetDir);
    if (files.length > 0) {
      logger.error(`Target directory ${targetDir} is not empty. Please try again.`);
      process.exit(1);
    }
  } else {
    await promises.mkdir(targetDir);
  }
}