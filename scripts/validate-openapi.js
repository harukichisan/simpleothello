const fs = require('node:fs');
const path = require('node:path');
const YAML = require('yaml');

const openapiPath = path.resolve(__dirname, '../api/openapi.yaml');
const raw = fs.readFileSync(openapiPath, 'utf8');
const document = YAML.parse(raw);

if (!document || typeof document !== 'object' || !document.openapi) {
  throw new Error('The OpenAPI document is missing the required `openapi` field.');
}

console.log(`OpenAPI ${document.openapi} parsed successfully.`);
