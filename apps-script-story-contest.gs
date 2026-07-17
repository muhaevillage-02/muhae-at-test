// ============================================================
//  LOG.in — 2026 대학생 도전 스토리 공모전 신청서
//  시트명: 도전 스토리 (레벨업 신청서와 같은 스프레드시트 내 별도 탭)
// ============================================================
//
//  [배포 방법 — 레벨업과는 별도의 새 Apps Script 프로젝트로 배포]
//  1. 아래 SPREADSHEET_ID가 가리키는 스프레드시트를 엽니다.
//     https://docs.google.com/spreadsheets/d/1054PSBS0-wxBPydMqiykXk6IUjrCmh5QqPxbf9vzaTU/edit
//  2. script.google.com → 새 프로젝트 → Code.gs에 이 파일 전체 붙여넣기
//     (SPREADSHEET_ID는 이미 입력되어 있어 수정 불필요)
//  3. 배포 > 새 배포 > 웹앱
//     실행 계정: 나 / 액세스: 모든 사용자(익명 포함)
//  4. 웹앱 URL 복사 → story-contest.html 의 GAS_URL 변수에 붙여넣기
//     (레벨업 신청서용 웹앱 URL과는 별개의 새 URL이 발급됩니다)
// ============================================================

var SPREADSHEET_ID = '1054PSBS0-wxBPydMqiykXk6IUjrCmh5QqPxbf9vzaTU';
var SHEET_NAME     = '도전 스토리';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      var headers = [
        '제출 일시',
        '이름', '만 나이', '신분',
        '거주지 (시/도)', '거주지 상세', '전화번호', '이메일',
        '도전 분야',
        '도전 스토리',
        '개인정보 동의',
        'User-Agent', '타임스탬프'
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
           .setFontWeight('bold')
           .setBackground('#3FA9E0')
           .setFontColor('#0B1440');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 150);
      sheet.setColumnWidth(10, 320);
    }

    sheet.appendRow([
      new Date(),
      data.name             || '',
      data.age              || '',
      data.student_status   || '',
      data.region           || '',
      data.residence_detail || '',
      data.phone            || '',
      data.email            || '',
      data.story_category   || '',
      data.story            || '',
      data.agree_privacy ? 'O' : 'X',
      data.userAgent        || '',
      data.timestamp        || ''
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

function doGet() {
  return ContentService
    .createTextOutput('LOG.in 도전 스토리 공모전 신청서 엔드포인트 정상 동작 중.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function testConnection() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  Logger.log('연결 성공: ' + sheet.getName() + ' / 현재 행 수: ' + sheet.getLastRow());
}
