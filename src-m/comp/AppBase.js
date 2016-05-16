var $ = require("jquery");

var AppBase,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

AppBase = function(options) {
  options = options || {};
  this.options = {
    // 是否是长页面
    isLongPage: void 0 !== options.isLongPage ? options.isLongPage : true,
    // PSD的宽度
    psdWidth: options.psdWidth || 750,
    // PSD相对实图的比例
    psdRatio: options.psdRatio || 2,
    // PSD的高度（单屏使用）
    psdHeight: options.psdHeight || 1206,
    // 视图大小变化会触发的事件
    onresize: options.onresize || function() {},
    // 项目初始化后执行
    oninit: options.oninit || function() {},
    // 视图旋转后执行
    onorichange: options.onorichange || function() {}
  };
  return true;
};

AppBase.utils = {
  // 判断是否移动端
  isMobile: function() {
    var re;
    re = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
    return !!(navigator.userAgent.match(re));
  }
};

AppBase.prototype.init = function() {
  var $html, defaultFontSize, defaultPcFontSize, evtName, fontSizeRatio, isLongPage, isMobile, mediaScreen, options, orientationchangeAct, psdHeight, psdRatio, psdWidth, resizeAct, rootElem, self;
  self = this;
  $html = $("html");
  rootElem = document.documentElement;
  options = self.options;
  psdWidth = options.psdWidth;
  psdHeight = options.psdHeight;
  isLongPage = options.isLongPage;
  isMobile = AppBase.utils.isMobile();
  psdRatio = options.psdRatio;
  // 默认的字体大小
  defaultFontSize = 16;
  // 默认PC上的字体大小
  defaultPcFontSize = 48;
  // 设置fontSize的比率
  fontSizeRatio = 100 / psdRatio / defaultFontSize;

  // 处理短屏下缩放，以及初始化时固定页面大小，防止竖屏下弹出键盘或横屏时页面发生缩放的情况
  mediaScreen = function() {
    var rootFontSizeHorizontal, rootFontSizeVertical, winH, winW;
    winW = rootElem.clientWidth;
    winH = rootElem.clientHeight;

    // 竖屏的FontSize
    rootFontSizeVertical = winW / (psdWidth / 2) * fontSizeRatio * 100 + "%";
    // 横屏的FontSize
    rootFontSizeHorizontal = winH / (psdHeight / 2) * fontSizeRatio * 100 + "%";

    if (isMobile) {
      if (isLongPage) {
        // 长页面时使用，不缩放
        return $html.css("font-size", rootFontSizeVertical);
      } else {
        // 单屏全屏布局时使用,短屏下自动缩放
        if (1.5 > winH / winW) {
          return $html.css("font-size", rootFontSizeHorizontal);
        } else {
          return $html.css("font-size", rootFontSizeVertical);
        }
      }
    } else {
      return $html.css("font-size", defaultPcFontSize + "px");
    }
  };

  // 手机横向转换时执行
  orientationchangeAct = function(e, banMediaScreen) {
    $html = $("html");

    // 横屏时显示提示框
    if (90 === window.orientation || -90 === window.orientation) {
      $html.addClass("forhorview");
    }
    // 竖屏恢复默认显示效果
    else {
      $html.removeClass("forhorview");
      if (!banMediaScreen) {
        setTimeout(mediaScreen, 300);
      }
    }
    self.options.onorichange(e);
    return resizeAct(e);
  };

  // 页面大小变化时执行
  resizeAct = function(e) {
    return self.options.onresize(e);
  };


  mediaScreen();
  orientationchangeAct(null, true);
  evtName = indexOf.call(window, "onorientationchange") >= 0 ? "orientationchange" : "resize";
  $(window).on(evtName, function(e) {
    return orientationchangeAct(e);
  });


  $html.removeClass("loading");
  return setTimeout(function() {
    return options.oninit();
  }, 0);
};

module.exports = AppBase;

