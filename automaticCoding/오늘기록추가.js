import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dayjs from 'dayjs';
import 'dayjs/locale/ko.js';

// __dirname 대체 (ESM에서)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 요일을 한글로 매핑
const dayMap = {
  0: '일요일',
  1: '월요일',
  2: '화요일',
  3: '수요일',
  4: '목요일',
  5: '금요일',
  6: '토요일'
};

// 새 포스트 파일 생성
async function createDailyPost() {
  try {
    // 오늘 날짜 확인
    dayjs.locale('ko');
    const today = dayjs(); // 2025-05-22
    const year = today.format('YYYY'); // 2025
    const month = today.format('M'); // 5 (앞의 0 제거)
    const monthPadded = today.format('MM'); // 05 (폴더명용)
    const day = today.format('DD'); // 22
    const weekday = dayMap[today.day()]; // 목요일

    // 파일 이름: 2025-05-22-2025년-5월-22일-목요일.md
    const fileName = `${year}-${monthPadded}-${day}-${year}년-${month}월-${day}일-${weekday}.md`;

    // 상위 폴더로 이동 후 _posts/2025/05/ 경로 설정
    const postsDir = path.join(__dirname, '..', '_posts', year, monthPadded);
    await fs.mkdir(postsDir, { recursive: true }); // 폴더 없으면 생성

    // 파일 경로
    const filePath = path.join(postsDir, fileName);

    // 파일 내용
    const fileContent = `---
layout: post
title: ${year}년 ${month}월 ${day}일 ${weekday}
permalink: /${year}/${monthPadded}/${day}/
---
####수면 :
* ### 개발
1. 
`;

    // 파일 저장
    await fs.writeFile(filePath, fileContent, 'utf8');
    console.log(`Created: ${filePath}`);

    console.log('Daily post generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 스크립트 실행
createDailyPost();
