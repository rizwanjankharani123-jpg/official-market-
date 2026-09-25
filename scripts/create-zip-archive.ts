import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const ROOT_DIR = process.cwd();
const PACKAGE_ROOT = path.join(ROOT_DIR, 'AFFY-OFFICIAL-PACKAGE');
const OUTPUT_ZIP = path.join(ROOT_DIR, 'public', 'AFFY-OFFICIAL-PACKAGE.zip');

async function zipFolder(dir: string, zip: JSZip, rootPath: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    const relPath = path.relative(rootPath, fullPath).replace(/\\/g, '/');
    if (stat.isDirectory()) {
      if (file === 'dist' || file === 'node_modules' || file === '.git') continue;
      await zipFolder(fullPath, zip, rootPath);
    } else {
      const content = fs.readFileSync(fullPath);
      zip.file(relPath, content);
    }
  }
}

async function main() {
  console.log('Generating AFFY-OFFICIAL-PACKAGE.zip archive...');
  const zip = new JSZip();
  await zipFolder(PACKAGE_ROOT, zip, PACKAGE_ROOT);

  const buffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  if (!fs.existsSync(path.dirname(OUTPUT_ZIP))) {
    fs.mkdirSync(path.dirname(OUTPUT_ZIP), { recursive: true });
  }

  fs.writeFileSync(OUTPUT_ZIP, buffer);
  console.log(`Saved package to: ${OUTPUT_ZIP} (${(buffer.length / 1024).toFixed(2)} KB)`);
}

main().catch(err => {
  console.error('Packaging error:', err);
  process.exit(1);
});
