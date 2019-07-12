import { Cart } from '../cart/cart-model.js'
import { Order } from '../order/order-model.js'
import { Address } from '../../utils/address.js'

var cart = new Cart();
var order = new Order();
var address = new Address();

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

    var productsArr = cart.getCartDataFromLocal(true);
    this.data.account = options.account;

    this.setData({
      productsArr: productsArr,
      account: options.account,
      orderStatus: 0 
    });

    address.getAddress((res)=>{
      this._bindAddressInfo(res);
    });

  },

  editAddress: function(event) {
    var _this = this;
    wx.chooseAddress({
      success: function(res){
        
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };

        _this._bindAddressInfo(addressInfo); 

        address.submitAddress(res, (flag)=>{
          if(!flag){
            _this.showTips('操作提示', '地址信息更新失败');
          }
        });
      }
    });
  },

  _bindAddressInfo: function(addressInfo){
    this.setData({
      addressInfo: addressInfo
    });
  },

  pay: function(){

  },

  /**
   * flag 是否跳转到'我的页面' 
   */
  showTips: function(title, content, flag){
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function(res){
        if(flag){
          wx.switchTab({
            url: '/pages/my/my'
          });
        }
      },
    });
  },

})