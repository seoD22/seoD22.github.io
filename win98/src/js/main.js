'use strict';

/* ==========================================================================
   Win98 Portfolio Script (multi-window)

   - Win98Window  : 개별 창 (열기/닫기/최소화/최대화/드래그)
   - WindowManager: 창 자동 등록, z-index/포커스, 겹침 방지(cascade)
   - Taskbar      : footer 작업표시줄 버튼
   - DesktopIcon  : 바탕화면 아이콘 → data-target(창 id)으로 창 열기
   - Tabs         : 창 안의 탭 (HTML 기반, 창마다 독립 동작)
   - Clock        : 작업표시줄 시계

   [창 추가 방법]
   1) HTML에 .win-content 바로 아래 .window 를 복사하고 고유 id 부여
   2) 아이콘에 data-target="그 id" 지정
   → JS 수정 불필요
   ========================================================================== */


/* --------------------------------------------------------------------------
   Win98Window
   -------------------------------------------------------------------------- */
class Win98Window {
  /**
   * @param {HTMLElement} el          .window 요소 (id 필수)
   * @param {WindowManager} manager
   * @param {Object} [options]
   * @param {string} [options.title]       작업표시줄 표시명 (기본: data-title → .title-bar-text)
   * @param {boolean} [options.draggable=true]
   */
  constructor(el, manager, options = {}) {
    this.el = el;
    this.id = el.id;
    this.manager = manager;
    this.titleBar = el.querySelector(':scope > .title-bar');
    this.title = options.title
      ?? el.dataset.title
      ?? this.titleBar?.querySelector('.title-bar-text')?.textContent.trim()
      ?? 'Window';
    this.draggable = options.draggable ?? true;

    this.isOpen = false;
    this.isMinimized = false;
    this.isMaximized = false;
    this.prevRect = null;
    this.hasBeenPlaced = false;

    this.el.style.position = 'fixed';
    this.el.style.display = 'none';

    this.#bindControls();
    if (this.draggable) this.#bindDrag();
    
    this.maximizeBtn = this.titleBar?.querySelector('.title-bar-controls [aria-label="Maximize"]') ?? null;
    this.applyLayoutMode();

    // 창 어디든 누르면 맨 앞으로
    this.el.addEventListener('pointerdown', () => this.manager.focus(this));
  }

  /* ---------- public ---------- */

  open() {
    const wasClosed = !this.isOpen;

    if (wasClosed) {
      this.isOpen = true;
      this.el.style.display = '';
      this.#placeIfNeeded();
      this.manager.taskbar?.add(this);
    } else if (this.isMinimized) {
      this.el.style.display = '';
      this.#placeIfNeeded();
    }

    this.isMinimized = false;
    this.manager.focus(this);

    // 닫힘 → 열림 전환 시에만 알림 (최소화 복원, 이미 열린 창 재클릭은 제외)
    if (wasClosed) this.#emit('window:open');
  }

  close() {
    const wasOpen = this.isOpen;
    this.isOpen = false;
    this.isMinimized = false;
    this.el.style.display = 'none';
    this.manager.taskbar?.remove(this);
    this.manager.focusTopmost();

    if (wasOpen) this.#emit('window:close');
  }

  minimize() {
    this.isMinimized = true;
    this.el.style.display = 'none';
    this.manager.focusTopmost();
  }

  toggleMaximize() {
    if (this.manager.isCompact) return;
    this.isMaximized ? this.#restore() : this.#maximize();
  }

  /** 작업표시줄 버튼 클릭: 최소화 ↔ 복원 / 뒤에 있으면 앞으로 */
  toggleFromTaskbar() {
    if (this.isMinimized) this.open();
    else if (this.manager.activeWindow === this) this.minimize();
    else this.manager.focus(this);
  }

  /* ---------- private ---------- */

