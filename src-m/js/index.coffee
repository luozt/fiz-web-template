#继承AppBase
Page = (options)->
  App.call(this, options)

  #这里保存页面Page的属性

  return true

Page.prototype = new App()

#这里保存Page的方法
#重载init方法
Page.prototype.init = ()->
  App.prototype.init.apply(this, arguments)

  #这里执行初始化动作
  console.log("page init!")

$(()->
  page = new Page({
    psdWidth: 720
  })

  page.init()
)



