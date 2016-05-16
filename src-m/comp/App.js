var AppBase = require("./AppBase.js");

var App;

App = function(options) {
  AppBase.call(this, options);
  return true;
};

App.prototype = new AppBase();

App.prototype.init = function() {
  AppBase.prototype.init.apply(this, arguments);
  return console.log("App init!");
};

module.exports = App;

