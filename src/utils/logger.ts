import chalk from "chalk"

export const logger = {
  error(...args: unknown[]) {
    console.log(chalk.red(...args))
  },
  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args))
  },
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args))
  },
  success(...args: unknown[]) {
    console.log(chalk.green(...args))
  },
  break() {
    console.log("")
  },
}

/* 
Take this as initial code:

const spinner = ora(`Installing components...`).start()
        const targetDir = path.join(
          // Use provided cwd if available, otherwise default to process.cwd()
          options.cwd || process.cwd(),
          config.action_name
        );
        await prepareTargetDirectory(targetDir);
        const packageManager = await getPackageManager(cwd || targetDir)

prepareTargetDirectory creates a dir with action_name, if it doesn;t exist.
Now I want to go into that target directory, writeJson() should be invoked. */
