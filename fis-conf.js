
/*配置选项
-------------------------*/
// 测试域名
fis.set("cdn-path", "http://10.0.0.26:8087/example-managementsite");

// 正式环境域名
fis.set("cdn-path-release", "http://www.example.com");

// 推送到远端的域名
fis.set("cdn-path-push", "http://10.0.0.26/res");
fis.set("http-push-receiver", "http://10.0.0.26/receiver.php");
fis.set("http-push-to", "/usr/share/nginx/html/res");

/*用户自定义配置
-------------------------*/
// 打包go文件
fis.match("src/js/go.**.{coffee,js}", {
  packTo: "src/pkg/go.js"
});

/*统一配置
(开发者无需修改，特殊情况除外)
-------------------------*/

//修改雪碧图放大缩小倍数，默认是1，iphone是0.5
fis.set('css-scale',1);

fis.set("project.files", ["src/**"]);

fis.set("project.ignore", ["node_modules/**", ".git/**"]);

fis.set("project.charset", "utf8");

fis.config.set('settings.parser.jade', {
  pretty: true
});

fis.match("src/css/**.less", {
  parser: fis.plugin("less"),
  rExt: ".css"
});

fis.match("src/**.jade", {
  parser: fis.plugin("jade"),
  rExt: ".html",
  isHtmlLike: true
});

fis.match("src/**.coffee", {
  parser: fis.plugin("coffee-react"),
  rExt: ".js"
});

fis.match("_**", {
  release: false
});

fis
  .match('**.{js,coffee,html,jade,css,less,png,jpg,jpeg,gif,mp3,mp4,flv,swf,svg,eot,ttf,woff,woff2}', {
    useHash: false
  })
  .match('**.{css,less}', {
    useSprite: false
  })
  .match('**', {
    charset: fis.get("charset")
  })
  .match("::package", {
    spriter: fis.plugin("csssprites", {
      layout: "matrix",
      margin: 1
    })
  });

// 打包共用的js
fis.match("src/**/pkg.**.{coffee,js}", {
  packTo: "src/pkg/autocombined.js"
});

// 打包共用的css
fis.match("src/**/pkg.**.{less,css}", {
  packTo: "src/pkg/autocombined.css"
});

/*编译a标签href指向资源路径
-------------------------*/
fis.match('src/**.{jade,html}', {
  preprocessor: fis.plugin(function(content, file) {
    var uri = fis.compile.lang.uri;

    return content.replace(/(<a[^>]*)\shref=('|")(.*?)\2([^>]*>)/ig, function(_, prefix, quote, value, affix) {
      return prefix + ' href=' + quote + uri.wrap(value) + quote + affix;
    });
  })
});

/*本地打包（相对路径）
  测试环境打包（绝对路径）
  正式环境打包（绝对路径）
-------------------------*/

//本地打包，相对路径
fis.media('lc')
  .hook("relative")
  .match("::package", {
    postpackager: fis.plugin('loader')
  })
  .match('**.{css,less}', {
    useSprite: true
  })
  .match('**', {
    relative: true,
    deploy: [fis.plugin('encoding'),fis.plugin('local-supply', {
      to: './lc'
    })]
  })
  // HTML模板配置
  // 模板发布到服务器后以相对服务器的路径进行配置
  .match("src/**/*.{jade,html}", {
    relative: "/src"
  });

// 测试环境
fis.media("qa")
  .match("::package", {
    postpackager: fis.plugin('loader')
  })
  .match('**.{js,coffee,html,jade,css,less,png,jpg,jpeg,gif,mp3,mp4,flv,swf,svg,eot,ttf,woff,woff2}', {
    domain: fis.get("cdn-path"),
    useHash: true
  })
  .match('**.{css,less}', {
    useSprite: true
  })
  .match("index**.{jade,html}", {
    useHash: false
  })
  .match("tpls/**.{jade,html}", {
    useHash: true
  })
  .match("**", {
    deploy: fis.plugin('local-supply', {
      to: './qa'
    })
  });

// 正式环境
fis.media("pr")
  .match("::package", {
    postpackager: fis.plugin('loader')
  })
  .match('**.{js,coffee,html,jade,css,less,png,jpg,jpeg,gif,mp3,mp4,flv,swf,svg,eot,ttf,woff,woff2}', {
    domain: fis.get("cdn-path-release"),
    useHash: true
  })
  .match('**.{css,less}', {
    useSprite: true,
    optimizer: fis.plugin('clean-css')
  })
  .match('**.{js,coffee}',{
    optimizer: fis.plugin('uglify-js')
  })
  .match("**.{jade,html}", {
    optimizer: fis.plugin("htmlmin", {
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true
    })
  })
  .match("index**.{jade,html}", {
    useHash: false
  })
  .match("tpls/**.{jade,html}", {
    useHash: true
  })
  .match("**", {
    deploy: fis.plugin('local-supply', {
      to: './pr'
    })
  });

// 直接发布文件到远端
fis.media("pu")
  .match('**.{js,coffee,html,jade,css,less,png,jpg,jpeg,gif,mp3,mp4,flv,swf,svg,eot,ttf,woff,woff2}', {
    domain: fis.get("cdn-path-push"),
    useHash: true
  })
  .match("index**.{jade,html}", {
    useHash: false
  })
  .match("tpls/**.{jade,html}", {
    useHash: true
  })
  .match("**", {
    deploy: fis.plugin("http-push", {
      receiver: fis.get("http-push-receiver"),
      to: fis.get("http-push-to")
    })
  });




