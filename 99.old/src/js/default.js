gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

$(function() {
  hoverCapabilityDetect();
  initNavigation();

  //about 페이지
  quickMenu();
  activeToggle('.about #project .pj_list > li', '.about #project .pj_list > li', 'active');
});

// alert 이벤트
function alertText() {
  alert("준비중입니다!😊");
}

// 헤더 관련 이벤트
function initNavigation() {
  // 메뉴 토글
  $('.btn-menu').on('click', function() {
    $('.gnb').toggleClass('active');
  });

  // 다크모드 전환 버튼
  $('.theme_toggle').on('click', function() {
    if ($('html').hasClass('darkMode')) {
      // 1. 라이트 모드로 변경
      $('html').removeClass('darkMode');
      $('.theme_toggle').attr('aria-label', '다크 모드로 전환');
      localStorage.setItem('theme', 'light');
    } else {
      // 2. 다크 모드로 변경
      $('html').addClass('darkMode');
      $('.theme_toggle').attr('aria-label', '라이트 모드로 전환');
      localStorage.setItem('theme', 'dark');
    }
  });

  // 페이지 로드 시 저장된 테마 적용
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    $('html').addClass('darkMode');
    $('.theme_toggle').attr('aria-label', '라이트 모드로 전환');
  }
}

// 퀵메뉴
function quickMenu() {
  const headerHeight = $('#header').outerHeight();
  // 1. 섹션 이동
  $('aside a').on('click', function(e) {
    e.preventDefault();
    const target = $(this).attr('href');
    gsap.to(window, {
      duration: 0.5, 
      scrollTo: { y: target, offsetY: headerHeight + 100},
      ease: "power2.inOut"
    });
  });

  // 2. 섹션 활성화
  const menuLinks = $('aside li');
  const sections = $('section');

  sections.each(function(i, section) {
    ScrollTrigger.create({
      trigger: section,
      start: "top 20%",
      end: "bottom 20%",
      onToggle: self => {
        if (self.isActive) {
          menuLinks.removeClass('active');
          menuLinks.eq(i).addClass('active');
        }
      }
    });
  });
}

// 범용 이벤트
// 마우스 사용 여부 감지
function hoverCapabilityDetect() {
  const root = document.documentElement;

  // 진짜 마우스로 움직였을 때만 클래스 추가
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'mouse' && !root.classList.contains('is-mouse')) {
      root.classList.add('is-mouse');
    }
  });

  // 터치로 조작하면 다시 제거 (입력장치 전환 대응)
  window.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch' && root.classList.contains('is-mouse')) {
      root.classList.remove('is-mouse');
    }
  });
}

// 토글
function activeToggle(selector, target, className) {
  $(selector).on('click', function() {
    $(this).toggleClass(className);
  });
}