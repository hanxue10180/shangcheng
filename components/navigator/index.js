Component({
  properties:{
    tList:{
      type: Array,
      value:[]
    }, //标题列表
    currentTab:{
      type:Number,
      value:0,
      observer: function (newVal, oldVal) { 
        this.setData({
          currentTab : newVal
        })
      } 
    },
    tname:{
      type:String, 
      value:''
    },
    ttype:{
      type:Number,
      value:''
    }
  },
  ready(){
    console.log(this.data.ttype);
  },
  methods:{
    _swichNav:function(e){
      this.triggerEvent('changeCurrent', {
        currentNum: e.currentTarget.dataset.current
      })
    }
  }
})