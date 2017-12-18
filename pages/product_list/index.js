var app = getApp();
// pages/product_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    hidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
  },
  getList(){
    var self = this;
    var _page = self.data.page;
    self.setData({
      hidden: false
    })
    //获取分类商品
    wx.request({
      url: app.globalData.baseUrl + '/shop/goods/list',
      data: {
        page: _page,
        pageSize: 6,
        categoryId: self.data.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!res.data.data) {
          wx.showToast({
            title: res.data.msg
          })
          self.setData({
            hidden: true
          })
          return false
        }
        self.setData({
          page : _page+1,
          list: _page == 1 ? res.data.data : self.data.list.concat(res.data.data)
        });//当前页页数+1
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        self.setData({
          hidden: true
        })
      }
    })
  }
})