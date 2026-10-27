# nonce community — 정적 사이트

빌드 도구 없이 그대로 올리면 되는 정적 사이트입니다.

```
index.html         메인
genesis.html       논스 제네시스 (1호점)
lighthouse.html    논스 라이트하우스 (2호점)
heterotopia.html   논스 헤테로토피아 (3호점)
sapiens.html       논스 사피엔스 (前 4호점)
immersion.html     논스 이머전하우스 (現 4호점)
ohora.html         논스 오호라 (5호점)
apply.html         베이스캠프 입주 지원서
css/site.css       공통 스타일 (데스크톱 ≥1024 · 태블릿 768–1023 · 모바일 ≤767)
js/main.js         히어로 헥스 덤프, nonce 카운터, 모바일 메뉴
js/apply.js        지원서 검증·제출
img/               이미지
apply-receiver.gs  지원서 → Google 스프레드시트 수신 코드 (사이트에는 필요 없음, Apps Script용)
```

## 배포 (Vercel)
1. 이 폴더를 GitHub 저장소에 올립니다.
2. vercel.com → Add New → Project → 저장소 선택 → Framework Preset: Other → Deploy.
3. Project → Settings → Domains 에 `nonce.community` 를 추가하고, 안내되는 DNS 값을 도메인 관리 화면에 넣습니다.

Netlify, GitHub Pages, Cloudflare Pages 도 같은 방식으로 폴더 그대로 배포됩니다.

## 지원서 연결
`apply.html` 의 `<form ... data-endpoint="">` 에 Apps Script 웹 앱 주소(…/exec)를 넣으면
제출된 지원서가 「논스 베이스캠프 입주 지원서 응답」 스프레드시트에 쌓입니다.
주소가 비어 있으면 지원서는 검증까지만 하고 안내 문구를 보여줍니다.
