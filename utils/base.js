import { Config } from '../utils/config.js'
import { Token } from './token.js'

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

  //noRefetch = true 时，不做未授权重试机制
  request(params, noRefetch = false) {
    var _this = this;
    var url = this.baseRequestUrl + params.url;

    if (!params.type) {
      params.type = 'GET';
    }

    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        var code = res.statusCode.toString();

        var startChar = code.charAt(0);

        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        } else {
          //TODO
          if (code == '401' || code == '500') {
            if (!noRefetch) {
              _this._refetch(params);
            }
          }
          if (noRefetch) {
            params.eCallback && params.eCallback(res.data);
          }
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  }

  _refetch(params) {
    var token = new Token();
    token.getTokenFromServer((token) => {
      this.request(params, true);
    });
  }

  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  }
}

export { Base }