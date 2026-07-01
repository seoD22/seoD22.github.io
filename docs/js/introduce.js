document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('load', function () {
      // 로딩 화면
      // loading();
  });

  // 네비게이션
  // navi();


  // asideBtnEvent(); // 사이드 버튼
  // profileBtn(); // profile 마우스 오버 버튼

  // 포트폴리오 스와이퍼
  // portfolioSwiper();

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

// 바닥에 오면 사이트 버튼 없어짐
function asideBtnNone() {
  var scrollTop = $(window).scrollTop();
  var innerHeight = $(window).innerHeight();
  var scrollHeight = $(document).height();

  if (scrollTop + innerHeight >= scrollHeight) {
      $('aside').addClass('end');
  } else {
      $('aside').removeClass('end');
  }
}

// 포트폴리오 스와이퍼
function portfolioSwiper() {
  const asideBtn = document.querySelector('aside');
  // html 클래스 유무에 따라 autoplay 실행
  asideBtn.addEventListener('click', (e) => {
    if ($('html').hasClass('show')) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  })

  var swiper = new Swiper(".port_swiper", {
    direction: "vertical",
    slidesPerView: 2,
    spaceBetween: 0,
    centeredSlides: true,
    loop: true,
    mousewheel: true,
    speed: 600,
    autoplay: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 1.2,
        spaceBetween: 30,
      },
      1600: {
        slidesPerView: 1.4,
        spaceBetween: 30,
      },
      1900: {
        slidesPerView: 1.7,
        spaceBetween: 30,
      },
    },
    on: {
      slideChange: function() {
        // 페이징
        if (window.innerWidth >= 769) {
          $('.portfolio .pagi .lineWrap span').css({
            'left': '0',
            'top': `${(this.realIndex) * 20}%`
          });
      } else {
        $('.portfolio .pagi .lineWrap span').css({
          'top': '0',
          'left': `${(this.realIndex) * 20}%`
        });
      }
      },

      slideChangeTransitionEnd: function () {
        if(this.realIndex == 0){
          v1motion.play();

          // 초기화
          v2motion.progress(0);
          v2motion.pause();

          v5motion.progress(0);
          v5motion.pause();
          
        }else if(this.realIndex == 1){
            v2motion.play();

            // 초기화
            v1motion.progress(0);
            v1motion.pause();

            v3motion.progress(0);
            v3motion.pause();

        }else if(this.realIndex == 2){
          v3motion.play();

          // 초기화
          v2motion.progress(0);
          v2motion.pause();

          v4motion.progress(0);
          v4motion.pause();

        }else if(this.realIndex == 3){
          v4motion.play();

          // 초기화
          v5motion.progress(0);
          v5motion.pause();

          v3motion.progress(0);
          v3motion.pause();
        }else if(this.realIndex == 4){
          v5motion.play();

          // 초기화
          v1motion.progress(0);
          v1motion.pause();

          v4motion.progress(0);
          v4motion.pause();
        }
      },
    }
  });

  // 스와이퍼 anime
  let v1Tit = '.portfolio .swiper-slide._01 .port_des h3';
  let v1Btn = '.portfolio .swiper-slide._01 .port_des .btn';
  let v1top = '.portfolio .swiper-slide._01 .top';
  let v1tag = '.portfolio .swiper-slide._01 .tag_box';
  let v1bar = '.portfolio .swiper-slide._01 .top .bar';

  gsap.set(v1Tit, { opacity: 0, xPercent: -20 });
  gsap.set(v1Btn, { opacity: 0, xPercent: -20 });
  gsap.set(v1top, { opacity: 0 });
  gsap.set(v1tag, { opacity: 0 });
  gsap.set(v1bar, { width: 0 });

  let v1motion = gsap.timeline();

  v1motion
    .addLabel('label_01')
    .to(v1top, { opacity: 1, duration: .8}, "label_01" )
    .to(v1tag, { opacity: 1, duration: .8}, "label_01" )
    .to(v1bar, { width: '100%', delay: .2}, "label_01" )
    .to(v1Tit, { opacity: 1, xPercent: 0, duration: .8, delay: .2}, "label_01")
    .to(v1Btn, { opacity: 1, xPercent: 0, duration: .8}, "-=50%" )


  // visual2
  let v2Tit = '.portfolio .swiper-slide._02 .port_des h3';
  let v2Btn = '.portfolio .swiper-slide._02 .port_des .btn';
  let v2top = '.portfolio .swiper-slide._02 .top';
  let v2tag = '.portfolio .swiper-slide._02 .tag_box';
  let v2bar = '.portfolio .swiper-slide._02 .top .bar';

  gsap.set(v2Tit, { opacity: 0, xPercent: -20 });
  gsap.set(v2Btn, { opacity: 0, xPercent: -20 });
  gsap.set(v2top, { opacity: 0 });
  gsap.set(v2tag, { opacity: 0 });
  gsap.set(v2bar, { width: 0 });

  let v2motion = gsap.timeline();

  v2motion
    .addLabel('label_01')
    .to(v2top, { opacity: 1, duration: .8}, "label_01" )
    .to(v2tag, { opacity: 1, duration: .8}, "label_01" )
    .to(v2bar, { width: '100%', delay: .2}, "label_01" )
    .to(v2Tit, { opacity: 1, xPercent: 0, duration: .8, delay: .2}, "label_01")
    .to(v2Btn, { opacity: 1, xPercent: 0, duration: .8}, "-=50%" )

  v2motion.pause();

  // visual3
  let v3Tit = '.portfolio .swiper-slide._03 .port_des h3';
  let v3Btn = '.portfolio .swiper-slide._03 .port_des .btn';
  let v3top = '.portfolio .swiper-slide._03 .top';
  let v3tag = '.portfolio .swiper-slide._03 .tag_box';
  let v3bar = '.portfolio .swiper-slide._03 .top .bar';

  gsap.set(v3Tit, { opacity: 0, xPercent: -20 });
  gsap.set(v3Btn, { opacity: 0, xPercent: -20 });
  gsap.set(v3top, { opacity: 0 });
  gsap.set(v3tag, { opacity: 0 });
  gsap.set(v3bar, { width: 0 });

  let v3motion = gsap.timeline();

  v3motion
    .addLabel('label_01')
    .to(v3top, { opacity: 1, duration: .8}, "label_01" )
    .to(v3tag, { opacity: 1, duration: .8}, "label_01" )
    .to(v3bar, { width: '100%', delay: .2}, "label_01" )
    .to(v3Tit, { opacity: 1, xPercent: 0, duration: .8, delay: .2}, "label_01")
    .to(v3Btn, { opacity: 1, xPercent: 0, duration: .8}, "-=50%" )

  v3motion.pause();

  // visual4
  let v4Tit = '.portfolio .swiper-slide._04 .port_des h3';
  let v4Btn = '.portfolio .swiper-slide._04 .port_des .btn';
  let v4top = '.portfolio .swiper-slide._04 .top';
  let v4tag = '.portfolio .swiper-slide._04 .tag_box';
  let v4bar = '.portfolio .swiper-slide._04 .top .bar';

  gsap.set(v4Tit, { opacity: 0, xPercent: -20 });
  gsap.set(v4Btn, { opacity: 0, xPercent: -20 });
  gsap.set(v4top, { opacity: 0 });
  gsap.set(v4tag, { opacity: 0 });
  gsap.set(v4bar, { width: 0 });

  let v4motion = gsap.timeline();

  v4motion
    .addLabel('label_01')
    .to(v4top, { opacity: 1, duration: .8}, "label_01" )
    .to(v4tag, { opacity: 1, duration: .8}, "label_01" )
    .to(v4bar, { width: '80%', delay: .2}, "label_01" )
    .to(v4Tit, { opacity: 1, xPercent: 0, duration: .8, delay: .2}, "label_01")
    .to(v4Btn, { opacity: 1, xPercent: 0, duration: .8}, "-=50%" )

  v4motion.pause();

  // visual5
  let v5Tit = '.portfolio .swiper-slide._05 .port_des h3';
  let v5Btn = '.portfolio .swiper-slide._05 .port_des .btn';
  let v5top = '.portfolio .swiper-slide._05 .top';
  let v5tag = '.portfolio .swiper-slide._05 .tag_box';
  let v5bar = '.portfolio .swiper-slide._05 .top .bar';

  gsap.set(v5Tit, { opacity: 0, xPercent: -20 });
  gsap.set(v5Btn, { opacity: 0, xPercent: -20 });
  gsap.set(v5top, { opacity: 0 });
  gsap.set(v5tag, { opacity: 0 });
  gsap.set(v5bar, { width: 0 });

  let v5motion = gsap.timeline();

  v5motion
    .addLabel('label_01')
    .to(v5top, { opacity: 1, duration: .8}, "label_01" )
    .to(v5tag, { opacity: 1, duration: .8}, "label_01" )
    .to(v5bar, { width: '50%', delay: .2}, "label_01" )
    .to(v5Tit, { opacity: 1, xPercent: 0, duration: .8, delay: .2}, "label_01")
    .to(v5Btn, { opacity: 1, xPercent: 0, duration: .8}, "-=50%" )

  v5motion.pause();
}

