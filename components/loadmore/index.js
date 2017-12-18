Component({
  properties: {
    mtype:{
      type:Number,
      value:1,
      observer: function (newVal, oldVal) {
        this.setData({
          mtype: newVal
        })
      } 
    },
    nodata_str:{
      type:String,
      value:'暂无数据',
      observer: function (newVal, oldVal) {
        this.setData({
          nodata_str: newVal
        })
      }
    },
    hidden:{
      type:Boolean,
      value:true,
      observer: function (newVal, oldVal) {
        this.setData({
          hidden: newVal
        })
      }
    },
    tipcolor:{
      type:String,
      value:"#f9f9f9"
    }
  }
})