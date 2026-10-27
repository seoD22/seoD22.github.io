/* 공통: 부드러운 스크롤 / 페이지 전환 / 이메일 복사 */
window.App = { reduce: matchMedia('(prefers-reduced-motion: reduce)').matches, entering: false, delay: 0 };
try { if (sessionStorage.getItem('nav') === '1') { App.entering = true; App.delay = .75; } } catch (e) {}

$(function () {
  gsap.registerPlugin(ScrollTrigger);
  var $cover = $('#cover');

  // 현재 페이지 메뉴 활성화
  $('header nav a[data-n="' + $('body').data('page') + '"]').addClass('on');

  // 부드러운 스크롤 (Lenis)
  if (window.Lenis && !App.reduce) {
    var lenis = new Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // 페이지 진입: 덮고 있던 패널을 걷어내기
  if (App.entering) {
    gsap.set($cover, { y: 0 });
    $('html').removeClass('is-nav');
    sessionStorage.removeItem('nav');
    gsap.to($cover, { y: '-101%', duration: .7, ease: 'power3.inOut', delay: .05 });
  }

  // 페이지 이동: 패널이 올라온 뒤 이동
  $(document).on('click', 'a[href$=".html"]', function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || App.reduce) return;
    var href = $(this).attr('href');
    if (href === location.pathname.split('/').pop()) { e.preventDefault(); return; }
    e.preventDefault();
    try { sessionStorage.setItem('nav', '1'); } catch (err) {}
    gsap.fromTo($cover, { y: '101%' }, { y: 0, duration: .6, ease: 'power3.inOut', onComplete: function () { location.href = href; } });
  });
  $(window).on('pageshow', function (e) { if (e.originalEvent.persisted) gsap.set($cover, { y: '101%' }); });

  // 이메일 복사
  $(document).on('click', '[data-copy]', function () {
    var t = $(this).data('copy');
    try { navigator.clipboard.writeText(t); } catch (e) {
      var $x = $('<textarea>').val(t).appendTo('body'); $x[0].select();
      try { document.execCommand('copy'); } catch (_) {} $x.remove();
    }
    gsap.timeline().to('#toast', { opacity: 1, y: 0, duration: .3 }).to('#toast', { opacity: 0, y: 20, duration: .3, delay: 1.4 });
  });

  // 하단 Contact 섹션
  if (!App.reduce && $('.ct').length) {
    gsap.from('.ct h2 .ln > span', { yPercent: 110, duration: 1.1, stagger: .12, ease: 'power4.out', scrollTrigger: { trigger: '.ct', start: 'top 70%' } });
  }

  // marquee: 왼쪽 → 오른쪽
  $('.marquee-container').each(function () {
    var $c = $(this), $track = $c.find('.marquee-track'), base = $track.html(), tween;

    function build() {
      if (tween) tween.kill();
      $track.html(base);
      while ($track.width() < $c.width()) $track.append(base);   // 한 세트가 화면보다 길어지게 반복
      $track.append($track.html());                              // 같은 세트를 한 번 더 붙여 이음새 제거
      if (App.reduce) return;
      var speed = Number($c.data('speed')) || 80;                // px/초
      tween = gsap.fromTo($track[0], { xPercent: -50 }, { xPercent: 0, duration: ($track.width() / 2) / speed, ease: 'none', repeat: -1 });
    }

    (document.fonts ? document.fonts.ready : Promise.resolve()).then(build);  // 웹폰트 로딩 후 폭 계산
    var t; $(window).on('resize', function () { clearTimeout(t); t = setTimeout(build, 200); });
  });
});