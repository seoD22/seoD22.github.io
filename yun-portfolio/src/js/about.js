$(function () {
  if (App.reduce) return;
  var d = App.delay + .1, hh = $('header').outerHeight();

  gsap.from('.ph h2', { yPercent: 40, opacity: 0, duration: 1, ease: 'power4.out', delay: d });
  gsap.from('.ph-sub', { opacity: 0, y: 20, duration: .9, delay: d + .2 });
  gsap.from('.avatar', { scale: .6, opacity: 0, duration: 1, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.me-wrap', start: 'top 80%' } });
  gsap.from('.me .grp', { '--s': 0, duration: 1.2, ease: 'power3.out', stagger: .15, scrollTrigger: { trigger: '.me-wrap', start: 'top 80%' } });
  gsap.from('.me .grp > h3, .me .grp > ul', { opacity: 0, y: 20, duration: .8, stagger: .08, scrollTrigger: { trigger: '.me-wrap', start: 'top 80%' } });

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