  /** 창 요소에 커스텀 이벤트 발행 (jQuery .on() / addEventListener 모두 수신 가능) */
  #emit(type) {
    this.el.dispatchEvent(new CustomEvent(type, { detail: { win: this } }));
  }

  #bindControls() {
    const actions = {
      Minimize: () => this.minimize(),
      Maximize: () => this.toggleMaximize(),
      Close: () => this.close(),
    };

    // :scope > 로 중첩된 하위 .window(탭 패널 등)의 버튼과 섞이지 않게 함
    this.titleBar?.querySelectorAll('.title-bar-controls [aria-label]').forEach((btn) => {
      const action = actions[btn.getAttribute('aria-label')];
      if (action) btn.addEventListener('click', action);
    });

    // 하단 OK / Cancel 버튼 → 닫기
    this.el.querySelectorAll(':scope > .window-body > .btn-wrap .win-btn').forEach((btn) => {
      btn.addEventListener('click', () => this.close());
    });

    // 타이틀바 더블클릭 → 최대화 토글
    this.titleBar?.addEventListener('dblclick', (e) => {
      if (e.target.closest('.title-bar-controls')) return;
      this.toggleMaximize();
    });
  }

  #bindDrag() {
    if (!this.titleBar) return;
    let startX, startY, originLeft, originTop;

    const onMove = (e) => {
      const minLeft = -this.el.offsetWidth + 60;
      const maxLeft = window.innerWidth - 60;
      const maxTop = window.innerHeight - 60;
      const left = Math.min(Math.max(originLeft + e.clientX - startX, minLeft), maxLeft);
      const top = Math.min(Math.max(originTop + e.clientY - startY, 0), maxTop);
      this.el.style.left = `${left}px`;
      this.el.style.top = `${top}px`;
    };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      this.el.classList.remove('is-dragging');
    };

    this.titleBar.addEventListener('pointerdown', (e) => {
      // 태블릿 이하 / 최대화 상태 / 컨트롤 버튼 클릭이면 드래그 안 함
      if (this.manager.isCompact || this.isMaximized || e.target.closest('.title-bar-controls')) return;
      e.preventDefault();
      const rect = this.el.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      originLeft = rect.left;
      originTop = rect.top;
      this.el.classList.add('is-dragging');
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    });
  }

  /** 화면 크기(태블릿 이하 / 데스크탑)에 맞춰 창 동작 전환 */
  applyLayoutMode() {
    const compact = this.manager.isCompact;

    if (this.maximizeBtn) this.maximizeBtn.disabled = compact;

    if (compact) this.#resetToCss();
    else if (this.isOpen && !this.isMinimized) this.#placeIfNeeded();
  }

  /** 데스크탑에서 아직 위치를 안 잡은 창만 중앙 배치 (compact 에서는 CSS 가 담당) */
  #placeIfNeeded() {
    if (this.manager.isCompact || this.hasBeenPlaced) return;
    this.#center(this.manager.nextCascadeOffset());
  }

  /** JS 가 넣은 인라인 위치/크기를 지워서 SCSS 의 가운데 정렬로 되돌림 */
  #resetToCss() {
    Object.assign(this.el.style, {
      left: '', top: '', transform: '', margin: '',
      width: '', maxWidth: '', height: '',
    });
    this.el.classList.remove('is-maximized', 'is-dragging');
    this.isMaximized = false;
    this.prevRect = null;
    this.hasBeenPlaced = false;
  }

  #center(offset = 0) {
    // display 상태에서 크기를 측정해야 하므로 open()에서 display 해제 후 호출
    const rect = this.el.getBoundingClientRect();
    const left = Math.max((window.innerWidth - rect.width) / 2 + offset, 0);
    const top = Math.max((window.innerHeight - rect.height) / 2 - 20 + offset, 0);
    this.el.style.transform = 'none';
    this.el.style.margin = '0';
    this.el.style.left = `${left}px`;
    this.el.style.top = `${top}px`;
    this.hasBeenPlaced = true;
  }

  #maximize() {
    const rect = this.el.getBoundingClientRect();
    this.prevRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    const taskbarH = this.manager.taskbar?.height ?? 0;

    Object.assign(this.el.style, {
      left: '0px',
      top: '0px',
      width: '100%',
      maxWidth: 'none',
      height: `calc(100% - ${taskbarH}px)`,
    });
    this.el.classList.add('is-maximized');
    this.isMaximized = true;
  }

  #restore() {
    const r = this.prevRect;
    if (r) {
      Object.assign(this.el.style, {
        left: `${r.left}px`,
        top: `${r.top}px`,
        width: `${r.width}px`,
        maxWidth: '',
        height: `${r.height}px`,
      });
    }
    this.el.classList.remove('is-maximized');
    this.isMaximized = false;
  }
}


/* --------------------------------------------------------------------------
   WindowManager
   -------------------------------------------------------------------------- */
