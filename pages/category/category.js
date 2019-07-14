import { Category } from 'category-model.js'

var category = new Category();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenuIndex: 0,
    loadedData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._loadData();
  },

  _loadData: function() {

    category.getCategoryType((categoryData) => {
      this.setData({
        categoryTypeArr: categoryData
      });

      category.getProductsByCategory(categoryData[0].id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        }
        this.setData({
          categoryProducts: dataObj
        });

        this.data.loadedData[0] = dataObj;
      });
    });

  },

  isLoadedData: function(index) {
    if (this.data.loadedData[index]) {
      return true;
    }
    return false;
  },

  changeCategory: function(event) {
    var id = category.getDataSet(event, 'id'),
      index = category.getDataSet(event, 'index');

    this.setData({
      currentMenuIndex: index
    });

    if (!this.isLoadedData(index)) {
      category.getProductsByCategory(id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: this.data.categoryTypeArr[index].img.url,
          title: this.data.categoryTypeArr[index].name
        }
        this.setData({
          categoryProducts: dataObj
        });

        this.data.loadedData[index] = dataObj;
      });
    } else {
      this.setData({
        categoryProducts: this.data.loadedData[index]
      })
    }
  },

  onProductsItemTap: function(event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

})