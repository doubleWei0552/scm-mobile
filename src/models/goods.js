import { getGoodsList, getTypeList, confirmOrder } from '@/services/goods';
import { Toast } from 'antd-mobile';
import router from 'umi/router';
import _ from 'lodash';

export default {
  namespace: 'goodsData',

  state: {
    menuData: [],
    list: [],
    currentUser: {},
    currentPage: 0,
  },

  effects: {
    // 获取分类列表
    *getTypeList({ payload, callback }, { call, put }) {
      const result = yield call(getTypeList, payload);
      if (result.status === 'success') {
        yield put({
          type: 'save',
          payload: { menuData: result.data },
        });
        callback && callback(result)
      } else {
        Toast.fail(result.message, 1);
        console.log('result', result)
      }
    },

    // 获取商品列表
    *getGoodsList({ payload, callback }, { call, put, select }) {
      const result = yield call(getGoodsList, payload);
      const oldList = yield select(({ goodsData }) => goodsData.list);

      if (result.status === 'success') {
        yield put({
          type: 'save',
          payload: { list: _.concat(oldList, result.data.list), currentPage: result.data.currentPage },
        });
      } else {
        Toast.fail(result.message, 1);
      }
      callback && callback(result)
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
      }
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
