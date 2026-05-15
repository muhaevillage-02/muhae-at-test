# 무해한 마을 — 20대 진로 유형 테스트

업로드한 `muhae_at_test.html` 을 기반으로 만든 사이트입니다.
설문 응답은 **Google Apps Script** 를 통해 **Google Sheets** 에 자동 저장됩니다.

## 📁 폴더 구성

```
muhae_at_test/
├── index.html        ← 사이트 본체 (원본 HTML + 시트 전송 코드 추가)
├── apps-script.gs    ← Google Apps Script (백엔드)
├── package.json      ← Railway 배포용
├── railway.json      ← Railway 빌드/실행 설정
├── .gitignore
└── README.md         ← 이 파일
```

---

## 🟢 1단계 — Google Sheet 만들기

1. <https://sheets.new> 에서 새 구글 시트 생성
2. 시트 이름은 자유 (예: `진로테스트 응답`)
3. 주소창에서 시트 ID 복사
   - 예: `https://docs.google.com/spreadsheets/d/`**`1AbCdEfG...`**`/edit`
   - 굵게 표시된 부분이 ID

---

## 🟢 2단계 — Apps Script 배포

1. <https://script.google.com> 접속 → **새 프로젝트** 생성
2. 기본 `Code.gs` 내용을 모두 지우고 `apps-script.gs` 내용을 붙여넣기
3. 최상단의 `SPREADSHEET_ID` 값에 1단계에서 복사한 시트 ID 를 붙여넣기
   ```js
   var SPREADSHEET_ID = '1AbCdEfG...';  // ← 실제 ID
   ```
4. 저장 (Ctrl+S / Cmd+S)
5. **배포 > 새 배포** 클릭
   - 톱니바퀴(설정) > **웹 앱** 선택
   - 설명: `진로테스트 응답수집`
   - 실행 계정: **나 (Muhaevillage@gmail.com)**
   - 액세스 권한: **모든 사용자 (익명 포함)**
6. **배포** → 권한 승인 (Google 계정 선택 후 "고급" → "안전하지 않음으로 이동" → 허용)
7. **웹 앱 URL** 복사 (`https://script.google.com/macros/s/AKfyc.../exec`)

> 💡 권한 승인 시 "확인되지 않은 앱" 경고가 떠도 정상입니다. 본인이 만든 스크립트이기 때문에 안전하게 허용해도 됩니다.

---

## 🟢 3단계 — HTML 에 URL 연결

`index.html` 을 열어서 700번째 줄 근처의 다음 부분을 찾아 수정합니다:

```js
var APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEBAPP_URL_HERE';
```

→ 2단계에서 복사한 웹 앱 URL 로 교체:

```js
var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfyc.../exec';
```

이제 폼을 제출하면 시트의 다음 컬럼에 자동 기록됩니다:

| 제출 일시 | Q1~Q6 | 최종 결과 유형 | 성함 | 나이 | 연락처 | 거주지역 | 직업상태 | 고민 | 동의 | User-Agent | 타임스탬프 |
|---|---|---|---|---|---|---|---|---|---|---|---|

---

## 🟢 4단계 — GitHub 에 푸시

### A. 새 저장소 만들기
1. <https://github.com/new> 에서 새 저장소 생성
   - 이름 예시: `muhae-at-test`
   - **Initialize 옵션은 모두 꺼두기**

### B. 로컬에서 푸시
이 폴더(`muhae_at_test`)에서 터미널을 열고:

```bash
cd "muhae_at_test 폴더 경로"

git init
git add .
git commit -m "Initial commit: 20대 진로 유형 테스트"
git branch -M main
git remote add origin https://github.com/<YOUR_ID>/muhae-at-test.git
git push -u origin main
```

> 인증 시 비밀번호 대신 **Personal Access Token** 사용
> (<https://github.com/settings/tokens> 에서 발급)

---

## 🟢 5단계 — Railway 에 배포

1. <https://railway.com> 접속 → 로그인 (GitHub 계정 연동 권장)
2. **New Project** → **Deploy from GitHub repo** 선택
3. 방금 푸시한 `muhae-at-test` 저장소 선택
4. Railway 가 `package.json` 을 자동 감지 → `npm install` 후 `npm start` 실행
5. 빌드가 끝나면 **Settings → Networking → Generate Domain** 클릭
6. 생성된 `https://muhae-at-test-production.up.railway.app` 같은 URL 로 접속

### 변경 사항 반영
GitHub `main` 브랜치에 푸시할 때마다 Railway 가 **자동 재배포**합니다.

```bash
git add .
git commit -m "수정 내용"
git push
```

---

## 🟢 (선택) GitHub Pages 무료 호스팅 대안

Railway 가 부담스럽다면 GitHub Pages 만으로도 충분합니다 (정적 사이트라서):

1. GitHub 저장소 → **Settings → Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / `/ (root)` → Save
4. 1~2분 후 `https://<YOUR_ID>.github.io/muhae-at-test/` 접속

---

## 🧪 동작 확인

1. 배포된 사이트 접속
2. 메인 → 테스트 시작 → 6문항 응답 → 폼 작성 → 제출
3. 1단계에서 만든 Google Sheet 에 행이 새로 추가되었는지 확인
4. 시트에 아무것도 안 들어오면 브라우저 개발자도구(F12) → Console 탭에서 빨간 에러 확인
   - 가장 흔한 원인: `APPS_SCRIPT_URL` 오타, Apps Script 액세스 권한이 "모든 사용자" 가 아님

---

## 📌 트러블슈팅

| 증상 | 해결책 |
|---|---|
| 시트에 데이터가 안 들어옴 | Apps Script 배포 시 액세스 권한을 **"모든 사용자(익명 포함)"** 로 했는지 확인 |
| Apps Script 수정 후 반영 안 됨 | 배포 > **새 배포** 로 다시 만들어야 URL 이 갱신됨 (또는 기존 배포 관리에서 "버전: 새 버전" 선택) |
| Railway 빌드 실패 | Logs 확인. `package.json` 의 node 버전이 18+ 인지 확인 |
| 응답이 "선택 안 함" 으로 들어옴 | HTML 의 `selectAnswer` 호출이 정상인지 확인 (라디오 버튼 클릭 후 다음 페이지 이동) |
