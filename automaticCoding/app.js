/* 
매일 아침 6시 10분에 실행하는 함수
*/

import schedule from 'node-schedule'; // 스케쥴에 맞춰 실행시키는 모듈
import { exec } from 'child_process';

const sitemapTime = `0 10 5 * * *`;// 매일 5시 10분에 발동

console.log('스케쥴서버 작동 중..');
schedule.scheduleJob(sitemapTime, async () => {
  console.log(`[${new Date().toLocaleString()}] 예약된 작업 시작.`);
  await makeNewMarkdownFile();
})

async function makeNewMarkdownFile(){
  try {
    // 'node 오늘기록추가.js' 명령어를 실행하고, 완료될 때까지 기다립니다.
    await exec('node ./오늘기록추가.js');
  } catch (error) {
    // exec 명령어 자체의 실행 실패(파일 없음, 권한 문제 등) 시 오류를 출력합니다.
    console.error('스크립트 실행 x', error.message);
  }
}