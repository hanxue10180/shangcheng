var app = getApp();
Page({
  data: {
    curNav: 1,
    curIndex: 0,
    type_detail:1,
    list:[],
    page:1,
    leftHeight:'',
    rightHeight:'',
    windowHeight:'',
    hidden:true
  },
  onLoad(){
    var _windowHeight = wx.getSystemInfoSync().windowHeight ;
    var _leftHeight = app.globalData.tlist.length * 50 ;
    this.setData({
      tlist:app.globalData.tlist,
      curNav:app.globalData.tlist[0].firstType.id,
      leftHeight: _leftHeight <= _windowHeight-40 ? _windowHeight-40 : _leftHeight,
      windowHeight:_windowHeight
    })
    this.switchRightTab();
  },
  loadmore(){
    this.setData({
      hidden:false
    })
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let  id = e ? e.currentTarget.dataset.id : this.data.tlist[0].firstType.id,
      index = e ? parseInt(e.currentTarget.dataset.index) : 0,
    _length = this.data.tlist[index].second.length ;
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index,
      hidden:true
    })
    if (!_length){
      this.getTypeDetail(e ? e : '');
      this.setData({
        type_detail:2
      })
    }else{
      var _height = (Math.ceil(_length / 3) * 160 + 28) / (750 / wx.getSystemInfoSync().windowWidth) ;
      this.setData({
        type_detail:  1 ,
        rightHeight: _height <= this.data.windowHeight-40 ? this.data.windowHeight - 28 / (750 / wx.getSystemInfoSync().windowWidth)-40 : _height
      })
    }
  },
  getTypeDetail(e){
    var self = this ;
    var _page = self.data.page;
    let id = e ? e.currentTarget.dataset.id : this.data.tlist[0].firstType.id ;
    this.setData({
      page: 1,
      list:[]
    })
    self.getList(id);
  },
  getList(id){
    var self = this ;
    var _page = self.data.page;
    //获取分类商品
    wx.request({
      url: app.globalData.baseUrl + '/shop/goods/list',
      data: {
        page: _page,
        pageSize:999,
        categoryId: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!res.data.data) {
          self.setData({
            type_detail: 0
          })
          return false
        }
        var _length = res.data.data.length ;
        var _height = (_length * 214 + 28) / (750 / wx.getSystemInfoSync().windowWidth);
        console.log(_height);
        self.setData({
          list: _page == 1 ? res.data.data : self.data.list.concat(res.data.data),
          page: _page + 1 ,
          type_detail:2 ,
          rightHeight: _height <= self.data.windowHeight-40 ? self.data.windowHeight - 28 / (750 / wx.getSystemInfoSync().windowWidth)-40 : _height
        });//当前页页数+1
      }
    })
  },
  goDetail(e){
    var _id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  //search
  goSearch(e){
    wx.navigateTo({
      url: "/pages/search/index"
    })
  }
})  