// gsap anime
function visual() {
  const section01 = document.querySelector('section._01');
  const flowSection = document.querySelector('section._flow');
  const section02 = document.querySelector('section._02');
  
  const flowBox01 = document.querySelector('section._flow .flow_inner .flow_wrap._01');
  const flowBox02 = document.querySelector('section._flow .flow_inner .flow_wrap._02');

  ScrollTrigger.create({
    trigger: section01,
    start: "top top",
    end: "+=500%",
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });

  let masterTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: flowSection,
      start: "top-=20% bottom",
      end: "bottom top",
      scrub: 2,
      invalidateOnRefresh: true,
      // markers: "true",
    }
  });

  masterTimeline
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

  // section02 애니메이션
  gsap.from(section02, {
    yPercent: 100,
    scrollTrigger: {
      trigger: flowSection,
      start: "top top",
      end: "+=100%",
      scrub: 2,
      invalidateOnRefresh: true,
    }
  });

  // section02 카드 겹침
  const $cards = $('.coverletter_list li');

  $cards.each(function(index, card) {
    gsap.set(card, { zIndex: index + 1 });

    if (index > 0) {
      gsap.fromTo(card, 
        { 
          marginTop: "0" 
        }, 
        {
          marginTop: "-80px", 
          scrollTrigger: {
            trigger: card,
            start: "top 80%", 
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
            // markers: true,
          }
        }
      );
    }
  });
}

