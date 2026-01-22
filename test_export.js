import { createWriteStream, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const outputFileName = 'TerminalStack_v1.aoscap.zip';
const outputPath = resolve(process.cwd(), outputFileName);
const output = createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

const filesToInclude = [
  'index.js',
  'package.json',
  'averyos.config',
  'terminallive.config',
  'README.md',
  'deploy.sh',
  'install.sh'
];

output.on('close', () => {
  const sizeInMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
  console.log(`✓ Capsule exported successfully!`);
  console.log(`  File: ${outputFileName}`);
  console.log(`  Size: ${sizeInMB} MB`);
  console.log(`  Location: ${outputPath}`);
  console.log('\nCapsule Contents:');
  filesToInclude.forEach(file => {
    console.log(`  ✓ ${file}`);
  });
});

output.on('error', (err) => {
  console.error(`Error creating output file: ${err.message}\n`);
});

archive.on('error', (err) => {
  console.error(`Error creating archive: ${err.message}\n`);
});

archive.pipe(output);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
filesToInclude.forEach(file => {
  const filePath = join(__dirname, file);
  if (existsSync(filePath)) {
    archive.file(filePath, { name: file });
    console.log(`Adding: ${file}`);
  } else {
    console.warn(`Warning: File not found: ${file}`);
  }
});

archive.finalize();
