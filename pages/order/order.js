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
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var from = options.from;
    if(from == 'cart'){
      this._fromCart(options.account);
    }else{
      var id = options.id;
      this._fromOrder(id);
    }
  },

  _fromCart: function(account){
    var productsArr = cart.getCartDataFromLocal(true);
    this.data.account = account;

    this.setData({
      productsArr: productsArr,
      account: account,
      orderStatus: 0
    });

    address.getAddress((res) => {
      this._bindAddressInfo(res);
    });
  },

  _fromOrder: function(id){
    if (id) {
      var that = this;
      //下单后，支付成功或者失败后，点左上角返回时能够更新订单状态 所以放在onshow中
      order.getOrderInfoById(id, (data) => {
        that.setData({
          orderStatus: data.status,
          productsArr: data.snap_items,
          account: data.total_price,
          basicInfo: {
            orderTime: data.create_time,
            orderNo: data.order_no
          },
        });

        // 快照地址
        var addressInfo = data.snap_address;
        addressInfo.totalDetail = address.setAddressInfo(addressInfo);
        that._bindAddressInfo(addressInfo);
      });
    }
  },

  onShow: function () {
    if(this.data.id){
      this._fromOrder(this.data.id);
    }
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
    if(!this.data.addressInfo){
      this.showTips('下单提示', '请填写您的收货地址');
      return ;
    }

    if(this.data.orderStatus == 0){
      this._firstTimePay();
    }else{
      this._oneMoresTimePay();
    }
  },

  _firstTimePay: function(){
    var orderInfo = [],
    productInfo = this.data.productsArr;
    
    for(let i=0;i<productInfo.length;i++){
      orderInfo.push({
        product_id: productInfo[i].id,
        count: productInfo[i].counts
      });
    }

    var _this = this;
    
    //分两步： 第一步：生成订单，第二步：支付
    order.doOrder(orderInfo, (data)=>{
      //生成订单成功
      if(data.pass){
        var id = data.order_id
        _this.data.id = id;
        _this.data.fromCartFlag = false;

        //支付开始
        _this._execPay(id);
      }else{
        _this._orderFail(data);
      }
    });
  },

  /*开始支付
  * params:
  * id - { int }订单id
  * callback([0-2]) 0: 商品缺货等原因造成无法支付，1: 支付失败或取消 ，2: 支付成功
  */
  _execPay: function (id) {
    // if (!order.onPay) {
    //   this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽', true);
    //   this.deleteProducts();
    //   return;
    // }
    var _this = this;
    order.execPay(id, (statusCode) => {
      if (statusCode != 0) {
        _this.deleteProducts();
        var flag = statusCode == 2;
        wx.navigateTo({
          url: '../pay-result/pay-result?id='+id+'&flag='+flag+'&from=order'
        });
      }
    });
  },


  /*
  *下单失败
  * params:
  * data - {obj} 订单结果信息
  * */
  _orderFail: function (data) {
    var nameArr = [],
      name = '',
      str = '',
      pArr = data.pStatusArray;
    for (let i = 0; i < pArr.length; i++) {
      if (!pArr[i].haveStock) {
        name = pArr[i].name;
        if (name.length > 15) {
          name = name.substr(0, 12) + '...';
        }
        nameArr.push(name);
        if (nameArr.length >= 2) {
          break;
        }
      }
    }
    str += nameArr.join('、');
    if (nameArr.length > 2) {
      str += ' 等';
    }
    str += ' 缺货';
    wx.showModal({
      title: '下单失败',
      content: str,
      showCancel: false,
      success: function (res) {

      }
    });
  },

  deleteProducts: function(){
    var ids = [],arr = this.data.productsArr;
    for(let i=0;i<arr.length;i++){
      ids.push(arr[i].id);
    }
    cart.delete(ids);
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