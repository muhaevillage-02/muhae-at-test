// ============================================================
//  무해한 마을 — 20대 진로 유형 테스트 응답 수집 Apps Script
//  설문 응답을 Google Sheet 에 누적 저장합니다.
// ============================================================
//
//  배포 방법:
//  1. 먼저 새 Google Sheet 를 만들고 URL 에서 ID 를 복사하세요.
//     예) https://docs.google.com/spreadsheets/d/【여기가 ID】/edit
//     아래 SPREADSHEET_ID 자리에 붙여넣기.
//  2. https://script.google.com 에서 새 프로젝트 생성
//  3. 이 파일 전체를 Code.gs 에 붙여넣고 저장
//  4. 상단 메뉴 > 배포 > 새 배포
//     - 유형: 웹 앱
//     - 실행 계정: 나 (Muhaevillage@gmail.com)
//     - 액세스 권한: 모든 사용자 (익명 포함)
//  5. 배포 > 웹 앱 URL 복사
//  6. muhae_at_test.html 의 APPS_SCRIPT_URL 변수에 그 URL 붙여넣기
//
//  ※ 첫 실행 시 권한 승인 요청이 뜨면 모두 허용해주세요.
// ============================================================

var SPREADSHEET_ID = '1u9sSNqD7CW8lFFI2CNVj8DpHSmDLPDozRhvvtGkzv6c';  // 무해한마을 진로테스트 시트
var SHEET_NAME     = '진로테스트응답';                                  // 시트 탭 이름 (없으면 자동 생성)

function doPost(e) {
  try {
    var raw  = e.postData.contents;
    var data = JSON.parse(raw);

    var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);

    // 시트 탭이 없으면 새로 생성
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // 헤더가 비어 있으면 첫 행에 자동 삽입
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '제출 일시',
        'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6',
        '최종 결과 유형',
        '성함', '나이', '연락처', '거주지역', '직업상태', '고민',
        '동의 여부',
        '사용자 디바이스(User-Agent)',
        '제출 시각(타임스탬프)'
      ]);
      // 헤더 행 굵게 + 노란 배경
      sheet.getRange(1, 1, 1, 17)
           .setFontWeight('bold')
           .setBackground('#FFE082');
      sheet.setFrozenRows(1);
    }

    // 데이터 누적 저장
    sheet.appendRow([
      new Date(),
      data.q1 || '', data.q2 || '', data.q3 || '',
      data.q4 || '', data.q5 || '', data.q6 || '',
      data.resultType || '',
      data.name      || '',
      data.age       || '',
      data.phone     || '',
      data.area      || '',
      data.job       || '',
      data.worry     || '',
      data.agreed ? 'O' : 'X',
      data.userAgent || '',
      data.timestamp || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET 요청 처리 — 브라우저에서 URL 만 열어보면 상태 메시지 표시
function doGet() {
  return ContentService
    .createTextOutput('무해한 마을 진로 유형 테스트 응답 수신 엔드포인트가 정상 동작 중입니다.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// 테스트용 함수 (Apps Script 에디터에서 직접 실행해 시트 연결 확인)
function testConnection() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  Logger.log('시트 연결 성공: ' + sheet.getName() + ' / 현재 행 수: ' + sheet.getLastRow());
}
