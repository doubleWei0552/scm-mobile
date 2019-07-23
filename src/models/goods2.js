import { 
  getGoodsList, 
  getTypeList, 
  confirmOrder,
  goodsClassify,
  queryAllcarBrand,
  querycarManufacturer,
  querycarModelsByModel, 
  querycarMaterialList,
} from '@/services/goods';
import { Toast } from 'antd-mobile';
import router from 'umi/router';
import _ from 'lodash';

export default {
  namespace: 'goodsData2',

  state: {
    searchData: [],
    menuData: [],
    BRAND:[], //品牌的数据
    ALLBRAND:[], //所有的品牌信息
    handMenu:[],
    list: [],
    currentUser: {},
    currentPage: 0,
    AllcarBrand:[], //选择页所有的商品品牌
    carManufacturer:[], //商品品牌对应的数据
    carModel: [],  //车子的年份和排量
    installPosition:[],  //安装位置
    brandId:null, //分类页的选择的商品品牌数据
    MODEL:null, //汽车车型
    selectBrand:null,//选择的汽车品牌
    selectModel:null, //选择的车型
  },

  effects: {
    // 获取分类列表
    *getTypeList({ payload, callback }, { call, put }) {
      const result = yield call(getTypeList, payload);
      if (result.status === 'success') {
        yield put({
          type: 'save',
          payload: { menuData: result.data.CATEGORY,ALLBRAND:result.data.ALLBRAND },
        });
        callback && callback(result)
      } else {
        Toast.fail(result.message, 1);
      }
    },

    // 获取商品列表
    *getGoodsList({ payload, callback }, { call, put, select }) {
      const result = yield call(getGoodsList, payload);
      const oldList = yield select(({ goodsData }) => goodsData.list);
      result.data.list.map((item, index) => {
        let isHave = _.findIndex(oldList, ii => ii.ID === item.ID)
        if (isHave == -1) {
          oldList.push(item)
        }
      })
      if (result.status === 'success') {
        yield put({
          type: 'save',
          payload: { list: oldList, currentPage: result.data.currentPage },
        });
      } else {
        Toast.fail(result.message, 1);
      }
      callback && callback(result)
    },

    // 修改商品数量
    *changeGoodsState({ payload }, { call, put, select }) {
      const oldList = yield select(({ goodsData }) => goodsData.list);
      const { isClear, goodsLists } = payload
      if (isClear) {
        _.map(oldList, item => {
          item.number = 0
        })
      }
      yield put({
        type: 'save',
        payload: { list: oldList },
      });
    },

    // 商品分类方法
    *onGoodsClassify({payload,callback},{call,select,put}){
      let {categoryId} = payload
      let params = {
        categoryId
      }
      const result = yield call(goodsClassify,params)
      yield put({type:'save',payload:{handMenu:result.data.PROPERTY,BRAND:[result.data.BRAND] }})
    },
    // 获取商品列表
    *confirmOrder({ payload, callback }, { call, put }) {
      const result = yield call(confirmOrder, payload);
      if (result.status === 'success') {
        Toast.success('下单成功 !!!', 1);
        setTimeout(() => {
          callback && callback(result)
        }, 900);
      } else {
        Toast.fail(result.message, 1);
        callback && callback(result)
      }
    },
    //选择页获取商品所有品牌的数据
    *getAllcarBrand({payload,callback},{call,put,select}){
      const result = yield call(queryAllcarBrand)
      if(callback) callback(result)
      yield put({type:'save',payload:{AllcarBrand:result.data}})
    },
    //品牌对应的车型
    *getcarManufacturer({payload,callback},{call,put,select}){
      let params={
        brandId:payload.brandId
      }
      const result = yield call(querycarManufacturer,params)
      if(callback) callback(result)
      yield put({type:'save',payload:{carManufacturer:result.data}})
    },
    //具体车型对应的年份、安装位置数据
    *getcarModelsByModel({payload},{call,select,put}){
      let {MODEL,ID} = payload
      let params ={
        MODEL,
        ID
      }
      let result = yield call(querycarModelsByModel,params)
      yield put({type:'save',payload:{carModel:result.data.carModel,
        installPosition:result.data.installPosition}})
    },
    //具体车型对应的所有数据
    *getcarMaterialList({payload,callback},{call,select,put}){
      console.log('获取汽车数据',payload)
      let params ={
        ID:payload.ID,
        MODEL:payload.MODEL,
        INSTALLATION_POSITION:payload.INSTALLATION_POSITION,
        CAR_MODEL:payload.CAR_MODEL,
        customerId:payload.customerId,
        userId:payload.userId,
        pageSize:payload.pageSize,
        currentPage:payload.currentPage,
        QUERY:payload.QUERY,
      }
      let result = yield call(querycarMaterialList,params)
      console.log('result',result)
      const oldList = yield select(({ goodsData }) => goodsData.list);
      result.data.list.map((item, index) => {
        let isHave = _.findIndex(oldList, ii => ii.ID === item.ID)
        if (isHave == -1) {
          oldList.push(item)
        }
      })
      if (result.status === 'success') {
        yield put({
          type: 'save',
          payload: { list: oldList, currentPage: result.data.currentPage },
        });
      } else {
        Toast.fail(result.message, 1);
      }
      callback && callback(result)
    },

    
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
