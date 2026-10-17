/* MyUi-A local demo. No API calls, remote scripts, real keys, or build dependencies. */
(() => {
  'use strict';
  const root = document.querySelector('.myui-a');
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* file mode may block storage */ } },
  };
  let themeMode = storage.get('myui-a.theme') || 'dark';
  let language = storage.get('myui-a.language') || 'zh';
  let toastTimer;
  function toast(zh, en) {
    const node = $('#mua-toast');
    node.textContent = language === 'en' ? en : zh;
    node.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { node.hidden = true; }, 2200);
  }
  function closeDetails(except) {
    $$('.mua-dropdown[open]').forEach(node => { if (node !== except) node.open = false; });
  }
  function applyTheme(mode, persist = true) {
    if (!['light','dark','system'].includes(mode)) mode = 'dark';
    themeMode = mode;
    const resolved = mode === 'system' ? (systemTheme.matches ? 'dark' : 'light') : mode;
    root.dataset.theme = resolved;
    $$('[data-theme-icon] use').forEach(node => node.setAttribute('href', resolved === 'dark' ? '#mua-moon' : '#mua-sun'));
    $$('[data-set-theme]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.setTheme === mode)));
    if (persist) storage.set('myui-a.theme', mode);
  }
  const translations = $$('[data-en]').map(node => ({node, zh:node.textContent, en:node.dataset.en}));
  const labelMap = new Map([
    ['更改语言','Change language'], ['切换主题','Change theme'], ['通知','Notifications'],
    ['打开导航菜单','Open navigation'], ['关闭导航菜单','Close navigation'],
    ['关闭指南','Close guide'], ['切换深浅主题','Toggle light or dark theme'],
    ['主导航','Main navigation'], ['移动导航','Mobile navigation'], ['导航菜单','Navigation'],
    ['显示主题','Display theme'], ['界面语言','Interface language'], ['公告类型','Update type'],
    ['示例模板概览','Template overview'], ['API 协议','API protocols'],
    ['API 协议演示，使用本地示例数据','API protocol demo with local sample data'],
    ['示例状态码 200 OK','Sample status code 200 OK'], ['示例支持类型','Example model types'],
    ['MyUi-A 首页','MyUi-A home'],
  ]);
  const ariaLabels = $$('[aria-label]').map(node => ({node, zh:node.getAttribute('aria-label')}));
  function setLanguage(value, persist = true) {
    language = value === 'en' ? 'en' : 'zh';
    translations.forEach(({node, zh, en}) => { node.textContent = language === 'en' ? en : zh; });
    ariaLabels.forEach(({node, zh}) => node.setAttribute('aria-label', language === 'en' ? (labelMap.get(zh) || zh) : zh));
    $$('[data-language]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.language === language)));
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    document.title = language === 'en' ? 'MyUi-A · Homepage design sample' : 'MyUi-A · 首页设计示例';
    if (persist) storage.set('myui-a.language', language);
  }
  applyTheme(themeMode, false);
  setLanguage(language, false);
  systemTheme.addEventListener('change', () => { if (themeMode === 'system') applyTheme('system', false); });
  $$('[data-set-theme]').forEach(node => node.addEventListener('click', () => {
    applyTheme(node.dataset.setTheme);
    const dropdown = node.closest('details');
    dropdown.open = false;
    dropdown.querySelector('summary').focus();
  }));
  $$('[data-language]').forEach(node => node.addEventListener('click', () => {
    setLanguage(node.dataset.language);
    updatePause();
    const dropdown = node.closest('details');
    dropdown.open = false;
    dropdown.querySelector('summary').focus();
    toast('已切换为简体中文', 'Language changed to English');
  }));
  $$('.mua-dropdown').forEach(node => node.addEventListener('toggle', () => {
    if (node.open) { closeDetails(node); closeNotice(false); }
  }));
  $$('.mua-menu').forEach(menu => menu.addEventListener('keydown', event => {
    const items = [...menu.querySelectorAll('button')];
    const i = items.indexOf(document.activeElement);
    let target;
    if (event.key === 'ArrowDown') target = (i + 1) % items.length;
    if (event.key === 'ArrowUp') target = (i - 1 + items.length) % items.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = items.length - 1;
    if (target !== undefined) { event.preventDefault(); items[target].focus(); }
  }));

  // Native dialogs provide focus containment and Escape handling for modal content.
  const mobile = $('#mua-mobile-menu');
  const guide = $('#guide');
  let savedOverflow = null;
  function syncScrollLock() {
    const modalOpen = mobile.open || guide.open;
    if (modalOpen && savedOverflow === null) { savedOverflow = root.style.overflow; root.style.overflow = 'hidden'; }
    if (!modalOpen && savedOverflow !== null) { root.style.overflow = savedOverflow; savedOverflow = null; }
  }
  $('#mua-open-mobile').addEventListener('click', () => {
    closeDetails(); closeNotice(false); mobile.showModal(); syncScrollLock();
  });
  $$('[data-close-mobile]').forEach(node => node.addEventListener('click', () => { mobile.close(); syncScrollLock(); }));
  $$('[data-mobile-theme]').forEach(node => node.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')));
  [mobile, guide].forEach(dialog => dialog.addEventListener('close', syncScrollLock));
  mobile.querySelectorAll('a').forEach(node => node.addEventListener('click', () => { mobile.close(); syncScrollLock(); }));
  $$('[data-guide]').forEach(node => node.addEventListener('click', event => {
    event.preventDefault();
    if (mobile.open) mobile.close();
    closeDetails(); closeNotice(false);
    guide.showModal(); syncScrollLock();
  }));
  $$('[data-close-guide]').forEach(node => node.addEventListener('click', () => { guide.close(); syncScrollLock(); }));
  guide.addEventListener('click', event => {
    if (event.target !== guide) return;
    const rect = guide.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) { guide.close(); syncScrollLock(); }
  });
  matchMedia('(min-width:640px)').addEventListener('change', event => {
    if (event.matches && mobile.open) { mobile.close(); syncScrollLock(); }
  });

  // Non-modal, anchored notification panel.
  const notice = $('#mua-notice');
  const noticeToggle = $('#mua-notice-toggle');
  const seen = {notice:false,timeline:false};
  function updateUnread() {
    const unread = Object.values(seen).filter(value => !value).length;
    $('#mua-unread').textContent = String(unread);
    $('#mua-unread').hidden = unread === 0;
  }
  function closeNotice(restoreFocus = true) {
    const wasOpen = !notice.hidden;
    notice.hidden = true;
    noticeToggle.setAttribute('aria-expanded', 'false');
    if (wasOpen && restoreFocus) noticeToggle.focus();
  }
  function selectNotice(id, focus = false) {
    $$('[data-notice-tab]').forEach(node => {
      const selected = node.dataset.noticeTab === id;
      node.setAttribute('aria-selected', String(selected));
      node.tabIndex = selected ? 0 : -1;
      if (selected && focus) node.focus();
    });
    $('#notice-panel').hidden = id !== 'notice';
    $('#timeline-panel').hidden = id !== 'timeline';
    seen[id] = true; updateUnread();
  }
  noticeToggle.addEventListener('click', () => {
    if (!notice.hidden) return closeNotice();
    closeDetails(); notice.hidden = false;
    noticeToggle.setAttribute('aria-expanded', 'true');
    const selected = notice.querySelector('[role="tab"][aria-selected="true"]');
    selectNotice(selected.dataset.noticeTab, true);
  });
  $$('[data-close-notice]').forEach(node => node.addEventListener('click', () => closeNotice()));
  const noticeTabs = $$('[data-notice-tab]');
  noticeTabs.forEach(node => node.addEventListener('click', () => selectNotice(node.dataset.noticeTab)));
  function tabKeyboard(buttons, activate) {
    buttons.forEach((button, index) => button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault(); buttons[next].focus(); activate(buttons[next]);
    }));
  }
  tabKeyboard(noticeTabs, node => selectNotice(node.dataset.noticeTab));
  document.addEventListener('click', event => {
    if (!event.target.closest('.mua-dropdown')) closeDetails();
    if (!event.target.closest('.mua-popup-host')) closeNotice(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = $('.mua-dropdown[open]');
    if (open) { open.open = false; open.querySelector('summary').focus(); }
    if (!notice.hidden) closeNotice();
  });

  // Scroll morph mirrors the reference's >20px trigger.
  const header = $('#mua-header');
  let scrollPending = false;
  function updateHeader() { header.classList.toggle('is-scrolled', scrollY > 20); scrollPending = false; }
  addEventListener('scroll', () => {
    if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateHeader); }
  }, {passive:true});
  updateHeader();
  $$('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

  // Static fixtures; all latency, token and cost values are demonstration values.
  const protocols = [
    {id:'chat', path:'/v1/chat/completions', headers:['Authorization: Bearer sk-••••'],
      body:['"model": "your-model",','"messages": [','  { "role": "user", "content": "..." }',']'],
      response:'{\n  "choices": [{ "message": { "content": "Hello, developer." } }],\n  "usage": { "total_tokens": 27 }\n}', latency:142,tokens:27,cost:'0.00081'},
    {id:'responses',path:'/v1/responses',headers:['Authorization: Bearer sk-••••'],
      body:['"model": "your-model",','"input": "..."'],
      response:'{\n  "output": [{ "type": "output_text", "text": "Ready to build." }],\n  "usage": { "total_tokens": 31 }\n}',latency:168,tokens:31,cost:'0.00093'},
    {id:'claude',path:'/v1/messages',headers:['x-api-key: sk-••••','anthropic-version: 2023-06-01'],
      body:['"model": "your-model",','"max_tokens": 1024,','"messages": [','  { "role": "user", "content": "..." }',']'],
      response:'{\n  "content": [{ "type": "text", "text": "A clear connection." }],\n  "usage": { "input_tokens": 11, "output_tokens": 18 }\n}',latency:156,tokens:29,cost:'0.00087'},
    {id:'gemini',path:'/v1beta/models/{model}:generateContent',headers:['x-goog-api-key: sk-••••'],
      body:['"contents": [','  { "role": "user",','    "parts": [{ "text": "..." }] }',']'],
      response:'{\n  "candidates": [{ "content": { "parts": [{ "text": "Ideas connected." }] } }],\n  "usageMetadata": { "totalTokenCount": 25 }\n}',latency:93,tokens:25,cost:'0.00075'},
  ];
  const demo = $('#demo');
  const protocolTabs = $$('[data-protocol-tab]');
  const pauseButton = $('#mua-auto-toggle');
  let activeIndex = 0;
  let wantsAuto = true;
  let hovering = false;
  let autoTimer;
  let transitionTimer;
  function highlight(code, element) {
    const fragment = document.createDocumentFragment();
    const tokens = /("(?:\\.|[^"\\])*")|(-[XHd]\b)|(\bcurl\b)|(\b\d+(?:\.\d+)?\b)/g;
    let previous = 0;
    for (const match of code.matchAll(tokens)) {
      fragment.append(document.createTextNode(code.slice(previous, match.index)));
      const span = document.createElement('span');
      span.className = match[1] ? (code.slice(match.index + match[0].length).trimStart().startsWith(':') ? 'mua-key' : 'mua-string') : match[2] ? 'mua-flag' : match[3] ? 'mua-command' : 'mua-number';
      span.textContent = match[0]; fragment.append(span);
      previous = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(code.slice(previous)));
    element.replaceChildren(fragment);
  }
  function renderProtocol(index) {
    activeIndex = index;
    const data = protocols[index];
    demo.dataset.protocol = data.id;
    $('#mua-path').textContent = data.path;
    $('#mua-path').title = data.path;
    const slash = ' \\';
    const lines = [`curl -X POST "${data.path}"${slash}`, ...data.headers.map(value => `  -H "${value}"${slash}`), "  -d '{", ...data.body.map(value => `    ${value}`), "  }'"];
    highlight(lines.join('\n'), $('#mua-request'));
    highlight(data.response, $('#mua-response'));
    $('#mua-latency').textContent = `${data.latency} MS`;
    $('#mua-tokens').textContent = `${data.tokens} TOKENS`;
    $('#mua-cost').textContent = `COST $${data.cost}`;
    protocolTabs.forEach((node,i) => { node.setAttribute('aria-selected',String(i === index)); node.tabIndex = i === index ? 0 : -1; });
    $('#protocol-panel').setAttribute('aria-labelledby', `tab-${data.id}`);
  }
  function changeProtocol(index, manual = false) {
    if (manual) { wantsAuto = false; configureAuto(); }
    clearTimeout(transitionTimer);
    if (motion.matches || index === activeIndex) { demo.classList.remove('is-changing'); renderProtocol(index); return; }
    demo.classList.add('is-changing');
    transitionTimer = setTimeout(() => { renderProtocol(index); demo.classList.remove('is-changing'); },220);
  }
  function updatePause() {
    const paused = !wantsAuto || motion.matches;
    pauseButton.setAttribute('aria-pressed',String(paused));
    pauseButton.disabled = motion.matches;
    const labels = language === 'en' ? ['Pause automatic switching','Resume automatic switching','Reduced motion enabled'] : ['暂停自动切换','恢复自动切换','已启用减少动态效果'];
    pauseButton.setAttribute('aria-label',motion.matches ? labels[2] : paused ? labels[1] : labels[0]);
    pauseButton.querySelector('use').setAttribute('href',paused ? '#mua-play' : '#mua-pause');
  }
  function configureAuto() {
    clearInterval(autoTimer); autoTimer = undefined;
    if (wantsAuto && !motion.matches && !hovering && !document.hidden) autoTimer = setInterval(() => changeProtocol((activeIndex + 1) % protocols.length),4500);
    updatePause();
  }
  protocolTabs.forEach((node,index) => node.addEventListener('click', () => changeProtocol(index,true)));
  tabKeyboard(protocolTabs, node => changeProtocol(protocolTabs.indexOf(node),true));
  pauseButton.addEventListener('click', () => { wantsAuto = !wantsAuto; configureAuto(); });
  demo.addEventListener('mouseenter', () => { hovering = true; configureAuto(); });
  demo.addEventListener('mouseleave', () => { hovering = false; configureAuto(); });
  demo.addEventListener('focusin', event => { if (!event.target.closest('#mua-auto-toggle')) { wantsAuto = false; configureAuto(); } });
  document.addEventListener('visibilitychange',configureAuto);
  renderProtocol(0); configureAuto();

  // Progressive enhancement: without JavaScript the full page and final counts remain visible.
  const reveals = $$('.mua-reveal');
  let revealObserver;
  if (!motion.matches && 'IntersectionObserver' in window) {
    try {
      revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-waiting'); entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }), {threshold:.15,rootMargin:'0px 0px -40px 0px'});
      reveals.forEach(node => { node.style.setProperty('--mua-delay',`${Number(node.dataset.delay) || 0}ms`); node.classList.add('is-waiting'); revealObserver.observe(node); });
    } catch {
      reveals.forEach(node => node.classList.remove('is-waiting'));
      revealObserver?.disconnect();
    }
  }
  let countObserver;
  const counters = $$('[data-count]');
  function animateCounter(node) {
    const end = Number(node.dataset.count);
    const start = performance.now();
    function tick(now) {
      if (motion.matches) { node.textContent = String(end); return; }
      const t = Math.min((now - start) / 1600,1);
      node.textContent = String(Math.round((1 - Math.pow(1-t,3))*end));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (!motion.matches && 'IntersectionObserver' in window) {
    countObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); countObserver.unobserve(entry.target); }
    }), {threshold:.5});
    counters.forEach(node => countObserver.observe(node));
  }
  motion.addEventListener('change', () => {
    configureAuto();
    if (motion.matches) {
      clearTimeout(transitionTimer); demo.classList.remove('is-changing');
      revealObserver?.disconnect(); countObserver?.disconnect();
      reveals.forEach(node => node.classList.remove('is-waiting'));
      counters.forEach(node => { node.textContent = node.dataset.count; });
    }
  });
  addEventListener('pagehide', () => { clearInterval(autoTimer); clearTimeout(transitionTimer); });
})();
