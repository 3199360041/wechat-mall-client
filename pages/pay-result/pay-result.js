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
    console.log(options.from);
    this.setData({
      payResult: options.flag,
      id: options.id,
      from: options.from
    });
  },

  viewOrder: function (event) {
    wx.navigateBack({
      delta: 1
    });
  }
})