import { Config } from './config.js'

class Token {
  constructor() {
    this.tokenUrl = Config.restUrl + 'token/user';
    this.verifyUrl = Config.restUrl + 'token/verify';
  }

  verify() {
    var token = wx.getStorageSync('token');
    if (!token) {
      this.getTokenFromServer();
    } else {
      this._verifyFromServer(token);
    }
  }

  _verifyFromServer(token) {
    var _this = this;
    wx.request({
      url: _this.verifyUrl,
      method: 'POST',
      data: {
        token: token
      },
      success: function (res) {
        var valid = res.data.isValid;
        if (!valid) {
          _this.getTokenFromServer();
        }
      }
    })
  }

  getTokenFromServer(callback) {
    var _this = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: _this.tokenUrl,
          method: 'POST',
          data: {
            code: res.code
          },
          success: function (res) {
            wx.setStorageSync('token', res.data.token);
            callback && callback(res.data.token);
          }
        });
      }
    });
  }
}

export { Token }