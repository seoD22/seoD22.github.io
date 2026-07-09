document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('load', function () {
    section02_toggle();
    section03_toggle();
      // 로딩 화면
      // loading();
  });

  // 네비게이션
  // navi();


  // asideBtnEvent(); // 사이드 버튼
  // profileBtn(); // profile 마우스 오버 버튼


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
  const html = document.querySelector('html');

  html.style.overflow = 'hidden'; // 로딩 중 스크롤 방지

  setTimeout(() => {
    load.classList.add('show')

    setTimeout(() => { //  <- 로딩속도 구현
      load.style.opacity = '0';
      html.style.overflow = 'auto'; // 스크롤 방지 해제

      setTimeout(() => {
          load.style.display = 'none';
      }, 400);

    }, 2000);

  }, 1500);
  
};

// 네비게이션
function navi() {
  $('header .nav').click(function () {
    let idx = $(this).index();
    // console.log(idx);
    gsap.to(window,{
        scrollTo: {
            y: $('.move').eq(idx),
            offsetY: 0
        },
        duration: 1,
        ease: 'power2.inOut'
    })
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

  ScrollTrigger.create({
    trigger: sectionVisual,
    start: "top top",
    end: "+=200%",
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });

  let flowTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: flowSection,
      start: "top-=20% bottom",
      end: "bottom top",
      scrub: 2,
      invalidateOnRefresh: true,
      // markers: "true",
    }
  });

  flowTimeline
    .addLabel("start_move")
    .fromTo(flowBox01, { xPercent: -100 }, { xPercent: 200, duration: 12, ease: "none" }, 'start_move')
    .fromTo(flowBox02, { xPercent: 100 }, { xPercent: -200, duration: 12, ease: "none" }, 'start_move')
    .fromTo([flowBox01, flowBox02], { opacity: 0 }, { opacity: 1, duration: 2 }, 'start_move')
    .to([flowBox01, flowBox02], { opacity: 0, duration: 3 }, 'start_move+=8');

  // flowSection 고정
  ScrollTrigger.create({
    trigger: flowSection,
    start: "top top",
    end: "+=100%",
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });

  // section01 애니메이션
  let sec01Timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section01,
      start: 'top top',
      end: "+=50%",
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
      // 1. 슬라이드가 완전히 내려간 후(콜백 함수) refresh 실행
      $descBox.stop().slideDown(300, function() {
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      });
      
      $btn.attr('aria-expanded', 'true');
      $srText.text('닫기'); 
    } else {
      // 2. 슬라이드가 완전히 올라간 후 refresh 실행
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

    ScrollTrigger.create({
      trigger: element,
      start: 'top 40%',
      end: 'bottom 40%',
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
