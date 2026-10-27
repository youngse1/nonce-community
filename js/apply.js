// nonce community — basecamp application form
// Submissions go to the Google Apps Script web app set in the form's data-endpoint attribute
// (see apply-receiver.gs). Without an endpoint the form validates but does not send.
(function () {
  var form = document.getElementById('apply');
  if (!form) return;
  var err = document.getElementById('err');
  var btn = document.getElementById('submit');
  var ok = document.getElementById('ok');
  var spaces = document.getElementById('spaces');
  var LABELS = {
    space: '지원 공간', name: '이름', birth: '생년월일', email: '이메일', phone: '연락처', work: '지금 하는 일',
    life: '살아온 이야기', mission: '문제와 사명', talent: '자신만의 재능', share: '나눌 것과 얻을 것', agree: '개인정보 동의'
  };
  var REQUIRED = Object.keys(LABELS);
  var tried = false;

  // birthdate is typed by hand: accept 19950302, 1995.3.2, 1995-03-02 … and send YYYY-MM-DD
  function normBirth(v) {
    var p = String(v || '').split(/\D+/).filter(Boolean);
    if (p.length === 1 && p[0].length === 8) p = [p[0].slice(0, 4), p[0].slice(4, 6), p[0].slice(6)];
    if (p.length !== 3 || p[0].length !== 4) return '';
    var y = +p[0], m = +p[1], day = +p[2], dt = new Date(y, m - 1, day);
    if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== day || y < 1900 || dt > new Date()) return '';
    return y + '-' + ('0' + m).slice(-2) + '-' + ('0' + day).slice(-2);
  }

  function data() {
    var fd = new FormData(form), d = {};
    fd.forEach(function (v, k) { d[k] = typeof v === 'string' ? v.trim() : v; });
    d.agree = form.elements.agree.checked;
    d.birth = normBirth(d.birth);
    return d;
  }
  function missing(d) {
    return REQUIRED.filter(function (k) {
      if (k === 'agree') return !d.agree;
      if (k === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email || '');
      return !d[k];
    });
  }
  function paint(miss) {
    REQUIRED.forEach(function (k) {
      if (k === 'space') { spaces.classList.toggle('bad', miss.indexOf('space') >= 0); return; }
      var el = form.elements[k];
      if (el && el.setAttribute) el.setAttribute('aria-invalid', miss.indexOf(k) >= 0 ? 'true' : 'false');
    });
  }
  function showErr(msg) { err.textContent = msg; err.hidden = !msg; }

  form.elements.birth.addEventListener('blur', function () { var b = normBirth(this.value); if (b) this.value = b.replace(/-/g, '.'); });
  form.addEventListener('input', function () { if (tried) { var m = missing(data()); paint(m); if (!m.length) showErr(''); } });
  form.addEventListener('change', function () { if (tried) paint(missing(data())); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    tried = true;
    var d = data(), m = missing(d);
    paint(m);
    if (m.length) {
      showErr('필수 항목 ' + m.length + '개를 확인해 주세요: ' + m.map(function (k) { return LABELS[k]; }).join(', '));
      var first = m[0] === 'space' ? form.querySelector('input[name=space]') : form.elements[m[0]];
      if (first && first.focus) first.focus();
      return;
    }
    showErr(''); ok.hidden = true;
    var endpoint = form.getAttribute('data-endpoint');
    if (!endpoint) { showErr('지원서 접수 주소가 아직 연결되지 않았습니다. hello@nonce.community로 문의해 주세요.'); return; }
    btn.disabled = true; btn.textContent = '제출하는 중…';
    fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || 'error');
        form.reset(); tried = false; paint([]);
        ok.hidden = false;
      })
      .catch(function () {
        showErr('제출하지 못했습니다. 잠시 후 다시 시도하거나 hello@nonce.community로 보내 주세요.');
      })
      .then(function () { btn.disabled = false; btn.textContent = '지원서 제출'; });
  });
})();
