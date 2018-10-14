/*本地编译配置*/
fis.set('project.files', ['web/**']);

fis.match(/\/web\/(.*)/i, {
  release: '/static/$1', /*所有资源发布时产出到 /static 目录下*/
  url: '/static/$1' /*所有资源访问路径设置*/
});

fis.match('::package', {
  postpackager: [
    fis.plugin('simplify')
  ],
});

//MD5 戳
fis.match('*.{css,js,es6}', {
  useHash: true
});

//排除min.js
fis.match(/.*\/+(?:(?!\.min).)+\.(?:js|es6)$/i, {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js',{
    sourceMap: true
  })
});

////排除min.css
fis.match(/.*\/+(?:(?!\.min).)+\.css$/i, {
  // 给匹配到的文件分配属性 `useSprite`
  useSprite: true,
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

//压缩html
fis.match('*.html', {
  optimizer: fis.plugin('htmlmin', {
    minifyJS: false,
    minifyCSS: false,
    ignoreCustomComments: [/ignore/i,/delete/i, /STYLE_PLACEHOLDER/i]
  })
});

// 压缩 index.html 内联的 css
fis.match('**.html:css', {
  optimizer: fis.plugin('clean-css')
});

// 压缩 index.html 内联的 js
fis.match('**.html:js', {
  optimizer: fis.plugin('uglify-js')
});

/*图片文件域名配置*/
fis.match('*.{jpg,png,jpeg,gif,webp}', {
  useHash: true
});
