import { copyFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';

const locations = ['.', 'apps/api', 'apps/web'];
for (const location of locations) {
  const prefix = location === '.' ? '' : `${location}/`;
  const source = new URL(`../${prefix}.env.example`, import.meta.url);
  const target = new URL(`../${prefix}.env`, import.meta.url);
  try {
    await copyFile(source, target, constants.COPYFILE_EXCL);
    console.info(`Created ${prefix}.env`);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    console.info(`Kept existing ${fileURLToPath(target)}`);
  }
}
