# nonce community 홈페이지

논스 커뮤니티(nonce.community) 공식 사이트. 빌드 도구 없는 순수 HTML/CSS/JS 정적 사이트이고, Vercel이 `main` 브랜치를 자동 배포한다.
이 저장소가 원본이다. claude.ai의 디자인 캔버스("Nonce 메인 페이지")는 초기 시안일 뿐, 이후 수정은 여기서만 한다.

## 미리보기
```
python3 -m http.server 8000     # → http://localhost:8000
```
수정 후에는 반드시 세 폭(1440 · 768 · 375)에서 확인한다. 가로 스크롤이 생기면 안 된다.

## 주소
- `vercel.json`의 `cleanUrls`로 주소에 `.html`을 붙이지 않고, `trailingSlash: false`로 끝의 `/`도 붙이지 않는다: `/genesis`, `/apply`, `/heterotopia-2027`, `/basecamp`. 예전 `/genesis.html`, `/basecamp/` 주소는 Vercel이 새 주소로 넘긴다.
- 모집 페이지의 예전 주소 `/herotopia`(철자 오류, 단톡방 등에 이미 공유됨)는 `vercel.json`의 `redirects`로 `/heterotopia-2027`로 영구 리디렉트한다. 이 규칙은 지우지 않는다. `/heterotopia`는 3호점 소개 페이지(`heterotopia.html`)라 모집 페이지와 다르다.
- 페이지끼리 링크는 `/genesis`처럼 루트 기준으로 쓰고, 메인은 `/`. canonical·og:url·`sitemap.xml`도 같은 주소를 쓴다.
- `python3 -m http.server`는 `.html` 없는 주소를 모르므로 로컬에서 링크를 누르면 404가 난다. 로컬에서는 `/genesis.html`처럼 파일 이름으로 열거나 Vercel 미리보기로 확인한다.

## 구조
| 파일 | 내용 |
|---|---|
| `index.html` | 메인 (검은 배경): 히어로 헥스 덤프 → 어원 → 숫자 → 베이스캠프 지도·호점 카드 → 지원 안내 |
| `genesis.html` `lighthouse.html` `heterotopia.html` `sapiens.html` `immersion.html` `ohora.html` | 호점 상세 (메인과 같은 어두운 톤, 같은 구조) |
| `apply.html` | 헤테로토피아 입주 지원서 (구글 폼으로 제출) |
| `css/site.css` | 모든 페이지 공통 스타일. 섹션별로 DARK / HOUSE / APPLY 구역이 나뉨 |
| `js/main.js` | 히어로 헥스 덤프 생성, nonce 카운터, 모바일 메뉴 |
| `js/apply.js` | 지원서 검증과 구글 폼 제출 |
| `heterotopia-2027/` | 헤테로토피아 창업가 하우스 2027 입주자 모집 페이지(nonce.community/heterotopia-2027). 따로 받은 완성본을 그대로 올린 독립 페이지라 사이트 공통 CSS·JS를 쓰지 않는다. 이미지·영상·글꼴은 `/heterotopia-2027/img/…`처럼 절대 경로로 쓴다(주소 끝에 `/`가 없어도 깨지지 않게) |
| `basecamp/` | 데스커 베이스캠프 with nonce 27년 멤버 모집 페이지(nonce.community/basecamp/). `heterotopia-2027/`와 같은 방식의 독립 페이지(경로도 `/basecamp/img/…` 절대 경로) |
| `apply-receiver.gs` | 예전 베이스캠프 지원서용 Apps Script (지금은 쓰지 않음) |
| `img/` | 이미지. 건물 일러스트는 WebP, 사진은 1600px 이하 JPG |
| `img/map/` | 메인 베이스캠프 지도: 스케치(`base.jpg`), 깃발(`flag.png`), 호점별 윤곽선 SVG. nonce.foundation/about-nonce 지도와 같은 원본·위치를 쓴다. 마우스를 올리면 깃발·윤곽선 대신 `img/<호점>/building.webp`와 이름이 뜨고, 누르면 호점 페이지로 간다. 폭 767px 이하 폰에서는 컬러 건물과 이름이 그려진 `mobile.jpg` 한 장만 보여 준다(깃발 레이어 없음) |

## 반응형 규칙
- 데스크톱 ≥1024px: 1440 기준 시안. `clamp()`로 유동적으로 줄어든다.
- 태블릿 768–1023px: `@media (min-width: 768px) and (max-width: 1023px)` 에서 고정값으로 덮어쓴다.
- 모바일 ≤767px: `@media (max-width: 767px)`.
- 좌우 여백은 `--side` / `--pad-x` 변수 (데스크톱 1200px 본문 폭 기준, 태블릿 40px, 모바일 20px).
- 크기를 바꿀 때는 세 구간을 모두 손본다. 한 구간만 고치면 다른 화면에서 어긋난다.

