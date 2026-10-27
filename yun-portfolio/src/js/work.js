$(function () {
  if (App.reduce) return;
  var d = App.delay + .1;
  gsap.from('.ph h1, .ph .ph-sub', { yPercent: 30, opacity: 0, duration: 1, stagger: .15, ease: 'power4.out', delay: d });
  $('.pj-g figure').each(function () {
    var st = { trigger: this, start: 'top 85%' };
    gsap.fromTo(this, { clipPath: 'inset(0% 0% 100% 0% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath', scrollTrigger: st });
    gsap.from($(this).find('img')[0], { scale: 1.25, duration: 1.3, ease: 'power3.out', scrollTrigger: st });
  });
  $('.co-h, .pj-t').each(function () {
    gsap.from(this, { opacity: 0, y: 30, duration: .8, scrollTrigger: { trigger: this, start: 'top 88%' } });
  });
});
