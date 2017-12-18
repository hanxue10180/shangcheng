Component({
  properties: {
    imgList: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        this.setData({
          imgList: newVal
        })
      }
    },
    url:{
      type:String,
      value:''
    },
    sHeight:{
      type:String,
      value:''
    }
  }
})