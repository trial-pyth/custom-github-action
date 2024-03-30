#!/user/bin/env node
import{Command as co}from"commander";import{existsSync as X}from"fs";import{Command as oo}from"commander";import eo from"path";import to from"prompts";import{z as f}from"zod";import u from"chalk";var e={error(...o){console.log(u.red(...o))},warn(...o){console.log(u.yellow(...o))},info(...o){console.log(u.cyan(...o))},success(...o){console.log(u.green(...o))},break(){console.log("")}};import ro from"chalk";import{execa as O}from"execa";function y(o){typeof o=="string"&&(e.error(o),process.exit(1)),o instanceof Error&&(e.error(o.message),process.exit(1)),e.error("Something went wrong. Please try again."),process.exit(1)}import Y from"prompts";var G=["@octokit/core","@actions/core","@actions/github","jest","axios","node-fetch"];async function T(){let o=G.map(i=>({title:i,value:i,selected:!1}));return(await Y({type:"multiselect",name:"components",message:"Which packages would you like to add?",hint:"Space to select. A to toggle all. Enter to submit.",instructions:!1,choices:o})).components}import S from"chalk";import V from"prompts";import W from"ora";import H from"path";import{existsSync as K,promises as A}from"fs";async function p(o){K(o)?(await A.readdir(o)).length>0&&(e.error(`Target directory ${o} is not empty. Please try again.`),process.exit(1)):await A.mkdir(o)}import{detect as z}from"@antfu/ni";async function E(o){let t=await z({programmatic:!0,cwd:o});return t==="yarn@berry"?"yarn":t==="pnpm@6"?"pnpm":t==="bun"?"bun":t??"npm"}import{promises as l}from"fs";import d from"path";var m=`# Node.js and npm
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
`,P=o=>`name: ${o}
description: ${o}
    
runs:
  using: 'node16'
  main: 'dist/index.js'`,C=`{
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
  }`,x=o=>`{
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
  }`,I=o=>`{
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
    -`,j=`FROM alpine:latest

ENTRYPOINT ['/entrypoint.sh']`,_=o=>`name: '${o}'
description: '${o}'

runs:
  using: "composite"
  steps:
    - name: Set Greeting
      run: echo "Hello custom github action"
      shell: bash
      env:`;async function b(o,t,i){try{await l.writeFile(d.join(t,".gitignore"),m);let r=P(i),s=d.join(t,"action.yaml");await l.writeFile(s,r),e.info("action.yaml file created successfully.");let n=d.join(t,"src");await l.mkdir(n,{recursive:!0});let c='console.log("Hello custom github action");',a=d.join(t,"src",`${i}.${o?"ts":"js"}`);await l.writeFile(a,c),e.info(`src/${i}.${o?"ts":"js"} file created successfully.`);let g=o?I(i):x(i),N=d.join(t,"package.json");if(await l.writeFile(N,g),e.info("package.json file created successfully."),o){let J=d.join(t,"tsconfig.json");await l.writeFile(J,C),e.info("tsconfig.json file created successfully.")}}catch(r){e.error("Error writing files:",r)}}async function M(o,t,i){let r=await T();if(e.info(`Selected Packages: ${S.green(r)}`),!o.yes){let{proceed:a}=await V({type:"confirm",name:"proceed",message:"Ready to install components and dependencies. Proceed?",initial:!0});a||process.exit(0)}let s=W("Preparing action...").start(),n=H.join(o.cwd||process.cwd(),t.action_name);await p(n);let c=await E(i);process.chdir(n),await b(t.typescript,n,t.action_name);try{await O(c,["update"],{cwd:n}),e.info("Updated packages")}catch(a){y(a)}if(r)for(let a of r){s.text=`Installing ${a}...`;try{await O(c,[c==="npm"?"install":"add",a])}catch(g){y(g)}}s.succeed("Done."),e.info(""),e.info(`${S.green("Success!")} Project initialization completed. You may now modify your action`),e.info("")}import B from"ora";import"prompts";import U from"path";import{promises as w}from"fs";import h from"path";async function $(o,t){try{await w.writeFile(h.join(o,".gitignore"),m);let i=v(t),r=h.join(o,"action.yaml");await w.writeFile(r,i),e.info("action.yaml file created successfully.");let s=j,n=h.join(o,"Dockerfile");await w.writeFile(n,s),e.info("Dockerfile created successfully.")}catch(i){e.error("Error writing Dockerfile",i)}}import Z from"chalk";async function D(o,t){let i=B("Preparing action...").start(),r=U.join(o.cwd||process.cwd(),t.action_name);await p(r),process.chdir(r),await $(r,t.action_name),i.succeed("Done."),e.info(""),e.info(`${Z.green("Success!")} Project initialization completed. You may now modify your action`),e.info("")}import"prompts";import q from"ora";import k from"path";import{promises as F}from"fs";import Q from"chalk";async function R(o,t){let i=q("Preparing action...").start(),r=k.join(o.cwd||process.cwd(),t.action_name);await p(r),process.chdir(r);try{await F.writeFile(k.join(r,".gitignore"),m);let s=_(t.action_name),n=k.join(r,"action.yaml");await F.writeFile(n,s),e.info("Composite action.yaml file created successfully.")}catch(s){e.error("Error writing Dockerfile",s)}i.succeed("Done."),e.info(""),e.info(`${Q.green("Success!")} Project initialization completed. You may now modify your action`),e.info("")}var io=f.object({cwd:f.string(),yes:f.boolean(),name:f.optional(f.string())}),no=[{name:"javascript",label:"JavaScript"},{name:"docker",label:"Docker"},{name:"composite",label:"Composite"}],L=new oo().name("init").description("initialize your project and install dependencies").option("-y, --yes","skip confirmation prompt.",!1).option("-c, --cwd <cwd>","the working directory. defaults to the current directory.",process.cwd()).option("-n, --name <name>","the name of the github action.","").action(async o=>{try{let t=io.parse(o),i=eo.resolve(t.cwd);X(i)||(e.error(`The path ${i} does not exist. Please try again.`),process.exit(1));let r=await so(i),s=r.custom_action==="javascript",n=r.custom_action==="docker",c=r.custom_action==="composite";s&&M(t,r,i),n&&D(t,r),c&&R(t,r)}catch(t){console.log(t)}});async function so(o,t=!1){let i=n=>ro.cyan(n),r=n=>/^[a-zA-Z0-9_-]+$/.test(n)?!0:(console.log("Invalid name. The name must not contain special characters or spaces, except for underscores and hyphens."),!1);return await to([{type:"text",name:"action_name",message:"What is the name of your action? ",validate:n=>r(n)},{type:"select",name:"custom_action",message:`Which ${i("custom action")} would you like to use?`,choices:no.map(n=>({title:n.label,value:n.name}))},{type:n=>n==="javascript"?"toggle":null,name:"typescript",message:`Would you like to use ${i("TypeScript")} (recommended)?`,initial:!0,active:"yes",inactive:"no"}])}process.on("SIGINT",()=>process.exit(0));process.on("SIGTERM",()=>process.exit(0));async function ao(){let o=new co().name("custom-gh-action").description("create custom github action").version("1.0.0","-v, --version","display the version number");o.addCommand(L),o.parse()}ao();
//# sourceMappingURL=index.js.map