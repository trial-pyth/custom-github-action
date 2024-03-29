import { promises } from "fs";
import path from "path";
import { JAVASCRIPT_PACKAGE_JSON, TYPESCRIPT_JSON_TEMPLATE, TYPESCRIPT_PACKAGE_JSON, JAVASCRIPT_YAML_TEMPLATE, GITIGNORE } from "./templates";
import { logger } from "./logger";

export async function writeJavascriptActionFiles(isTypescript: boolean, targetDir: string, action_name: string) {
    try {
        // Write .gitignore
        await promises.writeFile(path.join(targetDir,".gitignore"),GITIGNORE)


        // Write action.yaml 
        const javascriptYAMLContent = JAVASCRIPT_YAML_TEMPLATE(action_name)
        const javascriptYAMLPath = path.join(targetDir, "action.yaml");
        await promises.writeFile(javascriptYAMLPath, javascriptYAMLContent);
        logger.info("action.yaml file created successfully.");

        // Ensure src directory exists
        const srcDir = path.join(targetDir, "src");
        await promises.mkdir(srcDir, { recursive: true }); // Ensure the src directory and its parent directories are created

        // Write source file (JavaScript or TypeScript)
        const sourceFileContent = 'console.log("Hello custom github action");';
        const sourceFilePath = path.join(targetDir, "src", `${action_name}.${isTypescript ? "ts" : "js"}`);
        await promises.writeFile(sourceFilePath, sourceFileContent);
        logger.info(`src/${action_name}.${isTypescript ? "ts" : "js"} file created successfully.`);


        // Write package.json file
        const packageJsonContent = isTypescript ? TYPESCRIPT_PACKAGE_JSON(action_name) : JAVASCRIPT_PACKAGE_JSON(action_name);
        const packageJsonPath = path.join(targetDir, "package.json");
        await promises.writeFile(packageJsonPath, packageJsonContent);
        logger.info("package.json file created successfully.");

        // Write tsconfig.json file if TypeScript is used
        if (isTypescript) {
            const tsconfigJsonPath = path.join(targetDir, "tsconfig.json");
            await promises.writeFile(tsconfigJsonPath, TYPESCRIPT_JSON_TEMPLATE);
            logger.info("tsconfig.json file created successfully.");
        }
    } catch (error) {
        logger.error("Error writing files:", error);
    }
}