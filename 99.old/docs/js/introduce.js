if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', function() {
  window.scrollTo(0, 0);

  window.addEventListener('load', function () {
    section02_toggle();
    section03_toggle();
    // 로딩 화면
    loading();
  });

  // 네비게이션
  navi();


  // 반응형
  // ScrollTrigger.matchMedia({
  //   '(min-width: 769px)': function(){
  //     // gsap
      visual();
      // sec01Fix();
      // sec02Fix();
  //     sec03Anime();
  //   },

  //   '(max-width: 768px)': function(){
  //     // gsap
  //     visualRespon();
  //     // sec01Fix();
  //     sec02FixRespon();
  //     sec03Anime();

  //     // 사이드 버튼 사라짐
  //     // 스크롤 이벤트
  //     $(window).on('scroll', asideBtnNone);
  //   }
  // })


});


// 로딩화면
function loading() {
  const load = document.querySelector('#load');
  if (!load) return;

  // 모바일
  if (window.matchMedia('(max-width: 768px)').matches) {
    load.remove();
    return;
  }

  const html = document.documentElement;
  html.style.overflow = 'hidden';

  // 로고 등장 애니메이션
  const MIN_DISPLAY = 2300;

  setTimeout(() => {
    load.classList.add('hide');
    html.style.overflow = '';

    load.addEventListener('transitionend', () => {
      load.remove();
    }, { once: true });
  }, MIN_DISPLAY);
};

// 네비게이션
function navi() {
  gsap.registerPlugin(ScrollToPlugin);

  $('header .nav, footer .nav').on('click', function (e) {
    e.preventDefault();

    let idx = $(this).index();
    const $target = $('.move').eq(idx);
    if (!$target.length) return;

    gsap.to(window, {
      scrollTo: {
        y: $target,
        offsetY: 80
      },
      duration: 1,
      ease: 'power2.inOut'
    });
  });
}

// 사이드 버튼
function asideBtnEvent() {
  const html = document.querySelector('html');
  const asideBtn = document.querySelector('aside');

  asideBtn.addEventListener('click', (e) => {
    asideBtn.classList.toggle('on');
    html.classList.toggle('show');
  })
};

// profile 마우스 오버 버튼
// function profileBtn() {
//   const $hoverBox = $('.hover_box');
//   const $spans = $hoverBox.find('._hover span');

//   $spans.on('mouseenter', function() {
//     // 마우스가 올라간 span의 인덱스 확인 (0이면 Myself, 1이면 Career)
//     const index = $(this).index();

//     if (index === 0) {
//       $hoverBox.addClass('_left').removeClass('_right');
//     } else if (index === 1) {
//       $hoverBox.addClass('_right').removeClass('_left');
//     }
//   });
// }

// gsap anime
function visual() {
  const sectionVisual = document.querySelector('section._visual');
  const flowSection = document.querySelector('section._flow');
  const section01 = document.querySelector('section._01');

  const flowBox01 = document.querySelector('section._flow .flow_inner .flow_wrap._01');
  const flowBox02 = document.querySelector('section._flow .flow_inner .flow_wrap._02');

  ScrollTrigger.matchMedia({
    // PC
    "(min-width: 1025px)": function () {
      initVisualAnime({
        visualEnd: "+=200%",
        flowEnd: "+=100%",
        flowScrub: 2,
        flowDuration: 12,
        sec01End: "+=50%",
        sec01Pin: true,
      });
    },
    // 태블릿
    "(min-width: 769px) and (max-width: 1024px)": function () {
      initVisualAnime({
        visualEnd: "+=150%",
        flowEnd: "+=130%",
        flowScrub: 2,
        flowDuration: 12,
        sec01End: "+=40%",
        sec01Pin: true,
      });
    },
    // 모바일 - profile_card
    "(max-width: 768px)": function () {
      initVisualAnime({
        visualEnd: "+=100%",
        flowEnd: "+=140%",
        flowScrub: 2,
        flowDuration: 12,
        sec01End: "+=30%",
        sec01Pin: false,
      });
    },
  });

  // 공통 애니메이션 로직
  function initVisualAnime({ visualEnd, flowEnd, flowScrub, flowDuration, sec01End, sec01Pin }) {
    ScrollTrigger.create({
      trigger: sectionVisual,
      start: "top top",
      end: visualEnd,
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });

    let flowTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: flowSection,
        start: "top-=20% bottom",
        end: "bottom top",
        scrub: flowScrub,
        invalidateOnRefresh: true,
        // markers: "true",
      }
    });

    flowTimeline
      .addLabel("start_move")
      .fromTo(flowBox01, { xPercent: -100 }, { xPercent: 200, duration: flowDuration, ease: "none" }, 'start_move')
      .fromTo(flowBox02, { xPercent: 100 }, { xPercent: -200, duration: flowDuration, ease: "none" }, 'start_move')
      .fromTo([flowBox01, flowBox02], { opacity: 0 }, { opacity: 1, duration: 2 }, 'start_move')
      .to([flowBox01, flowBox02], { opacity: 0, duration: 3 }, 'start_move+=8');

    // flowSection 고정
    ScrollTrigger.create({
      trigger: flowSection,
      start: "top top",
      end: flowEnd,
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });

    // section01 애니메이션 (모바일에서는 profile_card 가 세로 스택 레이아웃이라 생략)
    if (!sec01Pin) return;

    let sec01Timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section01,
        start: 'top top',
        end: sec01End,
        toggleActions: 'play none none reverse',
        pin: true,
        // pinSpacing: false,
        invalidateOnRefresh: true,
        // markers: true,
      },
    });

    sec01Timeline
      .set(".profile_card ._txt", { width: "100%" })
      .set(".profile_card ._txt > *", { opacity: 0 })
      .set(".profile_card", {
        height: () => {
          const txt = document.querySelector(".profile_card ._txt");
          const original = txt.style.width;
          txt.style.width = "70%";
          const h = txt.scrollHeight;
          txt.style.width = original;
          return h;
        },
      })

      .addLabel("label_01")
      .to(".profile_card ._txt", {
        width: "70%",
        duration: 0.8,
        ease: "power2.out"
      }, "label_01")

      .addLabel("label_02")
      .to(".profile_card ._txt > *", {
        opacity: 1,
        duration: 0.6,
        ease: "power1.out"
      }, "label_02");
  }
}
  

