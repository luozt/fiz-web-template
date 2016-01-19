#面向对象编程
App = (options)->
  options = options || {}
  this.options = {
    #PSD的宽度
    psdWidth: options.psdWidth || 750
    #PSD的高度
    psdHeight: options.psdHeight || 1206
    #PSD相对实图的比例
    psdRatio: options.psdRatio || 2
    #是否是长页面
    isLongPage: if undefined != options.isLongPage then options.isLongPage else true
    #视图大小变化会触发的事件
    onresize: options.onresize || ()->
    #项目初始化后执行
    oninit: options.oninit || ()->
    #视图旋转后执行
    onorichange: options.onorichange || ()->
  }
  this.init()

  return null

App.prototype.init = ()->
  self = this
  # 处理短屏下缩放，以及初始化时固定页面大小，防止竖屏下弹出键盘或横屏时页面发生缩放的情况
  initScreen = ()->
    $html = $("html")
    rootElem = document.documentElement
    winW = rootElem.clientWidth
    winH = rootElem.clientHeight
    options = self.options
    psdWidth = options.psdWidth
    psdHeight = options.psdHeight
    isLongPage = options.isLongPage
    psdRatio = options.psdRatio
    defaultFontSize = 16 #默认的字体大小
    fontSizeRatio = 100/psdRatio/defaultFontSize #设置fontSize的比率
    rootFontSizeVertical = winW/(psdWidth/2)*fontSizeRatio*100+"%" #竖屏的FontSize
    rootFontSizeHorizontal = winH/(psdHeight/2)*fontSizeRatio*100+"%" #横屏的FontSize

    if isLongPage
      #长页面时使用，不缩放
      $html.css("font-size", rootFontSizeVertical)
    else
      #单屏全屏布局时使用,短屏下自动缩放
      if 1.5>winH/winW
        $html.css("font-size", rootFontSizeHorizontal)
      else
        $html.css("font-size", rootFontSizeVertical)

    $html.removeClass("loading")

    options.oninit()

  # 手机横向转换时执行
  orientationchangeAct = (e)->
    $html = $("html")
    if 90 == window.orientation or -90 == window.orientation
      #横屏时显示提示框
      $html.addClass("forhorview")
    else
      #竖屏恢复默认显示效果
      $html.removeClass("forhorview")
      setTimeout(initScreen, 300)
    self.options.onorichange(e)
    resizeAct(e)

  # 页面大小变化时执行
  resizeAct = (e)->
    self.options.onresize(e)

  initScreen()
  orientationchangeAct()

  evtName = if "onorientationchange" in window then "orientationchange" else "resize"
  $(window).on(evtName, (e)->
    orientationchangeAct(e)
  )

#ready run
$(()->
  app = new App({
    psdWidth: 720
  })
)