# [custom-gha-cli](https://www.npmjs.com/package/custom-gha-cli)

A CLI for creating custom github actions: 
- `Docker` 
- `Javascript` 
- `Composite`

## Usage

Use the `init` command to initialize dependencies for a new action.

The `init` command installs dependencies, sets up folder structure, configures `action.yaml`, necessary files.

```bash
npx custom-gha-cli init
```

## Folder Structure

**TypeScript Action:**
```
action-name
├── action.yaml
├── node_modules
│   ├── @types
│   ├── @vercel
│   ├── typescript
│   └── undici-types
├── package-lock.json
├── package.json
├── src
│   └── action-name.ts
└── tsconfig.json
```

**JavaScript Action:**
```
action-name
├── action.yaml
├── node_modules
│   ├── @types
│   ├── @vercel
│   ├── typescript
│   └── undici-types
├── package-lock.json
├── package.json
└── src
    └── action-name.js
```
`action.yaml`
```YAML
name: action
description: action

runs:
  using: 'node16'
  main: 'dist/index.js'
```
**Docker Action:**
```
container-action
├── Dockerfile
└── action.yaml
```
`action.yaml`
```YAML
name: container-action
description: container-action

runs:
  using: 'docker'
  main: 'Dockerfile'
  args:
```
**Composite Action:**
```
composite-action
└── action.yaml
```
`action.yaml`
```YAML
name: 'container-action'
description: 'container-action'

runs:
  using: "composite"
  steps:
    - name: Set Greeting
      run: echo "Hello custom github action"
      shell: bash
      env:
```

## Example

<img src="https://raw.githubusercontent.com/trial-pyth/custom-github-action/main/img/cli1.PNG" />
<img src="https://raw.githubusercontent.com/trial-pyth/custom-github-action/main/img/cli2.PNG" />
