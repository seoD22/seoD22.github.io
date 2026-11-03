$(function () {
  // ───── 팝업(dialog): 모션 설정과 무관하게 동작 ─────
  var $html = $('html');
  $(document).on('click', '[data-modal]', function () {
    var dlg = document.getElementById($(this).data('modal'));
    if (!dlg) return;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');   // 구형 브라우저 대비
    $html.addClass('modal-open');
  });
  $(document).on('click', 'dialog.md', function (e) { if (e.target === this) this.close(); });       // 배경 클릭 시 닫기
  $(document).on('click', 'dialog.md .md-close', function () { $(this).closest('dialog')[0].close(); });
  $('dialog.md').on('close', function () { $html.removeClass('modal-open'); });                       // Esc/닫기 모두 처리
  // Notion 링크를 쓰려면: 팝업 안 .md-link 의 href를 바꾸고 hidden 속성을 지우세요.

  if (App.reduce) return;
  var d = App.delay + .1;

  gsap.from('.ph h2, .ph .ph-sub', { yPercent: 30, opacity: 0, duration: 1, stagger: .15, ease: 'power4.out', delay: d });

  // 공통 개선 활동
  gsap.from('.impact-grid li', { opacity: 0, y: 30, duration: .8, stagger: .1, scrollTrigger: { trigger: '.impact-grid', start: 'top 85%' } });

  // 이미지
  $('.pj-g figure').each(function () {
    var st = { trigger: this, start: 'top 85%' };
    gsap.fromTo(this, { clipPath: 'inset(0% 0% 100% 0% round 16px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1, ease: 'power3.inOut', clearProps: 'clipPath', scrollTrigger: st });
    gsap.from($(this).find('img')[0], { scale: 1.25, duration: 1.3, ease: 'power3.out', scrollTrigger: st });
  });

  gsap.from('.stat', { opacity: 0, y: 24, duration: .7, stagger: .12, scrollTrigger: { trigger: '.pj-stats', start: 'top 85%' } });
  gsap.from('.task-list li', { opacity: 0, y: 16, duration: .6, stagger: .06, scrollTrigger: { trigger: '.task-list', start: 'top 88%' } });

  $('.co-h, .pj-t, .sub-t').each(function () {
    gsap.from(this, { opacity: 0, y: 30, duration: .8, scrollTrigger: { trigger: this, start: 'top 88%' } });
  });
});