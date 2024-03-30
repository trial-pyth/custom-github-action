import { execa } from "execa";
import { handleError } from "./handle-error";
import { promptForComponents } from "./prompt-for-components";
import chalk from "chalk";
import { logger } from "./logger";
import { TInitOptions } from "../types";
import prompts from "prompts";
import ora from "ora";
import path from "path";
import { prepareTargetDirectory } from "./prepare-target-dir";
import { getPackageManager } from "./get-package-manager";
import { writeJavascriptActionFiles } from "./write-js-action-files";




export async function handleJavascriptAction(options: TInitOptions, config: prompts.Answers<"action_name" | "typescript" | "custom_action">, cwd: string) {


    const selectedComponents: string[] | undefined = await promptForComponents();
    logger.info(`Selected Packages: ${chalk.green(selectedComponents)}`)


    if (!options.yes) {
        const { proceed } = await prompts({
            type: "confirm",
            name: "proceed",
            message: `Ready to install components and dependencies. Proceed?`,
            initial: true,
        })

        if (!proceed) {
            process.exit(0)
        }
    }

    const spinner = ora(`Preparing action...`).start()
    const targetDir = path.join(
        // Use provided cwd if available, otherwise default to process.cwd()
        options.cwd || process.cwd(),
        config.action_name
    );
    await prepareTargetDirectory(targetDir);
    const packageManager = await getPackageManager(cwd)

    // Navigate into the target directory
    process.chdir(targetDir);

    // Write package.json and tsconfig.json if applicable
    await writeJavascriptActionFiles(config.typescript, targetDir, config.action_name);

    try {
        await execa(packageManager, ["update"], { cwd: targetDir });
        logger.info("Updated packages")
    } catch (error) {
        handleError(error)
    }

    // Installing selected packages
    if (selectedComponents) {
        for (const npm_package of selectedComponents) {
            spinner.text = `Installing ${npm_package}...`;
            try {
                // Install package using execaCommand with target directory
                await execa(
                    packageManager,
                    [
                        packageManager === "npm" ? "install" : "add",
                        npm_package,
                    ]
                )
            } catch (error) {
                handleError(error)
            }
        }
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