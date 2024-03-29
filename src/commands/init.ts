import { existsSync, promises as fs, promises } from "fs";
import { Command } from "commander";
import path from "path";
import prompts from "prompts";
import { z } from "zod";
import { logger } from "../utils/logger";
import chalk from "chalk";
import { promptForComponents } from "../utils/prompt-for-components";
import ora from "ora";
import { prepareTargetDirectory } from "../utils/prepare-target-dir";
import { execa } from "execa"
import { getPackageManager } from "../utils/get-package-manager";

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
  name: z.optional(z.string()),
});

const custom_action = [
  {
    name: "javascript",
    label: "JavaScript",
  },
  {
    name: "docker",
    label: "Docker",
  },
  {
    name: "composite",
    label: "Composite",
  },
]

const dev_dependencies = [
  "@types/nodes",
  "typescript"
]



export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-n, --name <name>", "the name of the github action.", "")
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts);
      const cwd = path.resolve(options.cwd);

      // Ensure target directory exists.
      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      const config = await promptForConfig(cwd);
      // Prompt for JavaScript components (if JavaScript is selected)
      const isJavascript = config.custom_action === "javascript";
      if (isJavascript) {
        const selectedComponents: string[] | undefined = await promptForComponents(isJavascript);
        console.log("🚀 ~ .action ~ selectedComponents:", selectedComponents)

        if (!selectedComponents?.length) {
          logger.warn("No components selected. Exiting.")
          process.exit(0)
        }

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

        const spinner = ora(`Installing components...`).start()
        const targetDir = path.join(
          // Use provided cwd if available, otherwise default to process.cwd()
          options.cwd || process.cwd(),
          config.action_name
        );
        await prepareTargetDirectory(targetDir);
        const packageManager = await getPackageManager(cwd || targetDir)
        // Installation code within the for loop
        for (const npm_package of selectedComponents) {
          spinner.text = `Installing ${npm_package}...`;
          console.log("🚀 ~ .action ~ targetDir:", targetDir)
          try {
            // Install package using execaCommand with target directory
            await execa(
              packageManager,
              [
                "npm" ? "install" : "add",
                npm_package,
              ],
              {
                cwd: targetDir,
              }
            )
          } catch (error) {
            logger.error(`Failed to install ${npm_package}: ${error}`);
          }
        }

      }

      logger.info("");
      logger.info(
        `${chalk.green(
          "Success!"
        )} Project initialization completed. You may now add components.`
      );
      logger.info("");
    } catch (error) {
      console.log(error);
    }
  });

export async function promptForConfig(cwd: string, skip = false) {
  const highlight = (text: string) => chalk.cyan(text);


  const validateName = (name: string) => {
    // Adjusted regular expression to allow underscores and hyphens
    const isValid = /^[a-zA-Z0-9_-]+$/.test(name);

    if (!isValid) {
      console.log("Invalid name. The name must not contain special characters or spaces, except for underscores and hyphens.");
      return false;
    }

    return true;
  };

  const options = await prompts([
    {
      type: "text",
      name: "action_name",
      message: `What is the name of your action? `,
      validate: (name: string) => validateName(name)
    },
    {
      type: "select",
      name: "custom_action",
      message: `Which ${highlight("custom action")} would you like to use?`,
      choices: custom_action.map((custom_action) => ({
        title: custom_action.label,
        value: custom_action.name,
      })),
    },
    {
      type: (prev) => (prev === "javascript" ? "toggle" : null),
      name: "typescript",
      message: `Would you like to use ${highlight(
        "TypeScript"
      )} (recommended)?`,
      initial: true,
      active: "yes",
      inactive: "no",
    }
  ]);


  if (!skip && options.custom_action !== "javascript") {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Do you want to ${highlight(
        "proceed"
      )}. Proceed?`,
      initial: true,
    })

    if (!proceed) {
      process.exit(0)
    }
  }

  return options;
}
