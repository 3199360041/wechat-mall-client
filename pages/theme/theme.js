import { Theme } from "theme-model.js";

var theme = new Theme();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.id = options.id;
    this.data.name = options.name;
    this._loadData();
  },

  _loadData: function (callback) {
    theme.getProductsData(this.data.id, (data) => {
      this.setData({
        'themeInfo': data,
        'loadingHidden': true
      });
      callback && callback();
    })
  },

  /*跳转到商品详情*/
  onProductsItemTap: function (event) {
    var id = theme.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.name,
    })
  },

})