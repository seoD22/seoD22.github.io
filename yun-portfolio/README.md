# Yun Seo Hee Portfolio (seohee 프로젝트에 합치기)
- 루트: index / about / work / contact .html
- src/scss/main.scss (+ 파트셜) → `npm run sass:main` → css/main.css → `npm run postcss:main` → css/main.min.css
- src/js/common.js + 페이지별 js (jQuery, GSAP, Lenis는 CDN)
- images/*.svg 는 임시 이미지입니다. 같은 이름의 jpg/webp로 교체하고 HTML의 확장자만 바꿔 주세요.
- postcss.config.js 가 없을 때만 추가하세요.
- package.json 의 serve 에 "src/js/*.js", "images/*" 를 --files 에 추가하면 JS/이미지 변경도 자동 새로고침됩니다.
