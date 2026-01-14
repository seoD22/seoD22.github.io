gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

$(function() {
  quickMenu();
  initNavigation();
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

