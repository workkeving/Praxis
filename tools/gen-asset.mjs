#!/usr/bin/env node
// Wrapper para generar un asset con Everbot leyendo params desde un JSON file.
// Uso: node gen-asset.mjs <params.json>

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const paramsFile = process.argv[2];
if (!paramsFile) {
  console.error('Usage: node gen-asset.mjs <params.json>');
  process.exit(1);
}

const params = JSON.parse(readFileSync(paramsFile, 'utf-8'));
const everbotDir = 'K:/01. Personal Projects/00. Resources/01. Evergen + everbot/everbot';
const cliPath = resolve(everbotDir, 'skills/api-gemini/cli.ts');

const jsonStr = JSON.stringify(params);
// Escape double quotes for cmd
const escaped = jsonStr.replace(/"/g, '\\"');

const cmd = `npx tsx "${cliPath}" generateImage "${escaped}"`;
console.log('[gen-asset] Calling everbot...');
console.log('[gen-asset] Output:', params.outputPath);

try {
  const result = execSync(cmd, {
    cwd: everbotDir,
    stdio: 'inherit',
    maxBuffer: 50 * 1024 * 1024,
  });
} catch (e) {
  console.error('[gen-asset] Failed:', e.message);
  process.exit(1);
}
