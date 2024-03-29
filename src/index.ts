import { Command } from "commander";
import { getPackageInfo } from "./utils/get-package-info";
import { init } from "./commands/init";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const packageInfo = await getPackageInfo();
  const program = new Command()
    .name("custom-gh-action")
    .description("create custom github action")
    .version(
      packageInfo.version || "1.0.0",
      "-v, --version",
      "display the version number"
    );

   program.addCommand(init); 
   program.parse()
}

main()