function section02_toggle() {
  $('.com_list').removeClass('view');
  $('.com_list .desc_box').hide();

  $('.com_list .btn_toggle')
    .attr('aria-expanded', 'false')
    .find('.sr-only').text('열기');

  $('.com_list .btn_toggle').off('click').on('click', function(e) {
    e.preventDefault();

    const $btn = $(this);
    const $list = $btn.closest('.com_list'); 
    const $descBox = $list.find('.desc_box'); 
    const $srText = $btn.find('.sr-only');
    
    const isExpanded = $btn.attr('aria-expanded') === 'true';

    if (!isExpanded) {
      $list.addClass('view');
      $descBox.stop().slideDown(300, function() {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
      
      $btn.attr('aria-expanded', 'true');
      $srText.text('닫기'); 
    } else {
      $descBox.stop().slideUp(300, function() {
        $list.removeClass('view');
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
    
      $btn.attr('aria-expanded', 'false');
      $srText.text('열기');
    }
  });
}

function section03_toggle() {
  gsap.registerPlugin(ScrollTrigger);

  // 모바일
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const triggerStart = 'top 40%';
  const triggerEnd = 'bottom 40%';

  $('section._03 li').removeClass('view').removeAttr('data-user-opened');
  $('section._03 li ._desc').hide();
  
  $('section._03 li ._title button')
    .attr('aria-expanded', 'false')
    .find('.sr-only').text('열기');

  $('section._03 li').each(function(index, element) {
    const $list = $(element);
    const $btn = $list.find('._title button');
    const $descBox = $list.find('._desc');
    const $srText = $btn.find('.sr-only');

    // 모바일
    if (isMobile) return;

    ScrollTrigger.create({
      trigger: element,
      start: triggerStart,
      end: triggerEnd,
      onEnter: function() {
        if ($list.attr('data-user-opened') === 'true') return;
        $list.addClass('view');
        $descBox.stop().slideDown(300);
        $btn.attr('aria-expanded', 'true');
        $srText.text('닫기');
      },
      onLeave: function() {
        if ($list.attr('data-user-opened') === 'true') return;
        $descBox.stop().slideUp(300, function() {
          $list.removeClass('view');
        });
        $btn.attr('aria-expanded', 'false');
        $srText.text('열기');
      },
      onEnterBack: function() {
        if ($list.attr('data-user-opened') === 'true') return;
        $list.addClass('view');
        $descBox.stop().slideDown(300);
        $btn.attr('aria-expanded', 'true');
        $srText.text('닫기');
      },
      onLeaveBack: function() {
        if ($list.attr('data-user-opened') === 'true') return;
        $descBox.stop().slideUp(300, function() {
          $list.removeClass('view');
        });
        $btn.attr('aria-expanded', 'false');
        $srText.text('열기');
      }
    });
  });

  $('section._03 li ._title button').off('click').on('click', function(e) {
    e.preventDefault();
    
    const $btn = $(this);
    const $list = $btn.closest('section._03 li');
    const $descBox = $list.find('._desc');
    const $srText = $btn.find('.sr-only');
    const isExpanded = $btn.attr('aria-expanded') === 'true';

    if (!isExpanded) {
      $list.addClass('view').attr('data-user-opened', 'true');
      $descBox.stop().slideDown(300);
      $btn.attr('aria-expanded', 'true');
      $srText.text('닫기');
    } else {
      $list.removeAttr('data-user-opened');
      $descBox.stop().slideUp(300, function() {
        $list.removeClass('view');
      });
      $btn.attr('aria-expanded', 'false');
      $srText.text('열기');
    }
  });
}