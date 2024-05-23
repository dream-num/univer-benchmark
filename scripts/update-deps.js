import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));

const dependencies = Object.keys(packageJson.dependencies).filter(dep => dep.startsWith('@univerjs/'));

const updateShell = dependencies.map(dep => `${dep}@nightly`).join(' ');

execSync(`pnpm update ${updateShell}`, { stdio: 'inherit' });