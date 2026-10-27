// 이미 사용 중인 postcss 설정이 있다면 이 파일은 건너뛰세요.
module.exports = { plugins: [require('autoprefixer'), require('cssnano')({ preset: 'default' })] };
