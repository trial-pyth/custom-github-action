import { existsSync, promises as fs } from "fs";
import { Command } from "commander";
import path from "path";
import prompts from "prompts";
import { z } from "zod";
import { logger } from "../utils/logger";
import chalk from "chalk";

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
  name: z.optional(z.string()),
});

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
  ];

  const validateName = (name:string) => {
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
      validate:(name:string) => validateName(name)
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
    },
  ]);

  
  if (!skip) {
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
