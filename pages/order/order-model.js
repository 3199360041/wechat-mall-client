import { Base } from '../../utils/base.js'

class Order extends Base{
  constructor(){
    super();
    this._storageKeyName = 'newOrder';
  }

  //下订单
  doOrder(param, callback){
    var _this = this;
    var allParams = {
      url: 'order',
      type: 'POST',
      data: {
        products: param
      },
      sCallback: function(res){
        _this.execSetStorageSync(true);
        callback && callback(res);
      },
      eCallback: function(){

      }
    };
    this.request(allParams);
  }

  execSetStorageSync(data){
    wx.setStorageSync(this._storageKeyName, data);
  }

  //支付
  //id : 订单号 id
  //return callback(2) 0: 商品缺货等原因造成无法支付，1: 支付失败或取消 ，2: 支付成功
  execPay(orderNumber, callback){
    var allParams = {
      url: 'pay/pre_order',
      type: 'POST',
      data: { id: orderNumber},
      sCallback: function(data){
        var timeStamp = data.timeStamp;
        if(timeStamp){//可以支付
          wx.requestPayment({
            timeStamp: timeStamp.toString(),
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: function(){
              callback && callback(2);
            },
            fail: function(){
              callback && callback(1);
            }
          });
        }else{
          callback && callback(0);
        }
      }
    };

    this.request(allParams);
  }

  getOrderInfoById(id, callback){
    var _this = this;
    var allParams = {
      url: 'order/' + id,
      type: 'GET',
      sCallback: function(data){
        callback && callback(data);
      },
      eCallback: function(){}
    };
    this.request(allParams);
  }

  getOrders(pageIndex, callback){
    var params = {
      url: 'order/by_user',
      type: 'GET',
      data: { page: pageIndex },
      sCallback: function(res){
        callback && callback(res);
      }
    };

    this.request(params);
  }

}

export { Order }