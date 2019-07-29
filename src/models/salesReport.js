import { 
  querySalesOrder,
  queryByCarModel 
 } from '@/services/salesReport';
import { Toast } from 'antd-mobile';
import router from 'umi/router';

//销售提报
export default {
  namespace: 'salesReport',

  state: {
    SalesReportList:[]
  },

  effects: {
    //获取销售提报页面的列表数据
    *getSalesOrder({payload,callback},{call,put,select}){
      const customerId = localStorage.getItem('customerId') * 1;
      let params = {
        data:{
          CUSTOMER_ID:customerId,
          PAGECOUNT:payload.PAGECOUNT,
          PAGEINDEX:payload.PAGEINDEX,
        }
      }
      let result = yield call(querySalesOrder,params)
      if(result.success){
        yield put({type:'save',payload:{SalesReportList:result.body}})
      } else {
        Toast.fail(result.msg, 1)
      }
      if(callback) callback(result)
    },
    //添加商品页面获取商品数据
    *getByCarModel({payload,callback},{select,put,call}){
      const customerId = localStorage.getItem('customerId') * 1
      const userId = localStorage.getItem('userId') * 1;
      let params = {
        customerId,
        userId,
        pageSize: payload.pageSize,
        currentPage: payload.currentPage,    
      }
      let result = yield call(queryByCarModel,params)
      if(callback) callback(result)
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
