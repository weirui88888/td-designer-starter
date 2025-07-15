/* eslint-disable no-underscore-dangle */
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 兼容 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, '../dist/index.html');
const html = readFileSync(distPath, 'utf-8');

const commit = execSync('git rev-parse --short HEAD').toString().trim();
const author = execSync('git log -1 --pretty=format:%an').toString().trim();
const date = execSync('git log -1 --pretty=format:%ad --date=iso').toString().trim();
const message = execSync('git log -1 --pretty=format:%B').toString().trim();

const metaTag = `<meta name="git-info" content="commitid:${commit}; author:${author}; date:${date}; message:${message}">`;

const newHtml = html.replace('</head>', `  ${metaTag}\n</head>`);

writeFileSync(distPath, newHtml, 'utf-8');
console.log('Git info injected into dist/index.html');
