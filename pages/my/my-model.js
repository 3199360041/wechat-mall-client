import { Base } from '../../utils/base.js'

class My extends Base {
  constructor() {
    super()
  }

  //得到用户微信信息
  getUserInfoData(cb) {
    var _this = this;
    wx.login({
      success: function() {
        wx.getUserInfo({
          success: function(res) {
            typeof cb == "function" && cb(res.userInfo);

            //将用户昵称 提交到服务器
            if (!_this.onPay) {
              _this._updateUserInfo(res.userInfo);
            }

          },
          fail: function(res) {
            typeof cb == "function" && cb({
              avatarUrl: '../../imgs/icon/user@default.png',
              nickName: '零食小贩'
            });
          }
        });
      },

    })
  }

  _updateUserInfo(userInfo) {

  }

}

export { My }