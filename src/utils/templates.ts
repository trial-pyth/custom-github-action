export const GITIGNORE = `# Node.js and npm
node_modules/
npm-debug.log
*.log
yarn-error.log

# Dependency directories
jspm_packages/
bower_components/

# Typescript
*.tsbuildinfo

# IDEs and editors
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
.DS_Store

# Docker
.dockerignore
.docker/

# Build files
/dist
/out
/.ncc

# Environment variables file
.env
.env.local
.env.*.local
!.env.example

# Log files
*.log
logs/
*.log.*
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log
`

export const JAVASCRIPT_YAML_TEMPLATE = (action_name: string) => {
  return `name: ${action_name}
description: ${action_name}
    
runs:
  using: 'node16'
  main: 'dist/index.js'`
}

export const TYPESCRIPT_JSON_TEMPLATE = `{
    "compilerOptions": {
      "target": "es2019", // Or "esnext" for the latest
      "module": "esnext", // Or any of the allowed values per your environment
      "outDir": "lib",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "skipLibCheck": true,
      "moduleResolution": "node"
    }
  }`

export const JAVASCRIPT_PACKAGE_JSON = (action_name: string) => {
  return `{
    "name": "${action_name}",
    "version": "0.0.1",
    "description": "",
    "main": "dist/index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "build": "ncc build lib/${action_name}.js"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "@types/node": "^20.10.8",
      "typescript": "^5.3.3",
      "@vercel/ncc": "^0.38.1"
    },
    "dependencies": {
    }
  }`
}

export const TYPESCRIPT_PACKAGE_JSON = (action_name: string) => {
  return `{
    "name": "${action_name}",
    "version": "0.0.1",
    "description": "",
    "main": "dist/index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "build": "tsc && ncc build lib/${action_name}.js"
    },
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "@types/node": "^20.10.8",
      "typescript": "^5.3.3",
      "@vercel/ncc": "^0.38.1"
    },
    "dependencies": {
    }
  }`
}

export const DOCKER_ACTION_TEMPLATE = (action_name: string) => {
  return `name: ${action_name}
description: ${action_name}
    
runs:
  using: 'docker'
  main: 'Dockerfile'
  args:
    -`
}

export const DOCKERFILE = `FROM alpine:latest

ENTRYPOINT ['/entrypoint.sh']`

export const COMPOSITE_ACTION_TEMPLATE = (action_name: string) => {
  return `name: '${action_name}'
description: '${action_name}'

runs:
  using: "composite"
  steps:
    - name: Set Greeting
      run: echo "Hello custom github action"
      shell: bash
      env:`
}
