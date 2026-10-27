/**
 * 논스 베이스캠프 입주 지원서 → Google 스프레드시트 수신기
 *
 * 설치 방법
 * 1. 스프레드시트 「논스 베이스캠프 입주 지원서 응답」을 엽니다.
 * 2. 확장 프로그램 > Apps Script 를 누르고, 기본 코드를 지운 뒤 이 파일 내용을 붙여넣고 저장합니다.
 * 3. 오른쪽 위 「배포」 > 「새 배포」 > 유형: 웹 앱
 *      - 실행 사용자: 나
 *      - 액세스 권한이 있는 사용자: 모든 사용자
 *    → 「배포」를 누르고 권한을 승인합니다.
 * 4. 나오는 웹 앱 URL(https://script.google.com/macros/s/…/exec)을 복사해 Claude에게 전달합니다.
 *    이 주소가 홈페이지 지원서의 제출 주소가 됩니다.
 *
 * (선택) NOTIFY_EMAIL 에 주소를 넣으면 새 지원서가 들어올 때마다 메일로 알림을 받습니다.
 * 지원자에게는 접수 확인 메일이 자동으로 나갑니다(CONFIRM_APPLICANT). 홈페이지에는 접수 확인 화면이 없습니다.
 */

const SHEET_NAME = '응답';
const NOTIFY_EMAIL = 'hello@nonce.community';   // 알림이 필요 없으면 '' 로 두세요.
const CONFIRM_APPLICANT = true;                 // 지원자에게 접수 확인 메일 보내기
const REPLY_TO = 'hello@nonce.community';       // 지원자가 답장하면 받을 주소

const SPACE_LABEL = { coliving: '코리빙 (헤테로토피아 — 창업가하우스)', coworking: '코워킹 (베이스캠프 — 고정석 · 자율석)' };
const REQUIRED = ['space', 'name', 'birth', 'email', 'phone', 'work', 'life', 'mission', 'talent', 'share', 'agree'];
const LIMIT = 5000;   // 한 칸에 저장할 최대 글자 수

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents || '{}');

    // 스팸 방지용 숨은 칸(사람은 비워 둠)
    if (d.website) return json({ ok: true });

    const missing = REQUIRED.filter(k => k === 'agree' ? d.agree !== true : !String(d[k] || '').trim());
    if (missing.length) return json({ ok: false, error: 'missing', fields: missing });

    const clean = v => {
      let s = String(v || '').slice(0, LIMIT).trim();
      if (/^[=+\-@]/.test(s)) s = "'" + s;      // 수식으로 해석되지 않게
      return s;
    };
    const now = new Date();
    const receipt = 'NONCE 0x' + (now.getTime() >>> 0).toString(16).toUpperCase().padStart(8, '0');

    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    sheet.appendRow([
      now, receipt, SPACE_LABEL[d.space] || clean(d.space), clean(d.when),
      clean(d.name), clean(d.birth), clean(d.email), "'" + clean(d.phone), clean(d.work),
      clean(d.referrer), clean(d.relation),
      clean(d.life), clean(d.mission), clean(d.talent), clean(d.share), clean(d.links),
      '동의', '검토 대기', ''
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL,
        '[논스] 새 입주 지원서 — ' + clean(d.name),
        clean(d.name) + '님이 ' + (SPACE_LABEL[d.space] || '') + ' 입주를 지원했습니다.\n추천인: ' + (clean(d.referrer) || '없음') +
        '\n\n스프레드시트: ' + SpreadsheetApp.getActive().getUrl());
    }
    if (CONFIRM_APPLICANT && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(d.email))) {
      try {
        MailApp.sendEmail({
          to: clean(d.email),
          replyTo: REPLY_TO,
          name: 'nonce community',
          subject: '[논스] 베이스캠프 입주 지원서가 접수되었습니다',
          body: clean(d.name) + '님, 논스 베이스캠프에 지원해 주셔서 고맙습니다.\n\n' +
            '지원 공간: ' + (SPACE_LABEL[d.space] || clean(d.space)) + '\n' +
            '접수 번호: ' + receipt + '\n\n' +
            '검토를 거쳐 입력하신 연락처로 인터뷰 일정을 안내드리겠습니다.\n' +
            '궁금한 점은 이 메일에 답장하거나 hello@nonce.community로 보내 주세요.\n\n' +
            'nonce community'
        });
      } catch (mailErr) {
        // 메일이 실패해도 지원서는 이미 시트에 저장되었으므로 접수는 성공으로 처리한다.
        console.error(mailErr);
      }
    }
    return json({ ok: true, receipt: receipt });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
