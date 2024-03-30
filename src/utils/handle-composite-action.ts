import prompts from "prompts";
import { TInitOptions } from "../types";
import ora from "ora";
import path from "path";
import { prepareTargetDirectory } from "./prepare-target-dir";
import { promises } from "fs";
import { COMPOSITE_ACTION_TEMPLATE, GITIGNORE } from "./templates";
import { logger } from "./logger";
import chalk from "chalk";

export async function handleCompositeAction(options: TInitOptions, config: prompts.Answers<"action_name" | "typescript" | "custom_action">) {
    const spinner = ora(`Preparing action...`).start()
    const targetDir = path.join(
        // Use provided cwd if available, otherwise default to process.cwd()
        options.cwd || process.cwd(),
        config.action_name
    );
    await prepareTargetDirectory(targetDir);

    // Navigate into the target directory
    process.chdir(targetDir);

    try {
        // Write .gitignore
        await promises.writeFile(path.join(targetDir, ".gitignore"), GITIGNORE)

        // Write action.yaml 
        const compositeYAMLContent = COMPOSITE_ACTION_TEMPLATE(config.action_name)
        const compositeYAMLPath = path.join(targetDir, "action.yaml");
        await promises.writeFile(compositeYAMLPath, compositeYAMLContent);
        logger.info("Composite action.yaml file created successfully.");
    } catch (error) {
        logger.error("Error writing Dockerfile", error);
    }

    spinner.succeed(`Done.`)

    logger.info("");
    logger.info(
        `${chalk.green(
            "Success!"
        )} Project initialization completed. You may now modify your action`
    );
    logger.info("");
}