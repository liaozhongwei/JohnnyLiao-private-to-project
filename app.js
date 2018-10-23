//app.js
App({
  onLaunch: function () {
    //console.log("app show")
  },
  getUserInfo:function(cb){
    //console.log(cb)
  },
  onShow: function () {
    //console.log('App Show')
  },
  onHide: function () {
    //console.log('App Hide')
  },
  globalData:{
    userInfo:null
  },
  basePath: {
    serverUrl: 'http://10.173.44.31:8086/' //内网网关——向明超
    // serverUrl: '' //外网网关
  }
})