class WindowManager {
  /**
   * @param {Object} [options]
   * @param {number} [options.baseZIndex=100]
   * @param {number} [options.cascadeStep=28]  새 창마다 어긋나는 간격(px)
   * @param {number} [options.cascadeMax=6]    몇 개 뒤에 다시 처음 위치로 돌아갈지
   */
  constructor(options = {}) {
    this.windows = new Map();   // id → Win98Window
    this.zIndex = options.baseZIndex ?? 100;
    this.cascadeStep = options.cascadeStep ?? 28;
    this.cascadeMax = options.cascadeMax ?? 6;
    this.cascadeIndex = 0;
    this.activeWindow = null;
    this.taskbar = null;

    // 태블릿 이하(기본 1024px): 드래그/최대화 끄고 창 위치·크기 고정
    this.compactQuery = window.matchMedia(`(max-width: ${options.compactBreakpoint ?? 1024}px)`);
    this.compactQuery.addEventListener('change', () => {
      this.windows.forEach((win) => win.applyLayoutMode());
    });
  }

  /** "#id" / ".id" / "id" 어떤 형태로 와도 id로 통일 */
  static normalizeKey(target) {
    return String(target ?? '').trim().replace(/^[#.]/, '');
  }

  get isCompact() {
    return this.compactQuery.matches;
  }

  /** selector에 일치하는 모든 창을 한 번에 등록 */
  registerAll(selector) {
    document.querySelectorAll(selector).forEach((el) => this.register(el));
    return this;
  }

  register(el, options = {}) {
    if (!el.id) {
      console.warn('[WindowManager] id가 없는 창은 등록할 수 없습니다.', el);
      return null;
    }
    const win = new Win98Window(el, this, options);
    this.windows.set(el.id, win);
    return win;
  }

  get(target) {
    return this.windows.get(WindowManager.normalizeKey(target)) ?? null;
  }

  open(target) {
    const win = this.get(target);
    if (!win) {
      console.warn(`[WindowManager] 등록되지 않은 창: ${target}`);
      return null;
    }
    win.open();
    return win;
  }

  close(target) {
    this.get(target)?.close();
  }

  nextCascadeOffset() {
    const offset = (this.cascadeIndex % this.cascadeMax) * this.cascadeStep;
    this.cascadeIndex += 1;
    return offset;
  }

  focus(win) {
    this.activeWindow = win;
    win.el.style.zIndex = ++this.zIndex;
    this.windows.forEach((w) => w.el.classList.toggle('is-active', w === win));
    this.taskbar?.setActive(win);
  }

  focusTopmost() {
    const visible = [...this.windows.values()].filter((w) => w.isOpen && !w.isMinimized);
    if (!visible.length) {
      this.activeWindow = null;
      this.windows.forEach((w) => w.el.classList.remove('is-active'));
      this.taskbar?.setActive(null);
      return;
    }
    const top = visible.reduce((a, b) =>
      Number(a.el.style.zIndex) > Number(b.el.style.zIndex) ? a : b
    );
    this.focus(top);
  }
}


/* --------------------------------------------------------------------------
   Taskbar (footer)
   -------------------------------------------------------------------------- */
class Taskbar {
  /**
   * @param {HTMLElement} footer
   * @param {WindowManager} manager
   */
  constructor(footer, manager) {
    this.footer = footer;
    this.manager = manager;
    this.buttons = new Map(); // Win98Window → button

    this.list = footer.querySelector('.taskbar-items');
    if (!this.list) {
      this.list = document.createElement('div');
      this.list.className = 'taskbar-items';
      footer.querySelector('.btn-start')?.after(this.list) ?? footer.append(this.list);
    }

    manager.taskbar = this;
  }

  get height() {
    return this.footer.offsetHeight;
  }

  add(win) {
    if (this.buttons.has(win)) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'win-btn task-btn';
    btn.textContent = win.title;
    btn.addEventListener('click', () => win.toggleFromTaskbar());
    this.list.append(btn);
    this.buttons.set(win, btn);
  }

  remove(win) {
    this.buttons.get(win)?.remove();
    this.buttons.delete(win);
  }

  setActive(win) {
    this.buttons.forEach((btn, w) => btn.classList.toggle('is-active', w === win));
  }
}


/* --------------------------------------------------------------------------
   DesktopIcon
   -------------------------------------------------------------------------- */
class DesktopIcon {
  static #all = [];

  /**
   * @param {HTMLElement} el          .bg-icon 버튼
   * @param {WindowManager} manager
   * @param {Object} [options]
   * @param {string} [options.target]       열 창의 id (기본: data-target)
   * @param {'click'|'dblclick'} [options.openOn='click']
   */
  constructor(el, manager, options = {}) {
    this.el = el;
    this.manager = manager;
    this.target = options.target ?? el.dataset.target;
    this.openOn = options.openOn ?? 'click';

    DesktopIcon.#all.push(this);

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.select();
      if (this.openOn === 'click') this.open();
    });
    if (this.openOn === 'dblclick') {
      el.addEventListener('dblclick', () => this.open());
    }
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.openOn === 'dblclick') this.open();
    });
  }

  select() {
    DesktopIcon.deselectAll();
    this.el.classList.add('is-selected');
  }

  open() {
    if (!this.target) return;   // data-target 없는 아이콘은 아무것도 열지 않음
    this.manager.open(this.target);
  }

  static deselectAll() {
    DesktopIcon.#all.forEach((icon) => icon.el.classList.remove('is-selected'));
  }
}


