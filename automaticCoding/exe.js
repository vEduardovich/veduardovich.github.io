import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname 대체 (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 요일을 한글로 매핑
const dayMap = {
  '월': '월요일',
  '화': '화요일',
  '수': '수요일',
  '목': '목요일',
  '금': '금요일',
  '토': '토요일',
  '일': '일요일'
};

// 월을 두 자리 숫자로 매핑
const monthMap = {
  '1월': '01',
  '2월': '02',
  '3월': '03',
  '4월': '04',
  '5월': '05'
};

// 모든 줄바꿈에 <br/> 추가 (리스트, 헤딩, 빈 줄 제외)
function addLineBreaks(content) {
  const lines = content.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // 빈 줄, 리스트(-, *), 헤딩(#)은 <br/> 추가 제외
    if (line === '' || line.startsWith('-') || line.startsWith('*') || line.startsWith('#')) {
      result.push(line);
      continue;
    }
    
    // 줄바꿈이 있으면 <br/> 추가
    if (i < lines.length - 1) {
      // 다음 줄이 빈 줄, 리스트, 헤딩이 아니면 <br/>
      const nextLine = lines[i + 1]?.trim() || '';
      if (nextLine && !nextLine.startsWith('-') && !nextLine.startsWith('*') && !nextLine.startsWith('#')) {
        result.push(`${line}<br/>`);
      } else {
        result.push(line);
      }
    } else {
      result.push(line); // 마지막 줄은 <br/> 제외
    }
  }
  
  return result.join('\n');
}

// main.md 파일 읽기 및 처리
async function splitMarkdownFile() {
  try {
    // main.md 파일 읽기
    const filePath = path.join(__dirname, 'main.md');
    const content = await fs.readFile(filePath, 'utf8');

    // 섹션을 나누기 위한 정규 표현식
    const sectionRegex = /## ([1-5]월) (\d{1,2})일\(([월화수목금토일])\)([\s\S]*?)(?=(## [1-5]월 \d{1,2}일\([월화수목금토일]\)|$))/g;
    const matches = [...content.matchAll(sectionRegex)];

    // _posts 폴더 생성
    const postsDir = path.join(__dirname, '_posts');
    await fs.mkdir(postsDir, { recursive: true });

    // 각 섹션 처리
    for (const match of matches) {
      const month = match[1]; // 월 (예: 1월)
      const day = match[2].padStart(2, '0'); // 날짜를 두 자리로 (예: 1 → 01)
      const weekdayShort = match[3]; // 요일 (월, 화 등)
      const sectionContent = match[4].trim(); // 섹션 내용
      const weekday = dayMap[weekdayShort]; // 전체 요일 이름
      const monthNum = monthMap[month]; // 월 숫자 (01, 02 등)

      // 파일 이름 생성
      const fileName = `2025-${monthNum}-${day}-2025년-${month}-${day}일-${weekday}.md`;
      // _posts/YYYY/MM/ 서브폴더 경로
      const subDir = path.join(postsDir, '2025', monthNum);
      await fs.mkdir(subDir, { recursive: true });
      const filePath = path.join(subDir, fileName);

      // 섹션 내용에 <br/> 추가
      const processedContent = addLineBreaks(sectionContent);

      // 파일 내용 생성
      const fileContent = `---
layout: post
title: 2025년 ${month} ${day}일 ${weekday}
permalink: /2025/${monthNum}/${day}/
---
${processedContent}`;

      // 파일 저장
      await fs.writeFile(filePath, fileContent, 'utf8');
      console.log(`Created: ${filePath}`);
    }

    console.log('All files generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 스크립트 실행
splitMarkdownFile();