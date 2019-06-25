import { getOrderList } from '@/services/order';
import { Toast } from 'antd-mobile';
import router from 'umi/router';

export default {
  namespace: 'orderList',

  state: {
    orderList: [],  //所有的数据,页面所有数据
    orderData: {},  //当前页数展示的数据
  },

  effects: {
    //获取订单列表数据
    *getOrderList({ payload, callback }, { put, call, select }) {
      const customerId = localStorage.getItem('userId') * 1
      const orderList = yield select(({ orderList }) => orderList.orderList)
      let { searchParams, pageSize, totalRecord, currentPage } = payload
      const params = {
        searchParams,
        customerId,
        pageSize,
        totalRecord,
        currentPage,
      }
      const result = yield call(getOrderList, payload)
      result.data.list.map(item => {
        orderList.push(item)
      })
      if (callback) callback(result)
      yield put({ type: 'save', payload: { orderData: result.data, orderList } })
    },
    //订单列表模糊搜索
    *getSearch({ payload, callback }, { call, put, select }) {
      const customerId = localStorage.getItem('userId') * 1
      const orderList = yield select(({ orderList }) => orderList.orderList)
      let { searchParams, pageSize, totalRecord, currentPage } = payload.params
      const params = {
        searchParams,
        customerId,
        pageSize,
        totalRecord,
        currentPage,
      }
      const result = yield call(getOrderList, params)
      if (callback) callback(result)
      yield put({ type: 'save', payload: { orderData: result.data, orderList: result.data.list } })
    }
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