/* --------------------------------------------------------------------------
   Tabs  (창 하나당 인스턴스 하나)
   HTML 기반: 탭은 data-tab, 패널은 data-panel 로 연결
   -------------------------------------------------------------------------- */
class Tabs {
  /**
   * @param {HTMLElement} root  탭이 들어있는 창 요소
   * @param {Object} [options]
   * @param {Function} [options.onChange]  (tabKey, index) => void
   */
  constructor(root, options = {}) {
    this.root = root;
    this.tablist = root.querySelector('[role="tablist"]');
    this.tabs = this.tablist ? [...this.tablist.querySelectorAll('[role="tab"]')] : [];
    this.onChange = options.onChange;

    if (!this.tabs.length) return;

    this.tabs.forEach((tab, i) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();          // href="#tabs" 점프 방지
        this.select(i);
      });
      tab.addEventListener('keydown', (e) => this.#onKeydown(e, i));
    });

    const initial = this.tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    this.select(initial >= 0 ? initial : 0);
  }

  #panel(key) {
    return this.root.querySelector(`[role="tabpanel"][data-panel="${key}"]`);
  }

  select(index) {
    const next = this.tabs[index];
    if (!next) return;

    this.tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;

      const panel = this.#panel(tab.dataset.tab);
      if (panel) panel.style.display = active ? '' : 'none';
    });

    this.onChange?.(next.dataset.tab, index);
  }

  #onKeydown(e, i) {
    const last = this.tabs.length - 1;
    const map = {
      ArrowRight: i === last ? 0 : i + 1,
      ArrowLeft: i === 0 ? last : i - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    this.select(map[e.key]);
    this.tabs[map[e.key]].focus();
  }
}


/* --------------------------------------------------------------------------
   Clock
   -------------------------------------------------------------------------- */
class Clock {
  /**
   * @param {HTMLElement} footer
   */
  constructor(footer) {
    this.el = footer.querySelector('.clock');
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.className = 'clock';
      footer.append(this.el);
    }
    this.update();
    setInterval(() => this.update(), 1000 * 15);
  }

  update() {
    this.el.textContent = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}


/* --------------------------------------------------------------------------
   ScrollSpy  (트리 메뉴 ↔ 스크롤 영역 연동)
   - 링크 클릭 → 해당 섹션으로 스크롤 (창이 position: fixed 이므로
     scrollIntoView 대신 컨테이너 scrollTop 으로만 이동)
   - 컨테이너 스크롤 → 현재 섹션에 해당하는 링크에 .is-active
   -------------------------------------------------------------------------- */
