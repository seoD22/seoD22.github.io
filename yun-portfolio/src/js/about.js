$(function () {
  if (App.reduce) return;
  var d = App.delay + .1, hh = $('header').outerHeight();

  gsap.from('.ph h1', { yPercent: 40, opacity: 0, duration: 1, ease: 'power4.out', delay: d });
  gsap.from('.me-lead', { opacity: 0, y: 20, duration: .9, delay: d + .2 });
  gsap.from('.avatar', { scale: .6, opacity: 0, duration: 1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.me-ring', start: 'top 80%' } });
  gsap.from('.me-ring .rule', { scaleX: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.me-ring', start: 'top 80%' } });
  gsap.from('.me-cols .grp', { opacity: 0, y: 30, duration: .8, stagger: .15, scrollTrigger: { trigger: '.me-cols', start: 'top 80%' } });

  // 내가 좋아하는 것: 가로 스크롤 (데스크톱)
  if (innerWidth > 760) {
    var tr = $('.likes-track')[0], dist = function () { return tr.scrollWidth - innerWidth; };
    gsap.to(tr, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: '.likes', start: 'top ' + hh + 'px', end: function () { return '+=' + dist(); }, pin: true, scrub: .6, invalidateOnRefresh: true } });
  }

  // experience: 불규칙 배치 + 속도 차이
  $('.ex').each(function (i) {
    gsap.from(this, { opacity: 0, y: 60, duration: .9, scrollTrigger: { trigger: this, start: 'top 88%' } });
    gsap.to(this, { yPercent: (i % 2 ? -1 : 1) * 6, ease: 'none', scrollTrigger: { trigger: this, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
});
