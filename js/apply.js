// nonce community — heterotopia application form
// Submissions go straight into the heterotopia Google Form (form's data-endpoint = …/formResponse),
// so they land in the same responses sheet as people who apply on the Google Form itself.
// The ENTRY ids below must match that form's questions; if a question changes there, update them here.
(function () {
  var form = document.getElementById('apply');
  if (!form) return;
  var err = document.getElementById('err');
  var btn = document.getElementById('submit');
  var ok = document.getElementById('ok');
  var count = document.getElementById('life-count');
  var LIFE_MIN = 500; // characters, spaces not counted
  var LABELS = {
    name: '이름', birth: '생년월일', phone: '연락처', email: '이메일', room1: '룸 타입 1순위', room2: '룸 타입 2순위',
    life: '살아온 이야기', mission: '풀고 있는 문제', talent: '재능 · 전문성', share: '나눌 것과 얻을 것', agree: '개인정보 동의'
  };
  var ENTRY = {
    name: 'entry.1059875225', birth: 'entry.1059130401', phone: 'entry.822634119', email: 'entry.1417951816',
    room1: 'entry.1355766332', room2: 'entry.1575974623',
    life: 'entry.122220874', mission: 'entry.618810163', talent: 'entry.1401797390', share: 'entry.1158679335',
    links: 'entry.1466728908', agree: 'entry.1511681190'
  };
  var REQUIRED = Object.keys(LABELS);
  var GROUPS = ['room1', 'room2'];
  var tried = false;

  // birthdate is typed by hand: accept 20010901, 2001.9.1, 2001-09-01 … and send 2001.09.01 like the Google Form asks
  function normBirth(v) {
    var p = String(v || '').split(/\D+/).filter(Boolean);
    if (p.length === 1 && p[0].length === 8) p = [p[0].slice(0, 4), p[0].slice(4, 6), p[0].slice(6)];
    if (p.length !== 3 || p[0].length !== 4) return '';
    var y = +p[0], m = +p[1], day = +p[2], dt = new Date(y, m - 1, day);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== day || y < 1900 || dt > new Date()) return '';
    return y + '.' + ('0' + m).slice(-2) + '.' + ('0' + day).slice(-2);
  }
  // phone goes in as digits only (01012345678)
  function normPhone(v) {
    var n = String(v || '').replace(/\D/g, '');
    return /^0\d{8,10}$/.test(n) ? n : '';
  }
  function len(v) { return String(v || '').replace(/\s/g, '').length; }

  function data() {
    var fd = new FormData(form), d = {};
    fd.forEach(function (v, k) { d[k] = typeof v === 'string' ? v.trim() : v; });
    d.agree = form.elements.agree.checked;
    d.birth = normBirth(d.birth);
    d.phone = normPhone(d.phone);
    return d;
  }
  function missing(d) {
    return REQUIRED.filter(function (k) {
      if (k === 'agree') return !d.agree;
      if (k === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || '');
      if (k === 'life') return len(d.life) < LIFE_MIN;
      return !d[k];
    });
  }
  function paint(miss) {
    REQUIRED.forEach(function (k) {
      if (GROUPS.indexOf(k) >= 0) { document.getElementById(k).classList.toggle('bad', miss.indexOf(k) >= 0); return; }
      var el = form.elements[k];
      if (el && el.setAttribute) el.setAttribute('aria-invalid', miss.indexOf(k) >= 0 ? 'true' : 'false');
    });
  }
  function showErr(msg) { err.textContent = msg; err.hidden = !msg; }
  function updateCount() {
    var n = len(form.elements.life.value);
    count.textContent = n + ' / ' + LIFE_MIN + '자';
    count.classList.toggle('short', tried && n < LIFE_MIN);
  }

  form.elements.birth.addEventListener('blur', function () { var b = normBirth(this.value); if (b) this.value = b; });
  form.elements.life.addEventListener('input', updateCount);
  form.addEventListener('input', function () { if (tried) { var m = missing(data()); paint(m); if (!m.length) showErr(''); } });
  form.addEventListener('change', function () { if (tried) paint(missing(data())); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    tried = true;
    updateCount();
    var d = data(), m = missing(d);
    paint(m);
    if (m.length) {
      showErr('필수 항목 ' + m.length + '개를 확인해 주세요: ' + m.map(function (k) {
        return k === 'life' ? LABELS[k] + '(공백 제외 ' + LIFE_MIN + '자 이상)' : LABELS[k];
      }).join(', '));
      var first = GROUPS.indexOf(m[0]) >= 0 ? form.querySelector('input[name=' + m[0] + ']') : form.elements[m[0]];
      if (first && first.focus) first.focus();
      return;
    }
    showErr(''); ok.hidden = true;
    var done = function () { form.reset(); tried = false; paint([]); updateCount(); ok.hidden = false; ok.scrollIntoView({ block: 'center' }); };
    if (d.website) { done(); return; } // honeypot filled: a bot, pretend it went through

    var body = new URLSearchParams();
    Object.keys(ENTRY).forEach(function (k) {
      if (k === 'agree') body.append(ENTRY[k], '동의합니다.');
      else if (d[k]) body.append(ENTRY[k], d[k]);
    });
    body.append('pageHistory', '0,1,2,3'); // the Google Form has four pages; all were "visited"

    btn.disabled = true; btn.textContent = '제출하는 중…';
    // Google Forms sends no CORS headers, so the response is opaque: a resolved fetch means it was delivered
    fetch(form.getAttribute('data-endpoint'), { method: 'POST', mode: 'no-cors', body: body })
      .then(done)
      .catch(function () {
        showErr('제출하지 못했습니다. 잠시 후 다시 시도하거나 hello@nonce.community로 보내 주세요.');
      })
      .then(function () { btn.disabled = false; btn.textContent = '지원서 제출'; });
  });
})();
