import { promises } from "fs";
import path from "path";
import { DOCKERFILE, DOCKER_ACTION_TEMPLATE, GITIGNORE } from "./templates";
import { logger } from "./logger";

export async function writeDockerActionFiles(targetDir: string, action_name: string) {
    try {
        // Write .gitignore
        await promises.writeFile(path.join(targetDir,".gitignore"),GITIGNORE)

        // Write action.yaml 
        const dockerYAMLContent = DOCKER_ACTION_TEMPLATE(action_name)
        const dockerYAMLPath = path.join(targetDir, "action.yaml");
        await promises.writeFile(dockerYAMLPath, dockerYAMLContent);
        logger.info("action.yaml file created successfully.");
        
        // Write Dockerfile
        const dockerfileContent = DOCKERFILE
        const dockerfilePath = path.join(targetDir, "Dockerfile");
        await promises.writeFile(dockerfilePath, dockerfileContent);
        logger.info("Dockerfile created successfully.");
    } catch (error) {
        logger.error("Error writing Dockerfile", error);
    }
}