// function visualRespon() {
//   const section01 = document.querySelector('section._01');
//   const sectionImg = document.querySelector('section._01 .logo_group');
//   const flowBox01 = document.querySelector('section._01 .flow_wrap .flow_box._01');
//   const flowBox02 = document.querySelector('section._01 .flow_wrap .flow_box._02');

//   let flowAnime = gsap.timeline({
//     scrollTrigger: {
//       trigger: section01,
//       start: "top top",
//       end: "+=250%",
//       pin: true,
//       scrub: 2,
//       // markers: true,
//       invalidateOnRefresh: true,
//     },
//   });

//   flowAnime
//   .set(flowBox01, {xPercent: -110})
//   .set(flowBox02, {xPercent: 110})

//   .to(sectionImg, {opacity: 1, duration: 5})
//   .addLabel("label_01")
//   .to(sectionImg, {opacity: 0, duration: 5, delay: 3}, 'label_01')
//   .to(flowBox01, {xPercent: 123, duration: 30,}, 'label_01-=4')
//   .to(flowBox02, {xPercent: -123, duration: 30,}, 'label_01-=4')
//   .addLabel("label_02")
//   .to(flowBox01, {opacity: 0, duration: 5}, 'label_02-=2')
//   .to(flowBox02, {opacity: 0, duration: 5}, 'label_02-=2')
// }

// function sec01Fix() {
//   const section01 = document.querySelector('section._01');

//   ScrollTrigger.create({ // sticky
//     trigger: section01,
//     start: 'top top',
//     end: '+=200%',
//     pin: true,
//     pinSpacing : false,
//     scrub: 2,
//     // markers: true,
//     invalidateOnRefresh: true,
//   });
// }

// function sec02Fix() {
//   const section02 = document.querySelector('section._02');
//   const section02_tbx = document.querySelector('section._02 .tbx');
//   const profileImg = document.querySelector('section._02 .img_part');
//   const profileImg_01 = document.querySelector('section._02 .img_part .img-box._01');
//   const profileImg_02 = document.querySelector('section._02 .img_part .img-box._02');
//   const profileWord = document.querySelector('section._02 .word_group');
//   const profileTag01 = document.querySelector('section._02 .des_group .tag._01');
//   const profileTag02 = document.querySelector('section._02 .des_group .tag._02');
//   const profileTag03 = document.querySelector('section._02 .des_group .tag._03');
//   const profileH3 = document.querySelector('section._02 .des_group h3 span');
//   const profileTxt = document.querySelector('section._02 .des_group p span');


//   // 섹션 고정
//   ScrollTrigger.create({
//     trigger: section02,
//     start: 'top top',
//     end: '+=200%', // 고정이 풀리는 지점
//     pin: true,
//     scrub: 2,
//     // markers: true, // 디버그용 마커
//     invalidateOnRefresh: true,
//   });

