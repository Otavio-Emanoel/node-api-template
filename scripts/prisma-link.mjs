import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const nodeModules = path.join(projectRoot, 'node_modules');

const source = path.join(nodeModules, '.prisma');
const destination = path.join(nodeModules, '@prisma', 'client', '.prisma');

async function pathExists(filePath) {
  try {
    await fs.lstat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  const entries = await fs.readdir(from, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(from, entry.name);
      const dstPath = path.join(to, entry.name);

      if (entry.isDirectory()) return copyDir(srcPath, dstPath);
      if (entry.isSymbolicLink()) {
        const linkTarget = await fs.readlink(srcPath);
        return fs.symlink(linkTarget, dstPath);
      }
      return fs.copyFile(srcPath, dstPath);
    }),
  );
}

if (!(await pathExists(source))) {
  console.error(`Prisma link: diretório não encontrado: ${source}`);
  process.exit(1);
}

if (await pathExists(destination)) {
  process.exit(0);
}

await fs.mkdir(path.dirname(destination), { recursive: true });

try {
  // Relative target from node_modules/@prisma/client -> node_modules/.prisma
  const relativeTarget = path.relative(path.dirname(destination), source);
  await fs.symlink(relativeTarget, destination);
} catch {
  // Fallback para ambientes sem suporte a symlink
  await copyDir(source, destination);
}
