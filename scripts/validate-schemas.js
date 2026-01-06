const fs = require('node:fs');
const path = require('node:path');
const Ajv2020 = require('ajv/dist/2020');

const schemaDir = path.resolve(__dirname, '../schemas');
const files = fs.readdirSync(schemaDir).filter((name) => name.endsWith('.json'));

const Ajv = Ajv2020 || Ajv2020.default;
const ajv = new Ajv({ strict: false });
for (const file of files) {
  const schemaPath = path.resolve(schemaDir, file);
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  ajv.compile(JSON.parse(schemaContent));
  console.log(`Validated ${file}`);
}
