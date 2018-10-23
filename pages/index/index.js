var app = getApp();
var util = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    hideHeader: false, //下拉刷新
    hideBottom: true,
    scrollTop: 0,
    pager: 1, //页码
    floorstatus: false,
    allList: {}, //所有的数据
    list: [], //普通文章列表
    tweets: {}, //推文
    product: {}, //产品
    notice: {}, //公告
    hot: {}, //热门,
    currentType: "",
    eitherOr: true, //产品和推文二选一显示
    styles: {
        scrollMarg: '', //列表上边距
        scrllZind: '', //滑块top定位距离
        isTop: true, //到达顶部显示抬头
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
            clientWidth = res.windowWidth,
            rpxR = 750/clientWidth;
        var calc = clientHeight*rpxR-180;
          that.setData({
            winHeight: calc
          });
      },
    });
    that.getListData("最新洞察");
    setTimeout(function () {
      that.setData({
        hideHeader: true
      });
    }, 800);
    // console.log(util.formatTime("1527560328", "Y-M-D"))
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
        currentTab: e.detail.current
    });
    this.checkCor();
  },
  //点击标题切换当前页时改变样式
  switchNav: function (e) {
    var cur = e.target.dataset.current;
    var that = this;

    that.setData({
      hideHeader: false,
      currentType: e.target.dataset.text
    });
    this.getListData(e.target.dataset.text); //切换列表
    setTimeout(function(){
      that.setData({
        hideHeader: true
      });
    }, 800);
    if(this.data.currentTaB == cur){
      return false;
    }else {
        this.setData({
          currentTab: cur
        })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条
  checkCor: function () {
    if(this.data.currentTab > 4){
      this.setData({
        scrollLeft: 300
      })
    }else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  //上滑刷新
  upper: function(e){
    var self = this;
    self.setData({
      hideHeader: false
    });
    // console.log("距离：",e)
    setTimeout(function () {
      self.setData({
        hideHeader: true,
        pager: 1,
        // isTop: false
      });
      self.getListData(self.data.currentType);
    }, 2000);
  },
  //下滑加载
  loadMore: function(){
    var self = this;
    self.setData({
      hideBottom: false,
      pager: self.data.pager + 1
    });
    setTimeout(function () {
      // console.log('下滑加载');
      self.setData({
        hideBottom: true
      });
      self.getListData(self.data.currentType);
    }, 3000);
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    if(e.detail.scrollTop > 100) {
        this.setData({
          styles: {
            isTop: false,
            scrollMarg: '118rpx', //列表上边距
            scrllZind: '0', //滑块top定位距离
          }
        })
    }else {
      this.setData({
        styles: {
          isTop: true,
          scrollMarg: '', //列表上边距
          scrllZind: '', //滑块top定位距离
        }
      })
    }
    if (e.detail.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //数据请求
  getListData: function(tp){
    var that = this;
    var pageIndex = that.data.pager;
    wx.request({
      url: app.basePath.serverUrl + 'api/insight/getInsights',
      method: 'POST',
      data: {
        pageNumber: pageIndex,
        type: tp
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        var d = {};
        var tempList = [], tempHot = {};
        var listObj = [];
        
        for (var i = 0; i < res.data.result.list.length; i++) {
          res.data.result.list[i].releaseTime = 
            util.formatTime((res.data.result.list[i].releaseTime + '').substring(0, 10), "Y-M-D");
          // console.log(res.data.result.list[i].createTime)
        }

        if(that.data.pager == 1){
          listObj.push(res.data.result);
          that.setData({
            allList: listObj
          });
        }else {
          that.setData({
            allList: that.data.allList.concat(res.data.result)
          });
        }
        d = that.data.allList;
        for(var j=0;j<d.length;j++){
          for (var i = 0; i < d[j].list.length; i++) {
            // console.log(util.encoding(d[j].list[i].title), ':'+d[j].list[i].title);
            d[j].list[i].title = util.encoding(d[j].list[i].title);
            // d[j].list[i].createTime = util.formatTime((d[j].list[i].createTime+'').substring(0,10), "Y-M-D");
            // console.log(d[j].list[i].createTime);
          }
          if (typeof (d[j].insight) != "undefined") {
            that.setData({
              eitherOr: false
            });
          } else {
            that.setData({
              // product: d[j].advertising,
              eitherOr: true
            });
          }
          for (var i = 0; i < d[j].list.length; i++) {
            if (i < 3) {
              tempList.push(d[j].list[i]);
            } else {
              tempHot = d[j].list[i];
            }

          }
          that.setData({
            hot: tempHot
          }); 

        }
      }
    })
  }
})