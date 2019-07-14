import { Base } from "../../utils/base.js";

class Theme extends Base {
  constructor() {
    super();
  }

  /**
   * 对应主题的id号
   */
  getProductsData(id, callback) {
    var param = {
      url: 'theme/' + id,
      sCallback: function (data) {
        callback && callback(data);
      }
    };
    this.request(param);
  }
}

export { Theme }