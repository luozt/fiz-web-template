var $ = require("jquery");
var App = require("../comp/App.js");

$(function() {
  var app = new App({
    psdWidth: 720
  });
  return app.init();
});