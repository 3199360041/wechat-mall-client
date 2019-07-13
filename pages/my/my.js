import { My } from '../my/my-model.js'
import { Order } from '../order/order-model.js'
import { Address } from '../../utils/address.js'

var my = new My();
var order = new Order();
var address = new Address();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    orderArr: [],
    isLoadedAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
  },

  onShow: function(){
    var newOrderFlag = order.hasNewOrder();

    if(newOrderFlag){
      this.refresh();
    }
    // this.refresh();
  },

  refresh: function(){
    var that = this;
    this.data.orderArr = [];
    this._getOrders(()=>{
      this.data.isLoadedAll = false,
      this.data.pageIndex = 1;
      order.execSetStorageSync(false);
    });
  },

  _loadData: function(){
    my.getUserInfoData((data)=>{
      this.setData({
        userInfo: data
      });
    });

    this._getOrders();
  },

  _getOrders: function(callback){
    order.getOrders(this.data.pageIndex, (res)=>{
      var data = res.data;

      if(data.length > 0){
        this.data.orderArr.push.apply(this.data.orderArr, data);
        this.setData({
          orderArr: this.data.orderArr
        });
      }else{
        this.data.isLoadedAll = true;
      }

      callback && callback();
    });
  },

  onReachBottom: function(){
    if(!this.data.isLoadedAll){
     this.data.pageIndex++;
     this._getOrders(); 
    }
  },

  _getAddressInfo: function(){
    address.getAddress((addressInfo)=>{
      this._bindAddressInfo(addressInfo);
    });
  },

  _bindAddressInfo: function (addressInfo){
    this.setData({
      addressInfo: addressInfo
    });
  },

  showOrderDetailInfo: function(event){
    var id = order.getDataSet(event, 'id');

    wx.navigateTo({
      url: '../order/order?from=order&id='+id
    }); 
    
  },

  rePay: function(event){
    var id = order.getDataSet(event, 'id'),
    index = order.getDataSet(event, 'index');

    this._execPay(id, index);
  },

  _execPay: function(id, index){
    var _this = this;
    order.execPay(id, (statusCode) => {
      if (statusCode > 0) {
        var flag = statusCode == 2;

        //更新订单显示状态
        if (flag) {
          _this.data.orderArr[index].status = 2;
          _this.setData({
            orderArr: that.data.orderArr
          });
        }

        //跳转到 成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
        });
      } else {
        _this.showTips('支付失败', '商品已下架或库存不足');
      }
    });
  },

  /*
 * 提示窗口
 * params:
 * title - {string}标题
 * content - {string}内容
 * flag - {bool}是否跳转到 "我的页面"
 */
  showTips: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {

      }
    });
  },

  editAddress: function (event) {
    var _this = this;
    wx.chooseAddress({
      success: function (res) {

        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };

        _this._bindAddressInfo(addressInfo);

        address.submitAddress(res, (flag) => {
          if (!flag) {
            _this.showTips('操作提示', '地址信息更新失败');
          }
        });
      }
    });
  },

})