$(function() {
  const elementsToLoad = {
    "#header": "/includes/header.html",
    "#footer": "/includes/footer.html",
  };

  $.each(elementsToLoad, function(selector, url) {
    $(selector).load(url, function(response, status, xhr) {
      if (status === "error") {
        console.error(`Failed to load ${url}: ${xhr.status} ${xhr.statusText}`);
      } 
      if (status === "success") {
        if (selector === "#header") {
          // initNavigation();
          console.log("헤더 로드 완료 및 이벤트 바인딩");
        }
        if (selector === "#footer") {
          console.log("푸터 로드 완료");
        }
      }
    });
  });
});

// 헤더 관련 이벤트
function initNavigation() {
  $('.btn-menu').on('click', function() {
    $('.gnb').toggleClass('active');
  });
}