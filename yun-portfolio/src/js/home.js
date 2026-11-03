$(function () {
  if (App.reduce) return;
  var d = App.delay + .1, hh = $('header').outerHeight();

  // 2. 키워드: 섹션 고정 → 키워드가 스크롤에 맞춰 차례로 올라옴
  var $kw = $('.kw-row .ln');
  var kwTl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.kw',
      start: 'top ' + $('header').outerHeight() + 'px', // 헤더 바로 아래에 닿으면 고정
      end: '+=' + $kw.length * 50 + '%',                // 키워드 하나당 화면 높이의 50%만큼 스크롤
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true
    }
  });
  $kw.each(function (i) {
    kwTl.fromTo(this, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1 }, i);
  });
  kwTl.to({}, { duration: 0.5 }); // 마지막 키워드가 올라온 뒤 잠깐 머물렀다가 고정 해제

  // 3. about intro: 가운데 모여 있던 이미지가 스크롤에 따라 퍼짐
  var $s = $('.spread-in');
  gsap.from($s.find('.sp-img').toArray(), {
    x: function (i, el) { return $s.width() / 2 - (el.offsetLeft + el.offsetWidth / 2); },
    y: function (i, el) { return $s.height() / 2 - (el.offsetTop + el.offsetHeight / 2); },
    scale: .15, opacity: 0, ease: 'power2.out',
    scrollTrigger: { trigger: '.spread', start: 'top ' + hh + 'px', end: '+=100%', pin: true, scrub: .6, invalidateOnRefresh: true }
  });
  gsap.from('.sp-desc > *', { opacity: 0, y: 30, duration: .9, stagger: .15, scrollTrigger: { trigger: '.sp-desc', start: 'top 80%' } });

  // 4. works: 이미지/텍스트 교차
  $('.wk').each(function () {
    var st = { trigger: this, start: 'top 75%' };
    gsap.fromTo($(this).find('.wk-img')[0], { clipPath: 'inset(0% 0% 100% 0% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.1, ease: 'power3.inOut', clearProps: 'clipPath', scrollTrigger: st });
    gsap.from($(this).find('.wk-img img')[0], { scale: 1.3, duration: 1.4, ease: 'power3.out', scrollTrigger: st });
    gsap.from($(this).find('.wk-txt')[0], { opacity: 0, y: 30, duration: .9, delay: .25, scrollTrigger: st });
  });

  // 6. 큰 이미지: 패럴럭스
  gsap.fromTo('.bn-img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.banner', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.bn-txt > *', { opacity: 0, y: 30, duration: .9, stagger: .15, scrollTrigger: { trigger: '.banner', start: 'top 55%' } });
});
