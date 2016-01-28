#web开发项目模板

> 本项目可以直接通过fiz这个node插件下载：`fiz clone web`

Web开发模板，包括PC开发模板，移动开发模板。

##文件结构说明

```
fis-conf.js                             //fis3配置文件
|
src                                     //存放该项目源码
|--index.jade                           //jade页面PC模板
|--index_m.jade                         //jade页面mobile模板
|--css
|    |--_sprites.less                   //雪碧图示例
|    |--_comm.less                      //Web项目常用样式
|    |--_func.less                      //常用less函数方法
|    |--_kreset.less                    //重置样式
|    |--_media_640x960.less             //设计图为640x960的媒体查询自适应调整样式
|    |--_media_750x1134.less            //设计图为750x1134的媒体查询自适应调整样式
|    |--index.less                      //PC初始样式
|    |--index_m.less                    //mobile初始样式
|--js
|    |--index.coffee                    //PC初始脚本
|    |--index_m.coffee                  //mobile初始脚本
```

##summary

本模板采用百度fis3作为前端构建工具，支持jade模板，CoffeeScript，Less等预编译语言工具。兼容IE7+。

##使用说明

本项目包括了PC开发和移动开发的版本，移动开发版本文件后面都带"_m"后缀。

PC开发，可把带"_m"后缀的文件和其他相应的移动开发文件删掉；

移动开发，只要把带"_m"后缀文件同名的文件删掉，选择好_media样式来引入，默认引入640x960的版本。

##开发环境说明

本项目使用fis3前端构建工具，但已通过封装为**FIZ**插件，故请按照以下步骤进行环境安装。

先安装[nodejs](https://nodejs.org/),利用nodejs的插件来进行开发：

1、安装插件：`npm i fiz -g`

2、启动fiz服务器： `fiz server start`, 将自动打开127.0.0.1:8080端口进行调试和预览

3、编译项目并监听变化：

  * 本地调试：`fiz release -w`
  * 远程环境调试：`fiz release pu -w`
  * 相对路径打包：`fiz release lc`
  * 测试环境打包：`fiz release qa`
  * 正式环境打包：`fiz release pr`

##打相对路径包说明

**如果需要以相对路径来打包，则需要做到以下这些：**

fis-conf.js默认已配置了本地打包的设置，但有一点可能还需开发者自己定义，即模板HTML文件发布后相对服务器的路径，因为模板HTML文件放置的路径一般为资源的路径，如`tpls/template.html`文件之类，但它们渲染在视图中路径就会变为`/index.html`，所以要设置好相对`/index.html`而不是`tpls/template.html`的路径即可。

以下为fis-conf.js中关于这部分的代码：

```javascript
  // 模板发布到服务器后以相对服务器的路径进行配置
  .match("src/*/**.jade", {
    relative: "/src"
  });
```

## 模板使用TIPS

* 默认fis-conf.js配置认为所有用到的HTML模板放在`tpls/`文件夹，故针对tpls文件夹进行处理。如果开发者需要定义自己的模板文件名，则可修改fis-conf.js对应的代码。

## PC开发TIPS

* `src/css/_sprites.less`已提供雪碧图的使用示例，开发者无需自己拼合雪碧图，只需按照这个文件的写法，在发布时，fis3将自动拼合雪碧图。**建议配合node插件`spritelist`来使用！**
* `src/css/_func.less`提供了很多有用的方法，如`.u-input`样式设置`<input>`输入框的样式，将直接兼容IE7+，否则你将写一大堆兼容性的代码，还有`.transition`, `.transform`等less方法可以使用，已自动补全前缀了。
* js,css文件可以加个`pkg.`的文件名前缀，这样打包后会自动合并在一个文件。比如很多js的lib插件，`jquery.scrollable.js`改为`pkg.jquery.scrollable.js`,`jquery.tabs.js`改为`pkg.jquery.tabs.js`。相应的fis配置如下：

  ```js
  // 打包共用的js
  fis.match("src/**/pkg.**.{coffee,js}", {
    packTo: "src/pkg/autocombined.js"
  });

  // 打包共用的css
  fis.match("src/**/pkg.**.{less,css}", {
    packTo: "src/pkg/autocombined.css"
  });
  ```

##移动开发TIPS

* css大部分单位都采用rem，只有如少数border为1px的地方使用px单位。而安卓下`<textarea>`标签的内容字体大小不支持rem设置，如有需要使用响应式及px单位设置其字体
* 模板默认HTML标签有`.loading`，当页面加载完成会去掉`.loading`；当页面横屏时会加上`.forhorview`。故可以利用这个设定对加载前、加载完成、横屏时的页面进行调整。默认已进行了一些调整了，在`src/css/index_m.less`里
* `src/js/index_m.coffee`提供一些设定，其中部分还会影响页面的rem单位的使用，如下：

  ```coffeescript
  this.options = {
    #是否是长页面（用于计算rem）
    isLongPage: if undefined != options.isLongPage then options.isLongPage else true
    #PSD的宽度（用于计算rem）
    psdWidth: options.psdWidth || 750
    #PSD相对实图的比例（用于计算rem）
    psdRatio: options.psdRatio || 2
    #PSD的高度（用于计算rem。单屏使用，如果是长页面则可不理）
    psdHeight: options.psdHeight || 1206
    #视图大小变化会触发的事件
    onresize: options.onresize || ()->
    #项目初始化后执行
    oninit: options.oninit || ()->
    #视图旋转后执行
    onorichange: options.onorichange || ()->
  }
  ```

  开发者根据自己的项目需求进行自定义设定


