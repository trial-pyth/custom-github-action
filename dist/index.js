import{Command as B}from"commander";import M from"path";import O from"fs-extra";function x(){let e=M.join("package.json");return O.readJSONSync(e)}import{existsSync as Y}from"fs";import{Command as D}from"commander";import _ from"path";import h from"prompts";import{z as g}from"zod";import f from"chalk";var t={error(...e){console.log(f.red(...e))},warn(...e){console.log(f.yellow(...e))},info(...e){console.log(f.cyan(...e))},success(...e){console.log(f.green(...e))},break(){console.log("")}};import k from"chalk";import F from"prompts";var R=["@octokit/core","@actions/core","@actions/github","axios","node-fetch"];async function v(e){if(!e)return;let o=R.map(r=>({title:r,value:r,selected:!1}));return(await F({type:"multiselect",name:"components",message:"Which packages would you like to add?",hint:"Space to select. A to toggle all. Enter to submit.",instructions:!1,choices:o})).components}import V from"ora";import{existsSync as G,promises as P}from"fs";async function b(e){G(e)?(await P.readdir(e)).length>0&&(t.error(`Target directory ${e} is not empty. Please try again.`),process.exit(1)):await P.mkdir(e)}import{execa as J}from"execa";import{detect as L}from"@antfu/ni";async function j(e){let o=await L({programmatic:!0,cwd:e});return o==="yarn@berry"?"yarn":o==="pnpm@6"?"pnpm":o==="bun"?"bun":o??"npm"}import{promises as p}from"fs";import l from"path";var S=`# Node.js and npm
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
`,C=e=>`name: ${e}
description: ${e}
    
runs:
  using: 'node16'
  main: 'dist/index.js'`,E=`{
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
  }`,A=e=>`{
    "name": "${e}",
    "version": "0.0.1",
    "description": "",
    "main": "dist/index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "build": "ncc build lib/${e}.js"
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
  }`,T=e=>`{
    "name": "${e}",
    "version": "0.0.1",
    "description": "",
    "main": "dist/index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "build": "tsc && ncc build lib/${e}.js"
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
  }`;async function I(e,o,n){try{await p.writeFile(l.join(o,".gitignore"),S);let r=C(n),s=l.join(o,"action.yaml");await p.writeFile(s,r),t.info("action.yaml file created successfully.");let i=l.join(o,"src");await p.mkdir(i,{recursive:!0});let y='console.log("Hello custom github action");',m=l.join(o,"src",`${n}.${e?"ts":"js"}`);await p.writeFile(m,y),t.info(`src/${n}.${e?"ts":"js"} file created successfully.`);let u=e?T(n):A(n),c=l.join(o,"package.json");if(await p.writeFile(c,u),t.info("package.json file created successfully."),e){let d=l.join(o,"tsconfig.json");await p.writeFile(d,E),t.info("tsconfig.json file created successfully.")}}catch(r){t.error("Error writing JSON files:",r)}}function w(e){typeof e=="string"&&(t.error(e),process.exit(1)),e instanceof Error&&(t.error(e.message),process.exit(1)),t.error("Something went wrong. Please try again."),process.exit(1)}var z=g.object({cwd:g.string(),yes:g.boolean(),name:g.optional(g.string())}),K=[{name:"javascript",label:"JavaScript"},{name:"docker",label:"Docker"},{name:"composite",label:"Composite"}],$=new D().name("init").description("initialize your project and install dependencies").option("-y, --yes","skip confirmation prompt.",!1).option("-c, --cwd <cwd>","the working directory. defaults to the current directory.",process.cwd()).option("-n, --name <name>","the name of the github action.","").action(async e=>{try{let o=z.parse(e),n=_.resolve(o.cwd);Y(n)||(t.error(`The path ${n} does not exist. Please try again.`),process.exit(1));let r=await W(n),s=r.custom_action==="javascript",i=r.custom_action==="docker",y=r.custom_action==="composite";if(s){let m=await v(s);if(t.info(`Selected Packages: ${k.green(m)}`),m?.length||(t.warn("No packages selected. Exiting."),process.exit(0)),!o.yes){let{proceed:a}=await h({type:"confirm",name:"proceed",message:"Ready to install components and dependencies. Proceed?",initial:!0});a||process.exit(0)}let u=V("Preparing action...").start(),c=_.join(o.cwd||process.cwd(),r.action_name);await b(c);let d=await j(n||c);process.chdir(c),await I(r.typescript,c,r.action_name);try{await J(d,["update"],{cwd:c}),t.info("Updated packages")}catch(a){w(a)}for(let a of m){u.text=`Installing ${a}...`;try{await J(d,[d==="npm"?"install":"add",a])}catch(N){w(N)}}u.succeed("Done.")}t.info(""),t.info(`${k.green("Success!")} Project initialization completed. You may now modify your action`),t.info("")}catch(o){console.log(o)}});async function W(e,o=!1){let n=i=>k.cyan(i),r=i=>/^[a-zA-Z0-9_-]+$/.test(i)?!0:(console.log("Invalid name. The name must not contain special characters or spaces, except for underscores and hyphens."),!1),s=await h([{type:"text",name:"action_name",message:"What is the name of your action? ",validate:i=>r(i)},{type:"select",name:"custom_action",message:`Which ${n("custom action")} would you like to use?`,choices:K.map(i=>({title:i.label,value:i.name}))},{type:i=>i==="javascript"?"toggle":null,name:"typescript",message:`Would you like to use ${n("TypeScript")} (recommended)?`,initial:!0,active:"yes",inactive:"no"}]);if(!o&&s.custom_action!=="javascript"){let{proceed:i}=await h({type:"confirm",name:"proceed",message:`Do you want to ${n("proceed")}. Proceed?`,initial:!0});i||process.exit(0)}return s}process.on("SIGINT",()=>process.exit(0));process.on("SIGTERM",()=>process.exit(0));async function H(){let e=await x(),o=new B().name("custom-gh-action").description("create custom github action").version(e.version||"1.0.0","-v, --version","display the version number");o.addCommand($),o.parse()}H();
//# sourceMappingURL=index.js.map