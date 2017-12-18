var wxpay = require('../../utils/pay.js')
var app = getApp();
Page({
  data:{
    statusType:[
      {name:"待付款",page:0},
      {name:"待发货",page:0},
      {name:"待收货",page:0},
      {name:"待评价",page:0},
      {name:"已完成",page:0}],
    currentType:0,
    list:[[],[],[],[],[]],
    goodsMap:[{},{},{},{},{}],
    logisticsMap:[{},{},{},{},{}],
    windowHeight:''
  },
  onLoad(options){
    this.getList();
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: systemInfo.windowHeight,
      currentType:options.id ? options.id:0
    })
  },
  // 点击tab切换 
  swichNav: function (res) {
    if (this.data.currentType == res.detail.currentNum) return;
    this.setData({
      currentType: res.detail.currentNum
    })
  } , 
  bindChange:function(e){
    this.setData({
      currentType: e.detail.current
    })
    if (!this.data.list[e.detail.current].length)
      this.getList();
  } ,
  getList(){
    wx.showLoading();
    var that = this;
    var postData = {
      token: app.globalData.token,
      status: that.data.currentType
    };
    var _page = that.data.statusType[that.data.currentType].page+1 ;;
    wx.request({
      url: app.globalData.baseUrl + '/order/list',
      data: postData,
      success: (res) => {
        wx.hideLoading();
        var param = {}, str1 = "list[" + that.data.currentType + "]", str2 = 'statusType[' + that.data.currentType + '].page', str3 = "logisticsMap[" + that.data.currentType + "]", str4 = "goodsMap[" + that.data.currentType + "]" ;
        if (res.data.code == 0) {
          param[str1] = res.data.data.orderList ;
          param[str2] = _page ;
          param[str3] = res.data.data.logisticsMap ;
          param[str4] = res.data.data.goodsMap ;
          that.setData(param);
        } else {
          param[str1] = [];
          param[str3]= {};
          param[str4] = {};
          this.setData(param);
        }
      }
    })
  },
  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: app.globalData.baseUrl + '/order/close',
            data: {
              token: app.globalData.token,
              orderId: orderId
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.code == 0) {
                var param = {}, str = 'statusType[' + that.data.currentType + '].page';
                param[str]=0;
                that.getList();
              }
            }
          })
        }
      }
    })
  },
  toPayTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    var money = e.currentTarget.dataset.money;
    wx.request({
      url: app.globalData.baseUrl + '/user/amount',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          // res.data.data.balance
          money = money - res.data.data.balance;
          if (money <= 0) {
            // 直接使用余额支付
            wx.request({
              url: app.globalData.baseUrl + '/order/pay',
              method:'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                token: app.globalData.token,
                orderId: orderId
              },
              success: function (res2) {
                wx.reLaunch({
                  url: "/pages/order-list/index"
                });
              }
            })
          } else {
            wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
          }
        } else {
          wx.showModal({
            title: '错误',
            content: '无法获取用户资金信息',
            showCancel: false
          })
        }
      }
    })
    wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
 
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
 
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
   
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  
  }
})