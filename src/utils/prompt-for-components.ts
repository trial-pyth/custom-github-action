import prompts from "prompts"

const dependencies = [
    "@octokit/core",
    "@actions/core",
    "@actions/github",
    "jest",
    "axios",
    "node-fetch"
]

export async function promptForComponents() {


    const choices = dependencies.map((entry) => ({
        title: entry,
        value: entry,
        selected: false, // Initially deselect all components
    }));

    const response = await prompts({
        type: "multiselect",
        name: "components",
        message: "Which packages would you like to add?",
        hint: "Space to select. A to toggle all. Enter to submit.",
        instructions: false,
        choices,
    });

    return response.components; // Return the selected components
}