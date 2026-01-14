gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

$(function() {
  const elementsToLoad = {
    "#header": "/includes/header.html",
    "#footer": "/includes/footer.html",
  };

  $.each(elementsToLoad, function(selector, url) {
    $(selector).load(url, function(response, status, xhr) {
      quickMenu();
      if (status === "error") {
        console.error(`Failed to load ${url}: ${xhr.status} ${xhr.statusText}`);
      } 
      if (status === "success") {
        if (selector === "#header") {
          initNavigation();
          // console.log("헤더 로드 완료 및 이벤트 바인딩");
        }
        if (selector === "#footer") {
          // console.log("푸터 로드 완료");
        }
      }
    });
  });
});

// 헤더 관련 이벤트
function initNavigation() {
  $('.btn-menu').on('click', function() {
    $('.gnb').toggleClass('active');
  });

  // 다크모드 전환 버튼
  $('.theme_toggle').on('click', function() {
    if ($('html').hasClass('darkMode')) {
      $('html').removeClass('darkMode')
      $('.theme_toggle').attr('aria-label', '라이트 모드로 전환');
    } else {
      $('html').addClass('darkMode')
      $('.theme_toggle').attr('aria-label', '다크 모드로 전환');
    }
  })
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