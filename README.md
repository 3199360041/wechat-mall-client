#   微信小程序
#   对应后台
#   [https://github.com/3199360041/wechat-mall-backend.git](https://github.com/3199360041/wechat-mall-backend.git)


需要修改utils/config.js文件中的变量
```javascript

class Config{
  constructor(){}
}

Config.restUrl = 'http://127.0.0.1:8000/api/v1/';

export { Config }

```

#   预览图

###   首页
![首页](./snapshoot/index.jpg)
###   分类页
![分类页](./snapshoot/category.jpg)
###   主题页
![主题页](./snapshoot/theme.jpg)
###   商品页
![商品页](./snapshoot/product.jpg)
###   购物车
![购物车](./snapshoot/cart.jpg)
###   下订单
![下订单](./snapshoot/pre_order.jpg)
###   订单支付
![订单支付](./snapshoot/pay.jpg)
###   订单支付失败
![订单支付失败](./snapshoot/pay_fail.jpg)
###   用户信息
![用户信息](./snapshoot/user_1.jpg)
![用户信息](./snapshoot/user_2.jpg)