class ScrollSpy {
  /**
   * @param {HTMLElement} menu   링크(<a href="#id">)들이 들어있는 요소 (예: .tree-view)
   * @param {HTMLElement} container  스크롤되는 영역
   * @param {Object} [options]
   * @param {number} [options.offset=8]  섹션 상단 여백(px)
   */
  constructor(menu, container, options = {}) {
    this.menu = menu;
    this.container = container;
    this.offset = options.offset ?? 8;
    this.locked = false;
    this.ticking = false;

    this.links = [...menu.querySelectorAll('a[href^="#"]')];
    this.items = this.links
      .map((link) => ({
        link,
        section: container.querySelector(link.getAttribute('href')),
      }))
      .filter((item) => item.section);

    if (!this.items.length) return;

    this.items.forEach(({ link, section }) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();   // 주소 점프 + summary 접힘/펼침 방지
        this.scrollTo(section);
        this.setActive(link);
      });
    });

    container.addEventListener('scroll', () => this.#onScroll(), { passive: true });
    this.update();
  }

  /** 컨테이너 안에서 section 위치로 부드럽게 이동 */
  scrollTo(section) {
    const top =
      section.getBoundingClientRect().top -
      this.container.getBoundingClientRect().top +
      this.container.scrollTop -
      this.offset;

    // 이동 중에는 스크롤 이벤트로 active가 깜빡이지 않도록 잠깐 잠금
    this.locked = true;
    clearTimeout(this.lockTimer);
    this.lockTimer = setTimeout(() => (this.locked = false), 700);

    this.container.scrollTo({ top, behavior: 'smooth' });
  }

  /** 현재 스크롤 위치 기준으로 active 갱신 */
  update() {
    if (this.locked) return;

    const c = this.container;
    const baseTop = c.getBoundingClientRect().top;
    const atBottom = c.scrollTop + c.clientHeight >= c.scrollHeight - 2;

    let current = this.items[0];
    if (atBottom) {
      current = this.items[this.items.length - 1];
    } else {
      this.items.forEach((item) => {
        const top = item.section.getBoundingClientRect().top - baseTop;
        if (top <= this.offset + 1) current = item;
      });
    }
    this.setActive(current.link);
  }

  setActive(activeLink) {
    this.links.forEach((link) => {
      const on = link === activeLink;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    // 접혀있는 <details> 안의 항목이 active 면 자동으로 펼침
    const details = activeLink.closest('details');
    if (details && !details.open) details.open = true;
  }

  #onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.update();
      this.ticking = false;
    });
  }
}


/* --------------------------------------------------------------------------
   FontToggle  (강아지 말풍선의 '폰트 바꾸기' 버튼)
   - body 에 클래스를 토글
   - 선택한 상태를 localStorage 에 저장해서 새로고침해도 유지
   -------------------------------------------------------------------------- */
class FontToggle {
  /**
   * @param {HTMLElement} button
   * @param {string} [className='font-pretendard']
   */
  constructor(button, className = 'font-pretendard') {
    this.button = button;
    this.className = className;
    this.storageKey = 'portfolio-font';

    if (this.#load()) this.#apply(true);
    else button.setAttribute('aria-pressed', 'false');

    button.addEventListener('click', () => {
      this.#apply(!document.body.classList.contains(this.className));
    });
  }

  #apply(on) {
    document.body.classList.toggle(this.className, on);
    this.button.setAttribute('aria-pressed', String(on));
    this.#save(on);
  }

  // 저장소를 못 쓰는 환경(시크릿 모드 등)에서도 에러 없이 동작
  #load() {
    try { return localStorage.getItem(this.storageKey) === 'on'; }
    catch { return false; }
  }
  #save(on) {
    try { localStorage.setItem(this.storageKey, on ? 'on' : 'off'); }
    catch { /* 무시 */ }
  }
}


/* ==========================================================================
   Init
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('footer');
  const manager = new WindowManager();

  new Taskbar(footer, manager);
  new Clock(footer);

  /* 팝업 창 일괄 등록 (탭 패널 같은 중첩 .window 는 제외됨) */
  manager.registerAll('.win-content > .window');

  /* 창마다 탭 초기화 + data-open="true" 인 창은 처음부터 열기 */
  manager.windows.forEach((win) => {
    new Tabs(win.el);
    if (win.el.dataset.open === 'true') win.open();
  });

  /* 바탕화면 아이콘 */
  document.querySelectorAll('.bg-icon').forEach((el) => new DesktopIcon(el, manager));
  document.addEventListener('click', () => DesktopIcon.deselectAll());

  /* 스크롤 스파이: [data-scrollspy="#컨테이너id"] 인 메뉴마다 연결 */
  document.querySelectorAll('[data-scrollspy]').forEach((menu) => {
    const container = document.querySelector(menu.dataset.scrollspy);
    if (container) new ScrollSpy(menu, container);
  });

  /* 폰트 바꾸기 */
  const fontBtn = document.querySelector('.help-puppy .bubble-txt button');
  if (fontBtn) new FontToggle(fontBtn);
});


/* --------------------------------------------------------------------------
   ChatPlayer  (자기소개서 대화 재생)
   - 창이 열리는 순간(window:open 이벤트) 재생을 시작
   - 요소는 DOM 준비 후, 창(root) 안에서만 찾음
   -------------------------------------------------------------------------- */
