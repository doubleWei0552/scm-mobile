import { query as queryUsers, queryCurrent, queryRSLogin, getUserInfo, queryLogoParameter, queryRSLogOut, changPassword } from '@/services/user';
import { bindWeChat } from '@/services/wechat';
import { Toast } from 'antd-mobile';
import router from 'umi/router';



export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    wechatinfo: {},
    menuData: [],
    userId: '',
  },

  effects: {
    *queryLogoParameter({ }, { call, put }) {
      const result = yield call(queryLogoParameter);
      console.log('tesult', result)

      localStorage.setItem('wechatLoginLogoImg', result.wechatLoginLogoImg);
      localStorage.setItem('wechatLoginTitle', result.wechatLoginTitle);
      localStorage.setItem('wechatLoginSubTitle', result.wechatLoginSubTitle);
      localStorage.setItem('helpLink', result.helpLink);
    },

    *login({ payload }, { call, put }) {
      const params = {
        username: payload.userName,
        password: payload.password,
      };
      const result = yield call(queryRSLogin, params);
      if (result.status === 'success') {
        const userData = result.data;
        const { customerUserList = [], customerId } = userData
        // document.cookie = `ssoSessionId=${_.get(result, 'data.sessionId')}`;
        yield put({
          type: 'save',
          payload: { wechatinfo: userData },
        });
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('sessionId', userData.sessionId);
        console.log('sssdad', customerId)
        if (customerId) {
          localStorage.setItem('customerId', userData.customerId)
          router.push('/homepage')
        } else {
          router.push('/customerselect')
        }

        // router.push('/goodslist')

        // if (customerUserList.length > 1) {
        //   router.push('/customerselect')
        // } else {
        //   router.push('/homepage')
        // }



      } else {
        Toast.fail(result.message, 1);
      }
    },

    // 退出登录
    *queryRSLogOut({ payload }, { call, put }) {
      const result = yield call(queryRSLogOut);
      if (result.status === 'success') {
        localStorage.setItem('sessionId', '')
        router.push('/welcome');
      }
    },

    // 根据code查询当前用户信息
    *getUserInfo({ payload, callback }, { call, put }) {
      const result = yield call(getUserInfo, payload);
      if (result.status === 'success') {
        yield put({
          type: 'save',
          payload: { wechatinfo: result.data },
        });
        localStorage.setItem('userId', result.data.userId);
        localStorage.setItem('sessionId', result.data.sessionId);
      }

      callback && callback(result)
    },

    // 绑定用户
    *bindWeChat({ payload, callback }, { call, put }) {
      const result = yield call(bindWeChat, payload);
      if (result.status === 'success') {
        localStorage.setItem('userId', result.data.userId);
        localStorage.setItem('sessionId', result.data.sessionId);
        router.push('/homepage');
      } else {
        Toast.fail(result.message, 1);
        console.log('result', result)
      }
    },

    *queryCurrent({ payload, callback }, { call, put }) {
      const result = yield call(queryCurrent, payload);
      if (result.status === 'success') {
        callback && callback(result)
      } else {
        Toast.fail(result.message, 1);
      }
    },

    *changPassword({ payload, callback }, { call, put }) {
      const result = yield call(changPassword, payload);
      if (result.status === 'success') {
        callback && callback(result)
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
