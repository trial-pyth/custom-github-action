import ora from "ora";
import { TInitOptions } from "../types";
import prompts from "prompts";
import path from "path";
import { prepareTargetDirectory } from "./prepare-target-dir";
import { writeDockerActionFiles } from "./write-docker-action-files";
import { logger } from "./logger";
import chalk from "chalk";

export async function handleDockerAction(options: TInitOptions, config: prompts.Answers<"action_name" | "typescript" | "custom_action">) {
    const spinner = ora(`Preparing action...`).start()
    const targetDir = path.join(
        // Use provided cwd if available, otherwise default to process.cwd()
        options.cwd || process.cwd(),
        config.action_name
    );
    await prepareTargetDirectory(targetDir);


    // Navigate into the target directory
    process.chdir(targetDir);

    // Write action.yaml and Dockerfile
    await writeDockerActionFiles(targetDir, config.action_name)

    spinner.succeed(`Done.`)

    logger.info("");
    logger.info(
        `${chalk.green(
            "Success!"
        )} Project initialization completed. You may now modify your action`
    );
    logger.info("");
}