var util = require('../../utils/utils.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isParise: false, //是否点赞
    isShare: true, //是否分享
    id: '',
    article: '', //详情内容
    allList: [], //列表数据集合
    currentType: '', //模块类型
    isNotice: false, //是否为公告
    disNotice: {
      tips: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (typeof (options.notice) == "undefined"){
      that.setData({
        currentType: options.type,
        isNotice: false,
        disNotice: {
          tips: false
        }
      });
      that.getDetail(options.id);
      that.getRandomList(options.id, options.type, 3); //推荐列表
    }else{
      that.setData({
        currentType: options.type,
        isNotice: true,
        disNotice: {
          tips: true
        }
      });
      that.getAnnounceDetail(options.id);
    }
    that.articleTop(options.id); //更新阅读数
    that.setData({
      id: options.id
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: 'Protal',
      path: 'pages/detail/index',
      success: function (res) {
        // 转发成功
        wx.getClipboardData({
        　　success: function (res) {
          　　wx.showToast({
                title: '转发成功'
          　　})
            }
        })
      },
      fail: function (res) {
        // 转发失败
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '转发失败'
            })
          }
        })
      }
    }
  },
  //获取文章数据
  showDialog: function(){
    var that = this;
    that.setData({
      isShare: false
    });
    console.log("测试")
  },
  //获取详情信息
  getDetail: function(id){
    var _this = this;
    wx.request({
      url: app.basePath.serverUrl + 'api/insight/info/' + id + '?t=' + new Date().getTime(),
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var article = res.data.result.insight;
        article.releaseTime = util.timeAgo((article.releaseTime + '').substring(0, 10));
        // article.content = article.content.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/quot;/g, '"').replace(/&#40;/g, '(').replace(/&#41;/g, ')');
        WxParse.wxParse('content', 'html', article.content, _this, 5);
        _this.setData({
          article: article
        });
      }
    });
  },
  //随机推荐列表
  getRandomList: function (id, tp, num) {
    var _this = this;
    wx.request({
      url: app.basePath.serverUrl + 'api/insight/insights',
      method: 'POST',
      data: {
        delInsightId: id,
        type: tp,
        pageSize: num
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.result.list.length; i++) {
          res.data.result.list[i].releaseTime =
            util.formatTime((res.data.result.list[i].releaseTime + '').substring(0, 10), "Y-M-D");
          // console.log(res.data.result.list[i].createTime)
        }
          _this.setData({
            allList: res.data.result.list
          });
      }
    });
    // console.log(_this.data.allList)
  },
  //公告详情
  getAnnounceDetail: function(id){
    var _this = this;
    wx.request({
      url: app.basePath.serverUrl + 'api/announcement/info/' + id + '?t =' + new Date().getTime(),
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var article = res.data.result.announcement;
        article.startTime = util.timeAgo((article.startTime + '').substring(0, 10));
        WxParse.wxParse('content', 'html', article.content, _this, 5);
        _this.setData({
          article: article
        });
      }
    });
  },
  //点赞
  clickParise: function(e){
    var _this = this;

    var num = e.currentTarget.dataset.num;
    var option = '';
    num == 0 ? option = 'top' : option = 'low';
    wx.request({
      url: app.basePath.serverUrl + 'api/insight/update',
      method: "POST",
      data: {
        insightId: _this.data.id,
        "option": option
      },
      success(data) {
        _this.setData({
          isParise: true
        });
      }
    });
  },
  //更新阅读数
  articleTop: function(id) {
    var _this = this;
    wx.request({
      url: app.basePath.serverUrl + 'api/insight/update',
      method: "POST",
      data: {
        insightId: id,
        "option": 'read_count'
      }
    });
  },
  //转发
  shareTo: function(){
    wx.hideShareMenu();
  },
  //复制链接
  copyLink: function(){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);

    wx.setClipboardData({
      　　　　data: app.basePath.serverUrl + urlWithArgs,
　　　　success: function (res) {
　　　　　　wx.getClipboardData({
　　　　　　　　success: function (res) {
　　　　　　　　　wx.showToast({
　　　　　　　　　　　title: '复制成功'
　　　　　　　　　})
　　　　　　    }
　　　　    })
　　　  }
　　});
    // console.log(app.basePath.serverUrl + urlWithArgs)
  },
  //取消分享
  closeDialog: function(){
    this.setData({
      isShare: true
    });
  }
})  