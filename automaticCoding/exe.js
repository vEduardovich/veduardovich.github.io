const fs = require('fs').promises;
const path = require('path');

// 요일을 영어로 매핑 (파일 이름에 사용)
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

// main.md 파일 읽기 및 처리
async function splitMarkdownFile() {
  try {
    // main.md 파일 읽기
    const filePath = path.join(__dirname, 'main.md');
    const content = await fs.readFile(filePath, 'utf8');

    // 섹션을 나누기 위한 정규 표현식
    // "## MM월 X일(요일)" 형식 매칭 (1월~5월)
    const sectionRegex = /## ([1-5]월) (\d{1,2})일\(([월화수목금토일])\)([\s\S]*?)(?=(## [1-5]월 \d{1,2}일\([월화수목금토일]\)|$))/g;
    const matches = [...content.matchAll(sectionRegex)];

    // _posts 폴더 생성 (없으면)
    const postsDir = path.join(__dirname, '_posts');
    await fs.mkdir(postsDir, { recursive: true });

    // 각 섹션 처리
    for (const match of matches) {
      const month = match[1]; // 월 (예: 1월)
      const day = match[2].padStart(2, '0'); // 날짜를 두 자리로 (예: 1 → 01)
      const weekdayShort = match[3]; // 요일 (월, 화 등)
      const sectionContent = match[4].trim(); // 섹션 내용
      const weekday = dayMap[weekdayShort]; // 전체 요일 이름 (월요일, 화요일 등)
      const monthNum = monthMap[month]; // 월 숫자 (01, 02 등)

      // 파일 이름 생성: 2025-MM-XX-2025년-MM월-XX일-요일.md
      const fileName = `2025-${monthNum}-${day}-2025년-${month}-${day}일-${weekday}.md`;
      const filePath = path.join(postsDir, fileName);

      // 파일 내용 생성
      const fileContent = `---
layout: post
---
${sectionContent}`;

      // 파일 저장
      await fs.writeFile(filePath, fileContent, 'utf8');
      console.log(`Created: ${fileName}`);
    }

    console.log('All files generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 스크립트 실행
splitMarkdownFile();