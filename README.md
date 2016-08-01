#web开发项目模板

> 本项目可以直接通过fiz这个node插件下载：`fiz get web`

##summary

Web开发模板，包括PC开发模板，移动开发模板。本模板采用百度fis3作为前端构建工具，支持jade模板，CoffeeScript，Less, React等预编译语言工具。

`src`文件夹包含的是PC端的项目模板，兼容IE7+。

`src-m`文件夹包含的是移动端的项目模板。如果要使用的是移动端的模板，则把PC端的`src`文件夹删掉，再`src-m`改名为`src`了

**使用范例：**本人个人实践项目[react admin ctrl](https://github.com/luozt/react-admin-ctrl)已进行了使用，并利用了fis的require功能和react的编译，可以进行参考和使用。

##开发环境说明

本项目使用fis3前端构建工具，但已通过封装为**FIZ**插件，故请按照以下步骤进行环境安装和使用。

先安装[nodejs](https://nodejs.org/)，利用nodejs的插件来进行开发：

1、安装插件：`npm i`。安装完成后会自动打包，如果还没开发完，直接删除即可。

2、启动fiz服务器进行本地调试： `npm run dev`, 将自动打开<http://127.0.0.1:8080/>进行调试和预览

开发命令列表：

* 本地调试：`npm run dev`
* 远程环境调试：`npm run dev-pu`
* 相对路径打包：`npm run build-lc`，默认打相对路径的包
* 测试环境打包：`npm run build-qa`
* 正式环境打包：`npm run build-pr`

##fis-conf配置说明

* `/src/index.html`的`__NODE_ENV`变量在打包时，会替换为相应环境的字符串：dev | lc | qa | pr
* 所有版本的打包，都会把css、js文件各自合并在一个文件中，也就是一个html对应只有1个css和1个js，减少http请求，就是这么简单粗暴。
* 以unmod.开头的文件将不被视为模块
* （没启用）以pkg.开头的js文件在pr打包时将被合并为一个js文件
* （没启用）以pkg.开头的css文件在pr打包时将被合并为一个css文件

##开发说明

* 项目采用fis-mod模块来进行模块封装，在`src/index.js`里通过`//@require fis-mod`的方式引入，把相应的js封装为模块。在具体模块中，模块的引入使用`require`，模块的输出使用`module.exports`或者`exports`


##打相对路径包说明

**如果需要以相对路径来打包，则需要做到以下这些：**

fis-conf.js默认已配置了本地打包的设置，但有一点可能还需开发者自己定义，即模板HTML文件发布后相对服务器的路径，因为模板HTML文件放置的路径一般为资源的路径，如`tpls/template.html`文件之类，但它们渲染在视图中路径就会变为`/index.html`，所以要设置好相对`/index.html`而不是`tpls/template.html`的路径即可。

以下为fis-conf.js中关于这部分的代码：

```javascript
  // 模板发布到服务器后以相对服务器的路径进行配置
  .match("src/*/**.{jade,html}", {
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
* 模板默认HTML标签有`.loading`，当页面加载完成会去掉`.loading`；当页面横屏时会加上`.forhorview`。故可以利用这个设定对加载前、加载完成、横屏时的页面进行调整。默认已进行了一些调整了，在`src-m/css/index.less`里
* 本开发模板是根据netease网站小组的规范来编写的。使用rem布局也可使用淘宝插件：[lib-flexible](https://github.com/amfe/lib-flexible)


##文件结构说明

```
fis-conf.js                             //fis3配置文件
|
src/                                    //存放PC项目模板
|
src-m/                                  //存放移动端项目模板
|
.env                                    // heroku文件
|
Procfile                                // heroku文件
```