class ChatPlayer {
  /**
   * @param {string|HTMLElement} root   대화가 들어있는 창 (예: '#window-intro')
   * @param {Array<{name:string, text:string, delay:number}>} script
   * @param {Object} [options]
   * @param {string} [options.guestName='익명의 방문자']   오른쪽(one) 말풍선으로 표시할 이름
   * @param {boolean} [options.once=true]         한 번만 재생할지
   * @param {Object} [options.selectors]
   */
  constructor(root, script, options = {}) {
    this.$root = $(root);
    this.script = script;
    this.guestName = options.guestName ?? '익명의 방문자';
    this.once = options.once ?? true;

    const sel = {
      container: '.chat-container',
      list: '#discussion',
      status: '.is-writting',      // HTML 클래스명 철자 그대로
      ...options.selectors,
    };
    this.$container = this.$root.find(sel.container);
    this.$list = this.$root.find(sel.list);
    this.$status = this.$root.find(sel.status);

    this.timers = [];
    this.hasPlayed = false;

    if (!this.$root.length) {
      console.warn(`[ChatPlayer] 창을 찾을 수 없습니다: ${root}`);
      return;
    }

    // 창이 열릴 때 자동 재생 (아이콘 클릭 → manager.open → window:open)
    this.$root.on('window:open', () => this.start());
  }

  start() {
    if (this.once && this.hasPlayed) return;
    this.hasPlayed = true;
    this.stop();
    this.$list.empty();

    let totalDelay = 0;
    this.script.forEach((item) => {
      totalDelay += item.delay;
      this.timers.push(setTimeout(() => this.#render(item), totalDelay));
    });
  }

  stop() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  reset() {
    this.stop();
    this.hasPlayed = false;
    this.$list.empty();
  }

  #render(item) {
    const isGuest = item.name === this.guestName;

    // 1. 말풍선 추가 (.text() 사용 → HTML 주입 방지)
    this.$list.append(
      $('<li>')
        .addClass(isGuest ? 'guest' : 'host')
        .append($('<p class="name">').text(`${item.name} :`))
        .append($('<p class="text">').text(item.text))
    );

    // 2. 상태 메시지
    if (isGuest) {
      this.$status.text(`${item.name}님이 메시지를 작성하는 중...`);
    } else {
      const now = new Date();
      const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
      const date = `${now.getFullYear()}년 ${String(now.getMonth() + 1).padStart(2, '0')}월 ${String(now.getDate()).padStart(2, '0')}일`;
      this.$status.text(`마지막으로 받은 메시지: ${date} ${time}`);
    }

    // 3. 스크롤 하단 이동
    const box = this.$container[0];
    if (box) this.$container.scrollTop(box.scrollHeight);
  }
}


/* ==========================================================================
   자기소개서 대화 데이터 + 초기화
   ========================================================================== */
const discussion = [
  { name: "윤서희_퍼블리셔[구직중]", text: "안녕하세요!", delay: 1000 },
  { name: "윤서희_퍼블리셔[구직중]", text: "제 포트폴리오 사이트에 방문해주셔서 감사합니다! 😁", delay: 1000 },
  { name: "익명의 방문자", text: "응응! 너는?", delay: 2000 },
  { name: "윤서희_퍼블리셔[구직중]", text: "11월 2일 토요일에 뭐해?", delay: 1900 },
  { name: "윤서희_퍼블리셔[구직중]", text: "나 생일 파티 하려고!", delay: 1900 },
  { name: "윤서희_퍼블리셔[구직중]", text: "시간 돼? 🥳", delay: 1900 },
  { name: "익명의 방문자", text: "당연히 되지! 😁", delay: 2000 },
  { name: "윤서희_퍼블리셔[구직중]", text: "그러면 노제 마을 회관으로 와!", delay: 1900 },
  { name: "윤서희_퍼블리셔[구직중]", text: "내 15번째 생일 축하해주러!", delay: 1900 },
  { name: "윤서희_퍼블리셔[구직중]", text: "아 30번째 생일*", delay: 1900 },
  { name: "익명의 방문자", text: "좋아 ㅋㅋㅋ", delay: 2000 },
  { name: "윤서희_퍼블리셔[구직중]", text: "파티 컨셉 맞춰봐!", delay: 1900 },
  { name: "윤서희_퍼블리셔[구직중]", text: "바로 2000년대 감성이야!!! 🥳🥳🥳", delay: 1900 }
];

$(() => {
  new ChatPlayer('#window-intro', discussion);
});