import { getOrderDetail } from '@/services/order';
import { Toast } from 'antd-mobile';
import router from 'umi/router';



export default {
  namespace: 'order',

  state: {
    orderDList: [],
    order: {},
  },

  effects: {
    // 获取订单详情
    *getOrderDetail({ payload, callback }, { call, put }) {

      const result = yield call(getOrderDetail, payload);
      if (result.status === 'success') {
        yield put({
          type: 'save',
          payload: { order: result.data.order, orderDList: result.data.orderDList },
        });
        callback && callback(result)
      } else {
        Toast.fail(result.message, 1);
        yield put({
          type: 'save',
          payload: { order: {}, orderDList: [] },
        });
      }

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
