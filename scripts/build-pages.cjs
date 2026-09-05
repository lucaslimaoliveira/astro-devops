// No dependencies or bundler: publish only this explicit list of static files.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '_site');
const files = [
  'index.html', 'styles.css', 'app.js', '.nojekyll',
  'assets/astro-logo.svg',
  'kubernetes/README.md', 'kubernetes/kind-config.yaml',
  'kubernetes/deployment-v1.yaml', 'kubernetes/deployment-v2.yaml',
  'kubernetes/service.yaml', 'kubernetes/broken-deployment.yaml'
];

for (const file of files) {
  const stat = fs.lstatSync(path.join(root, file));
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Arquivo inválido: ${file}`);
}

// Never clean a directory supplied by a caller or follow an output symlink.
if (fs.existsSync(output)) {
  if (fs.lstatSync(output).isSymbolicLink() || fs.realpathSync(output) !== output) {
    throw new Error('O diretório _site precisa ser uma pasta local do projeto.');
  }
  fs.rmSync(output, { recursive: true });
}
fs.mkdirSync(output);
let bytes = 0;
for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
  bytes += fs.statSync(destination).size;
}
console.log(`Pages preparado: ${files.length} arquivos, ${(bytes / 1024).toFixed(1)} KiB em _site/.`);
