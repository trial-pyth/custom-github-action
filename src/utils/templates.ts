const JAVASCRIPT_JSON_TEMPLATE = `name: JavaScript Action`
const TYPESCRIPT_JSON_TEMPLATE = `{
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