//   // 애니메이션
//   let section02Anime = gsap.timeline({
//     scrollTrigger: {
//       trigger: section02_tbx,
//       start: 'top+=20% top',
//       end: '+=100%',
//       // pin: true,
//       // markers: true,
//       toggleActions: "play none none reverse",
//       invalidateOnRefresh: true,
//     },
//   });

//   section02Anime
//     .addLabel("label_01")
//     .to(profileImg, {rotationY: "180deg", duration: .5}, "label_01")
//     .to(profileImg_01, {opacity: 0, duration: .5}, "label_01")
//     .to(profileImg_02, {opacity: 1, duration: .5}, "label_01")
//     .to(profileWord, {opacity: 0, zIndex: 0, duration: 1}, "label_01")
//     .to(profileTag01, {y: 0, duration: .3, delay: .1}, "-=.5")
//     .to(profileTag02, {y: 0, duration: .3}, "-=.2")
//     .to(profileTag03, {y: 0, duration: .3}, "-=.2")
//     .to(profileH3, {y: 0, duration: .3})
//     .to(profileTxt, {y: 0, duration: .3});
// }
// function sec02FixRespon() {
//   const section02 = document.querySelector('section._02');
//   const section02_tbx = document.querySelector('section._02 .tbx');
//   const profileImg = document.querySelector('section._02 .img_part');
//   const profileImg_01 = document.querySelector('section._02 .img_part .img-box._01');
//   const profileImg_02 = document.querySelector('section._02 .img_part .img-box._02');
//   const profileWord = document.querySelector('section._02 .word_group');
//   const profileTag01 = document.querySelector('section._02 .des_group .tag._01');
//   const profileTag02 = document.querySelector('section._02 .des_group .tag._02');
//   const profileTag03 = document.querySelector('section._02 .des_group .tag._03');
//   const profileH3 = document.querySelector('section._02 .des_group h3 span');
//   const profileTxt = document.querySelector('section._02 .des_group p span');


//   // 섹션 고정
//   ScrollTrigger.create({
//     trigger: section02,
//     start: 'top top',
//     end: '+=200%', // 고정이 풀리는 지점
//     pin: true,
//     scrub: 2,
//     // markers: true,
//     invalidateOnRefresh: true,
//   });

//   // 애니메이션
//   let section02Anime = gsap.timeline({
//     scrollTrigger: {
//       trigger: section02_tbx,
//       start: 'top+=20% top',
//       end: '+=100%',
//       // pin: true,
//       // markers: true,
//       toggleActions: "play none none reverse",
//       invalidateOnRefresh: true,
//     },
//   });

//   section02Anime
//     .addLabel("label_01")
//     .to(profileImg, {rotationY: "180deg", duration: .5}, "label_01")
//     .to(profileImg_01, {opacity: 0, duration: .5}, "label_01")
//     .to(profileImg_02, {opacity: 1, duration: .5}, "label_01")
//     .to(profileWord, {opacity: 0, zIndex: 0, duration: 1}, "label_01")
//     .to(profileTag01, {y: 0, duration: .3, delay: .1}, "-=.5")
//     .to(profileTag02, {y: 0, duration: .3}, "-=.2")
//     .to(profileTag03, {y: 0, duration: .3}, "-=.2")
//     .to(profileH3, {y: 0, duration: .3})
//     .to(profileTxt, {y: 0, duration: .3})
//     .to(profileTag01, {backgroundColor: '#6974EB', color: '#fff', duration: .5, delay: .1}, "-=.5")
//     .to(profileTag02, {backgroundColor: '#EC5E44', color: '#fff', duration: .5}, "-=.2")
//     .to(profileTag03, {backgroundColor: '#3AF563', color: '#fff', duration: .5}, "-=.2");
// }

// function sec03Anime() {
//   const section03 = document.querySelector('section._03')
//   const logo = document.querySelector('section._03 .logo_group')
//   const contact = document.querySelector('section._03 .contact')

//   // 애니메이션
//   let section03Anime = gsap.timeline({
//     scrollTrigger: {
//       trigger: section03,
//       start: 'top top+=30%',
//       end: '+=100%',
//       // pin: true,
//       // markers: true,
//       toggleActions: "play none none reverse",
//       invalidateOnRefresh: true,
//     },
//   });

//   section03Anime
//     .addLabel("label_01")
//     .to(logo, {y: 0, duration: .3}, "label_01")
//     .to(contact, {y: 0, duration: .3}, "-=70%")

// }
