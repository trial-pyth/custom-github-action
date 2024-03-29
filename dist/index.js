import{Command as mo}from"commander";import G from"path";import K from"fs-extra";function T(){let o=G.join("package.json");return K.readJSONSync(o)}import{existsSync as to}from"fs";import{Command as ro}from"commander";import no from"path";import io from"prompts";import{z as d}from"zod";import g from"chalk";var t={error(...o){console.log(g.red(...o))},warn(...o){console.log(g.yellow(...o))},info(...o){console.log(g.cyan(...o))},success(...o){console.log(g.green(...o))},break(){console.log("")}};import so from"chalk";import{execa as S}from"execa";function y(o){typeof o=="string"&&(t.error(o),process.exit(1)),o instanceof Error&&(t.error(o.message),process.exit(1)),t.error("Something went wrong. Please try again."),process.exit(1)}import z from"prompts";var V=["@octokit/core","@actions/core","@actions/github","jest","axios","node-fetch"];async function P(){let o=V.map(n=>({title:n,value:n,selected:!1}));return(await z({type:"multiselect",name:"components",message:"Which packages would you like to add?",hint:"Space to select. A to toggle all. Enter to submit.",instructions:!1,choices:o})).components}import M from"chalk";import B from"prompts";import U from"ora";import Z from"path";import{existsSync as W,promises as A}from"fs";async function p(o){W(o)?(await A.readdir(o)).length>0&&(t.error(`Target directory ${o} is not empty. Please try again.`),process.exit(1)):await A.mkdir(o)}import{detect as H}from"@antfu/ni";async function E(o){let e=await H({programmatic:!0,cwd:o});return e==="yarn@berry"?"yarn":e==="pnpm@6"?"pnpm":e==="bun"?"bun":e??"npm"}import{promises as l}from"fs";import f from"path";var m=`# Node.js and npm
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
`,I=o=>`name: ${o}
description: ${o}
    
runs:
  using: 'node16'
  main: 'dist/index.js'`,x=`{
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
  }`,C=o=>`{
    "name": "${o}",
    "version": "0.0.1",
    "description": "",
    "main": "dist/index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "build": "ncc build lib/${o}.js"
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
  }`,j=o=>`{
    "name": "${o}",
    "version": "0.0.1",
    "description": "",
    "main": "dist/index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1",
      "build": "tsc && ncc build lib/${o}.js"
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
  }`,v=o=>`name: ${o}
description: ${o}
    
runs:
  using: 'docker'
  main: 'Dockerfile'
  args:
    -`,_=`FROM alpine:latest

ENTRYPOINT ['/entrypoint.sh']`,O=o=>`name: '${o}'
description: '${o}'

runs:
  using: "composite"
  steps:
    - name: Set Greeting
      run: echo "Hello custom github action"
      shell: bash
      env:`;async function b(o,e,n){try{await l.writeFile(f.join(e,".gitignore"),m);let r=I(n),s=f.join(e,"action.yaml");await l.writeFile(s,r),t.info("action.yaml file created successfully.");let i=f.join(e,"src");await l.mkdir(i,{recursive:!0});let c='console.log("Hello custom github action");',a=f.join(e,"src",`${n}.${o?"ts":"js"}`);await l.writeFile(a,c),t.info(`src/${n}.${o?"ts":"js"} file created successfully.`);let u=o?j(n):C(n),L=f.join(e,"package.json");if(await l.writeFile(L,u),t.info("package.json file created successfully."),o){let Y=f.join(e,"tsconfig.json");await l.writeFile(Y,x),t.info("tsconfig.json file created successfully.")}}catch(r){t.error("Error writing files:",r)}}async function $(o,e,n){let r=await P();if(t.info(`Selected Packages: ${M.green(r)}`),!o.yes){let{proceed:a}=await B({type:"confirm",name:"proceed",message:"Ready to install components and dependencies. Proceed?",initial:!0});a||process.exit(0)}let s=U("Preparing action...").start(),i=Z.join(o.cwd||process.cwd(),e.action_name);await p(i);let c=await E(n);process.chdir(i),await b(e.typescript,i,e.action_name);try{await S(c,["update"],{cwd:i}),t.info("Updated packages")}catch(a){y(a)}if(r)for(let a of r){s.text=`Installing ${a}...`;try{await S(c,[c==="npm"?"install":"add",a])}catch(u){y(u)}}s.succeed("Done."),t.info(""),t.info(`${M.green("Success!")} Project initialization completed. You may now modify your action`),t.info("")}import q from"ora";import Q from"path";import{promises as w}from"fs";import h from"path";async function D(o,e){try{await w.writeFile(h.join(o,".gitignore"),m);let n=v(e),r=h.join(o,"action.yaml");await w.writeFile(r,n),t.info("action.yaml file created successfully.");let s=_,i=h.join(o,"Dockerfile");await w.writeFile(i,s),t.info("Dockerfile created successfully.")}catch(n){t.error("Error writing Dockerfile",n)}}import X from"chalk";async function F(o,e){let n=q("Preparing action...").start(),r=Q.join(o.cwd||process.cwd(),e.action_name);await p(r),process.chdir(r),await D(r,e.action_name),n.succeed("Done."),t.info(""),t.info(`${X.green("Success!")} Project initialization completed. You may now modify your action`),t.info("")}import oo from"ora";import k from"path";import{promises as J}from"fs";import eo from"chalk";async function N(o,e){let n=oo("Preparing action...").start(),r=k.join(o.cwd||process.cwd(),e.action_name);await p(r),process.chdir(r);try{await J.writeFile(k.join(r,".gitignore"),m);let s=O(e.action_name),i=k.join(r,"action.yaml");await J.writeFile(i,s),t.info("Composite action.yaml file created successfully.")}catch(s){t.error("Error writing Dockerfile",s)}n.succeed("Done."),t.info(""),t.info(`${eo.green("Success!")} Project initialization completed. You may now modify your action`),t.info("")}var co=d.object({cwd:d.string(),yes:d.boolean(),name:d.optional(d.string())}),ao=[{name:"javascript",label:"JavaScript"},{name:"docker",label:"Docker"},{name:"composite",label:"Composite"}],R=new ro().name("init").description("initialize your project and install dependencies").option("-y, --yes","skip confirmation prompt.",!1).option("-c, --cwd <cwd>","the working directory. defaults to the current directory.",process.cwd()).option("-n, --name <name>","the name of the github action.","").action(async o=>{try{let e=co.parse(o),n=no.resolve(e.cwd);to(n)||(t.error(`The path ${n} does not exist. Please try again.`),process.exit(1));let r=await po(n),s=r.custom_action==="javascript",i=r.custom_action==="docker",c=r.custom_action==="composite";s&&$(e,r,n),i&&F(e,r),c&&N(e,r)}catch(e){console.log(e)}});async function po(o,e=!1){let n=i=>so.cyan(i),r=i=>/^[a-zA-Z0-9_-]+$/.test(i)?!0:(console.log("Invalid name. The name must not contain special characters or spaces, except for underscores and hyphens."),!1);return await io([{type:"text",name:"action_name",message:"What is the name of your action? ",validate:i=>r(i)},{type:"select",name:"custom_action",message:`Which ${n("custom action")} would you like to use?`,choices:ao.map(i=>({title:i.label,value:i.name}))},{type:i=>i==="javascript"?"toggle":null,name:"typescript",message:`Would you like to use ${n("TypeScript")} (recommended)?`,initial:!0,active:"yes",inactive:"no"}])}process.on("SIGINT",()=>process.exit(0));process.on("SIGTERM",()=>process.exit(0));async function lo(){let o=await T(),e=new mo().name("custom-gh-action").description("create custom github action").version(o.version||"1.0.0","-v, --version","display the version number");e.addCommand(R),e.parse()}lo();
//# sourceMappingURL=index.js.map