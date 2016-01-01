# 处理短屏下缩放，以及初始化时固定页面大小，防止竖屏下弹出键盘或横屏时页面发生缩放的情况
initScreen = ()->
  $win = $(window)
  $html = $("html")
  winW = $win.width()
  winH = $win.height()
  if 1.5>winH/winW
    fontSize = [winH/603*312.5, "%"].join("")
  else
    fontSize = [winW/375*312.5, "%"].join("")

orientationchangeAct = (e)->
  $forhorview = $("#forhorview") #横屏浏览时出现的提示框
  if 90 == window.orientation or -90 == window.orientation
    #横屏时显示提示框
    $forhorview.addClass("show")
  else
    #竖屏回复默认显示效果
    $forhorview.removeClass("show")
    setTimeout(initScreen, 300)
  resizeAct(e)

resizeAct = (e)->
  #window reisze执行的动作...

$(()->
  initScreen()
  evtName = if "onorientationchange" in window then "orientationchange" else "resize"
  $(window).on(evtName, (e)->
    onorientationchange(e)
  )
)

