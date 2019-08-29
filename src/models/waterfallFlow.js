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
  namespace: 'waterfallFlow',

  state: {
      showData:[], //展示的数据
  },

  effects: {
    *getShowData({payload,callback},{select,put,call}){
        let result = yield call(querycarMaterialList,payload)
        if(result.status= "success"){
          yield put({
            type: 'save',
            payload: { showData: result.data.list },
          });
        } else {
          Toast.fail(result.message, 1);
        }
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
