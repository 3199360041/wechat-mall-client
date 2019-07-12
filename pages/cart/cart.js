import { Cart } from './cart-model.js'
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onHide: function(){
    cart.execSetStorageSync(this.data.cartData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var cartData = cart.getCartDataFromLocal();
    // var countsInfo = cart.getCartTotalCounts(true);
    var cal = this._calcTotalAccountAndCounts(cartData);
    
    this.setData({
      cartData: cartData,
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account
    });
  },

  _calcTotalAccountAndCounts: function(cartData){
    var len = cartData.length,
      account = 0,
      selectedCounts = 0,
      selectedTypeCounts = 0;
      let multiple = 100;

      for(var i =0;i<len;i++){
        if(cartData[i].selectStatus){
          account += Number(cartData[i].price)*multiple*cartData[i].counts*multiple;
          selectedCounts += cartData[i].counts;
          selectedTypeCounts++;
        }
      }

      return {
        account: account/(multiple*multiple),
        selectedCounts:selectedCounts,
        selectedTypeCounts:selectedTypeCounts
      }
  },

  toggleSelect: function(event){
    var id = cart.getDataSet(event, 'id'),
    status = cart.getDataSet(event, 'status'),
    index = this._getProductIndexById(id);

    this.data.cartData[index].selectStatus = !status;

    this._resetCartData();

  },

  _resetCartData: function(){
    var newCartData = this._calcTotalAccountAndCounts(this.data.cartData);

    this.setData({
      cartData: this.data.cartData,
      selectedCounts: newCartData.selectedCounts,
      selectedTypeCounts: newCartData.selectedTypeCounts,
      account: newCartData.account
    });
  },

  toggleSelectAll: function(event){
    var status = cart.getDataSet(event, 'status') == 'true';
    var data = this.data.cartData;
    var len = data.length;

    for(var i=0;i<len;i++){
      data[i].selectStatus = !status;
    }

    this._resetCartData();
  },

  _getProductIndexById: function(id){
    var data = this.data.cartData,
    len = data.length;

    for(var i=0;i<len;i++){
      if(data[i].id == id){
        return i;
      }
    }
  },

  changeCounts: function(event) {
    var id = cart.getDataSet(event, 'id'),
    type = cart.getDataSet(event, 'type'),
    index = this._getProductIndexById(id),
    counts = 1;

    if(type == 'add') {
      cart.addCounts(id);
    }else{
      counts = -1;
      cart.cutCounts(id); 
    }

    this.data.cartData[index].counts += counts;
    this._resetCartData();

  },

  delete: function(event){
    var id = cart.getDataSet(event, 'id'),
    index = this._getProductIndexById(id);

    this.data.cartData.splice(index, 1);

    this._resetCartData();

    cart.delete(id);

  },

  submitOrder: function(event) {
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    });
  }

})