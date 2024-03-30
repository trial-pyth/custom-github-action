#!/user/bin/env node
import { Command } from "commander";
import { init } from "./commands/init";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("custom-gh-action")
    .description("create custom github action")
    .version(
      "1.0.0",
      "-v, --version",
      "display the version number"
    );

   program.addCommand(init); 
   program.parse()
}

main()
