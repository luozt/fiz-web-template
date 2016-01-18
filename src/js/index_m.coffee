#面向对象编程
App = ()->
  this.init()

App.prototype.init = ()->
  # 处理短屏下缩放，以及初始化时固定页面大小，防止竖屏下弹出键盘或横屏时页面发生缩放的情况
  initScreen = (callback)->
    $html = $("html")
    rootElem = document.documentElement
    winW = rootElem.clientWidth
    winH = rootElem.clientHeight
    #单屏全屏布局时使用,短屏下自动缩放
    if 1.5>winH/winW
      $html.css("font-size", winH/603*312.5+"%")
    else
      $html.css("font-size", winW/375*312.5+"%")
    #长页面时使用，不缩放
    #$html.css("font-size", winW/375*312.5+"%")
    if callback
      callback()

  # 手机横向转换时执行
  orientationchangeAct = (e)->
    $forhorview = $("#forhorview") #横屏浏览时出现的提示框
    if 90 == window.orientation or -90 == window.orientation
      #横屏时显示提示框
      $forhorview.css("display", "-webkit-box")
    else
      #竖屏回复默认显示效果
      $forhorview.css("display", "none")
      setTimeout(initScreen, 300)
    resizeAct(e)

  # 页面大小变化时执行
  resizeAct = (e)->
    #执行的动作...

  initScreen()

  evtName = if "onorientationchange" in window then "orientationchange" else "resize"
  $(window).on(evtName, (e)->
    orientationchangeAct(e)
  )

#ready run
$(()->
  app = new App()
)