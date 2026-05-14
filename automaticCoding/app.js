/*
매일 아침 6시 10분에 실행하는 함수
*/

import schedule from 'node-schedule'; // 스케쥴에 맞춰 실행시키는 모듈
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapTime = `0 10 5 * * *`;// 매일 5시 10분에 발동

console.log('스케쥴서버 작동 중..');
schedule.scheduleJob(sitemapTime, async () => {
  console.log(`[${new Date().toLocaleString()}] 예약된 작업 시작.`);
  await makeNewMarkdownFile();
  await ensureYearArchivePage();
})

async function makeNewMarkdownFile(){
  try {
    await exec('node ./오늘기록추가.js');
  } catch (error) {
    console.error('스크립트 실행 x', error.message);
  }
}

// 연도 아카이브 페이지 자동 생성 (새해 첫 실행 시 YYYY.html 생성)
async function ensureYearArchivePage() {
  const year = new Date().getFullYear().toString();
  const filePath = path.join(__dirname, '..', `${year}.html`);
  try {
    await fs.access(filePath);
  } catch {
    const content = `---\nlayout: year-archive\ntitle: ${year}년 기록\npermalink: /${year}/\nyear: "${year}"\n---\n`;
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`연도 아카이브 생성: ${filePath}`);
  }
}