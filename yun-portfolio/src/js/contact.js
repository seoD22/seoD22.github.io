$(function () {
  if (App.reduce) return;
  var d = App.delay + .1;
  gsap.from('.ph h2', { yPercent: 40, opacity: 0, duration: 1, ease: 'power4.out', delay: d });
  gsap.from('.mail', { opacity: 0, y: 30, duration: .9, ease: 'power3.out', delay: d + .2 });
  gsap.from('.contact-pg dt, .contact-pg dd', { opacity: 0, y: 12, duration: .6, stagger: .05, delay: d + .3 });
});