## 디자인 토큰
- 모든 페이지(메인·호점·지원서) 같은 어두운 테마: 배경 `#000`, 본문 `#f2f2f2`, 보조 `#a6a6a6`, 선 `#1f1f1f`/`#3a3a3a`
- 호점 페이지는 `body.dark.house`. 회사 로고는 흰색으로 반전해서 보여 준다(`filter: brightness(0) invert(1)`)
- 글꼴: 로고·히어로와 한글 제목·큰 숫자는 `Noto Serif KR` 600(`--serif-kr`, 로고와 같은 글꼴), 본문·레이블 한글은 `Asta Sans`(nonce.foundation과 같은 글꼴, `--sans`), 영문 어원 `EB Garamond`, 레이블 `IBM Plex Mono`(한글은 Asta Sans로 대체)
- 로고는 텍스트 "nonce" (Noto Serif KR 600). 이미지 로고 없음.

## 표기 규칙
- 이름은 항상 소문자 "nonce" / "nonce community" (호점 이름도 "nonce Genesis"처럼). 대문자 레이블(NONCE COMMUNITY)은 예외. "nonce foundation"은 쓰지 않는다.
- 연락처: hello@nonce.community, 서울특별시 강남구 봉은사로 22길 45-9
- 호점 표기: 제네시스(1호점) · 라이트하우스(2호점) · 헤테로토피아(3호점) · 사피엔스(前 4호점) · 이머전하우스(現 4호점) · 오호라(5호점). "이머젼"이 아니라 "이머전".
- 메인 숫자: 2018(제네시스 1호점 오픈 2018년 9월) · 850+ 멤버 · 149개 기업 · 9년. 숫자 위 16진수 표기(0x07E2 등)도 함께 바꾼다.
- 한국어 줄바꿈은 `word-break: keep-all` 유지.

## 지원서
- `/apply`는 **헤테로토피아(3호점) 2027 입주 지원서**다. 2026.11.11(수) 자정 마감. 모집 페이지 `/heterotopia-2027`의 지원 버튼도 여기로 온다.
- 제출은 헤테로토피아 구글 폼(「2027년 논스 창업가 하우스 지원」)의 `formResponse`로 바로 보낸다(`apply.html`의 `data-endpoint`). 그래서 홈페이지 지원도 구글 폼으로 직접 낸 지원과 같은 응답·시트에 쌓인다. Apps Script(`apply-receiver.gs`)는 지금 쓰지 않는다.
- 질문은 구글 폼과 똑같이 맞춘다. 필드 → `entry.…` 번호는 `js/apply.js`의 `ENTRY`. 구글 폼 질문을 바꾸거나 추가하면 폼의 공개 페이지(`viewform`) 소스의 `FB_PUBLIC_LOAD_DATA_`에서 새 번호를 찾아 함께 고친다. 번호가 틀리면 구글이 제출을 거부하지만, 응답을 읽을 수 없는 방식(no-cors)이라 사이트에서는 성공으로 보이니 바꾼 뒤에는 응답 탭에서 직접 확인한다.
- 생년월일은 `2001.09.01`, 연락처는 숫자만(`01012345678`)으로 바꿔 보낸다. 첫 질문은 공백 제외 500자 이상이어야 제출된다. 룸 타입은 1순위·2순위(구글 폼의 그리드 두 행). 개인정보 동의 문구도 구글 폼과 같다(보유 기간 1년).
- 확인 메일은 보내지 않는다. 제출 후 "결과는 이메일로 안내" 문구만 뜬다.
- 마감 후 닫을 때: form 앞에 `.closed` 안내 블록(`<section class="closed">`, 스타일은 `site.css` APPLY 구역에 있음)을 넣고 form에 `hidden`을 건다. 구글 폼도 응답 받기를 끈다.

## 남은 일
- [x] Vercel에서 nonce.community 도메인 소유 확인(TXT `_vercel`) 및 DNS 연결 — DNS는 후이즈 기본 네임서버에서 관리, www는 nonce.community로 308 리디렉트

## 작업 방식
- 큰 변경은 브랜치에서 하고 푸시하면 Vercel이 미리보기 주소를 만든다. 확인 후 `main`에 합친다.
- 이미지를 추가할 때는 너비 1600px 이하로 줄이고 `width`/`height` 속성을 넣는다(레이아웃 흔들림 방지).
