import { queryCustomer, serviceAdd } from '@/services/services';
import { Toast } from 'antd-mobile';
import router from 'umi/router';



export default {
  namespace: 'serviceAdd',

  state: {

  },

  effects: {
    *queryCustomer({ payload, callback }, { call }) {
      console.log('payload', payload)
      const result = yield call(queryCustomer, payload);
      callback && callback(result)
    },

    *serviceAdd({ payload, callback }, { call }) {
      console.log('payload', payload)
      payload.CUSTOMER_ID = localStorage.getItem('customerId') * 1;
      const result = yield call(serviceAdd, payload);

      if (result.status === 'success') {
        callback && callback(result)
        router.goBack()
      } else {
        Toast.fail(result.message, 1);
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
