  // 글리치 효과
  PowerGlitch.glitch('#win-monkey .img_wrapper', {
    playMode: 'hover',
    createContainers: true,
    hideOverflow: false,
    timing: {
      duration: 500,
      iterations: 1,
    },
    glitchTimeSpan: {
      start: 0,
      end: 1,
    },
    shake: {
      velocity: 15, // 얼마나 세게 흔들릴지
      amplitudeX: 0.01, // 좌우 흔들림 강도
      amplitudeY: 0.01, // 상하 흔들림 강도
    },
    slice: {
      count: 8, // 이미지가 몇 조각으로 쪼개져 보일지
      velocity: 15,
      minHeight: 0.02,
      maxHeight: 0.15,
      showVisualDebug: false,
      hueRotate: true, // 색상까지 지직거리게
    },
  });
  
  const $wrap = $('.wrap');

  // 초기 실행
  introAnimation();

  // 커서
  mouseCursorEvent();
  // 시계
  realTime();
  setInterval(realTime, 1000);
  // 타이핑 효과 
  resetAndPlay();
  const typingTimer = setInterval(resetAndPlay, 4000);
  // 체크박스 확인 시 버튼 활성화
  checkedBtn();
  // 인트로 팝업 닫기
  $('#win-intro .checked_btn, #win-intro.window_container .btn_box.close').on('click', function() {
    const $targetWin = $(this).closest('.window_container');
    const targetId = $targetWin.attr('id');

    if (targetId) {
      const stateClass = 'is-' + targetId;
      $wrap.removeClass(stateClass);
      $targetWin.hide();
    }
  });
  // 아이콘 이벤트
  iconClickEvent();
  // 탭 이벤트
  tabEvent();

  // 인트로 팝업 버튼
  $('.active_resume').on('click', function() { // 윤서희 간략소개
    $('button[data-target="win-resume"]').trigger('click');
  });

  //////////
  function introAnimation () {
    const $wrap = $('.wrap');
    const $loader = $('.loading_bar');
    const blockWidth = 8;
    const gap = 2;

    function startBooting() {
      $wrap.addClass('is-booting');
      $('#win-boot').show();

      const containerWidth = $loader.width();
      const totalBlocks = Math.floor((containerWidth + gap) / (blockWidth + gap));
      let currentBlock = 0;

      function getRandomTime(progress) {
        const percent = (progress / totalBlocks) * 100;

        if (percent < 30) {
          return Math.random() * 100 + 50;
        } else if (percent < 80) {
          return Math.random() * 200 + 100;
        } else if (percent < 95) {
          return Math.random() * 400 + 300;
        } else {
          return Math.random() * 200 + 100;
        }
      }

      function addBlock() {
        if (currentBlock < totalBlocks) {
          $loader.append('<div class="block"></div>');
          currentBlock++;

          const nextTime = getRandomTime(currentBlock);
          setTimeout(addBlock, nextTime);
        } else {
          setTimeout(endBooting, 600);
        }
      }
      // 첫 번째 블록 시작
      addBlock();
    }

    function endBooting() {
      $wrap.removeClass('is-booting').addClass('is-intro');
      $('#win-boot').hide();
      if (typeof winControl === 'function') winControl('#win-intro', 'open');
      if (typeof checkedBtn === 'function') checkedBtn();
    }

    startBooting();
  };

  function startBooting() {
    $wrap.addClass('is-booting');
    const $loader = $('.loading_bar');
    
    //로딩바 애니메이션
    $loader.animate({ width: '100%' }, 3000, function() {
      endBooting();
    });
  }

  function endBooting() {
    $wrap.removeClass('is-booting');
    $wrap.addClass('is-intro');

    // 인트로 팝업 열기
    if (typeof winControl === 'function') {
      winControl('#win-intro', 'open');
    }
    
    // 체크박스 감시
    if (typeof checkedBtn === 'function') {
      checkedBtn();
    }
  }

  function mouseCursorEvent() {
    const $cursor = $('#cursor');

    $(document).on('mousemove', function(e) {
      $cursor.css({
        left: e.clientX - 5 + 'px',
        top: e.clientY - 3 + 'px'
      });
    });

    $('button.clickable').on({
      'mouseenter': function() {
        $cursor.stop().fadeIn(100);
      },
      'mouseleave': function() {
        $cursor.stop().fadeOut(100);
      }
    });
  };

  function winControl(target, action) {
    const $targetWin = $(target);

    if (action === 'open') {
      $targetWin.show();
      $('.window_container').css('z-index', 1);
      $targetWin.css('z-index', 99);
    } 
    else if (action === 'close') {
      $targetWin.hide();
    }
  }

  function iconClickEvent() {
    const $wrap = $('.wrap');

    // 1. 창 열기
    $('.icon_box').off('click').on('click', function() {
      const targetId = $(this).data('target');
      const stateClass = 'is-' + targetId;
      
      if (typeof winControl === 'function') {
        winControl('#' + targetId, 'open');
      }

      $wrap.addClass(stateClass);
    });

    // 2. 창 닫기
    $(document).off('click', '.window_container .close').on('click', '.window_container .close', function(e) {
      e.preventDefault();
      e.stopPropagation(); // 🌟 이벤트가 부모로 퍼지는 걸 막음

      // 1. 클릭된 버튼에서 가장 가까운 윈도우(ID가 있는 놈)를 찾음
      const $targetWin = $(this).closest('.window_container');
      const targetId = $targetWin.attr('id');

      if (targetId) {
          // 2. 창 닫기 함수 호출 (ID 앞에 # 붙여서 전달)
          if (typeof winControl === 'function') {
              winControl('#' + targetId, 'close');
          }

          // 3. wrap에 붙은 해당 창 전용 클래스만 제거
          $('.wrap').removeClass('is-' + targetId);
      }
      
      return false;
    });
  }
  
  // 창 클릭 시 해당 창 맨 위로
  // $('.window_container').on('mousedown', function() {
  //   $('.window_container').css('z-index', 1);
  //   $(this).css('z-index', 99);
  // });

  function resetAndPlay() {
    const target = document.querySelector('#speech');
    if (!target) return;

    target.innerText = '';
    
    TypeHangul.type('#speech', {
      text: '안녕하세요!', 
      intervalType: 80,
      humanize: 1
    });
  }

  function realTime() {
    const now = new Date();

    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    
    document.getElementById('hour').innerText = `${h}`;
    document.getElementById('minute').innerText = `${m}${ampm}`;

    const dayIcon = document.querySelector('.day');
    const nightIcon = document.querySelector('.night');

    if (ampm === 'AM') {
      dayIcon.style.display = 'block';
      nightIcon.style.display = 'none';
    } else {
      dayIcon.style.display = 'none';
      nightIcon.style.display = 'block';
    }
  }

  function checkedBtn() {
    const $checkbox = $('#show_startup');
    const $enterBtn = $('.checked_btn');
    const $closeBtn = $('#win-intro .bar_btns .close');

    $checkbox.on('change', function() {
      if ($(this).is(':checked')) {
        $enterBtn.prop('disabled', false);
        $closeBtn.prop('disabled', false);
      } else {
        $enterBtn.prop('disabled', true);
        $closeBtn.prop('disabled', true);
      }
    });

    if ($checkbox.is(':checked')) {
      $enterBtn.prop('disabled', false);
      $closeBtn.prop('disabled', false);
    }
  }

  function tabEvent() {
    const tabButtons = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetPanelId = btn.getAttribute('aria-controls');

        // 1. 모든 버튼 비활성화
        tabButtons.forEach(tab => {
          tab.setAttribute('aria-selected', 'false');
          tab.setAttribute('tabindex', '-1');
        });

        // 2. 모든 패널 숨기기
        tabPanels.forEach(panel => {
          panel.classList.add('_hidden');
          // panel.hidden = true;
        });

        // 3. 선택된 요소 활성화
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
        
        const targetPanel = document.getElementById(targetPanelId);
        targetPanel.classList.remove('_hidden');
        // targetPanel.hidden = false;
      });
    });
  }
