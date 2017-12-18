Component({
  properties: {
    pList:{
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          pList: newVal
        })
      } 
    },
    sHeight:{
      type:Number,
      value:0
    }
  },
  methods:{
    product_detail: function (e) {
      var _id = e.currentTarget.dataset.id ;
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  }
})