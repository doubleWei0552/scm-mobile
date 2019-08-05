import { 
  querySalesOrder,
  queryMaterialList,
  queryOrdersSubmit,
  queryOrdersUpdate,
 } from '@/services/salesReport';
import { Toast } from 'antd-mobile';
import router from 'umi/router';

//销售提报
export default {
  namespace: 'salesReport',

  state: {
    SalesReportList:[],
    SalesGoodsList:[], //新增时，选择商品的数据
    SalesSelectGoods:{}, //新增时，选择的数据(当前选择的那一条数据)
    SalesAllSelectGoods:[], //新增时，选择的数据（所有被选择的数据）
    OrderSelectData:{}, //列表页，选择进入详情页的数据
  },

  effects: {
    //获取销售提报页面的列表数据
    *getSalesOrder({payload,callback},{call,put,select}){
      let SalesReportList = yield select(({salesReport})=>salesReport.SalesReportList)
      const customerId = localStorage.getItem('customerId') * 1;
      let params = {
        data:{
          CUSTOMER_ID:customerId,
          PAGECOUNT:10,
          PAGEINDEX:payload.PAGEINDEX,
        }
      }
      let result = yield call(querySalesOrder,params)
      result.body.map(item => {
        SalesReportList.push(item)
      })
      if(result.success){
        yield put({type:'save',payload:{SalesReportList}})
      } else {
        Toast.fail(result.msg, 1)
      }
      if(callback) callback(result)
    },
    //添加商品页面获取商品数据
    *getByCarModel({payload,callback},{select,put,call}){
      const SalesGoodsList = yield select(({salesReport})=>salesReport.SalesGoodsList)
      const customerId = localStorage.getItem('customerId') * 1
      const userId = localStorage.getItem('userId') * 1;
      let params = {
          customerId,
          userId,
          pageSize:10,
          currentPage:payload.currentPage,
          QUERY:payload.search,  //搜索条件  
      }
      let result = yield call(queryMaterialList,params)
      result.data.list.map(item => {
        SalesGoodsList.push(item)
      })
      yield put({type:'save',payload:{SalesGoodsList}})
      if(callback) callback(result)
    },
    // 通过扫一扫添加的商品
    *getCarModelBySaoYiSao({payload,callback},{select,put,call}){
      const SalesGoodsList = yield select(({salesReport})=>salesReport.SalesGoodsList)
      const customerId = localStorage.getItem('customerId') * 1
      const userId = localStorage.getItem('userId') * 1;
      let params = {
          customerId,
          userId,
          pageSize:10,
          currentPage:payload.currentPage,
          QUERY:payload.search,  //搜索条件  
      }
      let result = yield call(queryMaterialList,params)
      yield put({type:'save',payload:{SalesSelectGoods:result.data.list[0]}})
      if(callback) callback(result)
    },
    //订单页详情页提交的方法
    *getOrdersUpdate({payload,callback},{put,select,call}){
      let params = {
        data:{
          ModifyData:payload.ModifyData
        }
      }
      let result = yield call(queryOrdersUpdate,params)
      if(result.success){
        Toast.success(result.msg, 1);
        router.push('/salesReport')
        yield put({type:'save'})
      } else {
        Toast.fail('系统异常，请稍后重试！', 1)
      }
    },
    //提交订单接口
    *getOrdersSubmit({payload,callback},{call,select,put}){
      let SalesAllSelectGoods = yield select(({salesReport})=>salesReport.SalesAllSelectGoods)
      const customerId = localStorage.getItem('customerId') * 1
      const userId = localStorage.getItem('userId') * 1;
      let params = {
        data:{
          type:payload.type,
          Customer:payload.Customer,
          Goods:SalesAllSelectGoods,
          customerId,
          userId,
        }
      }
      let result = yield call(queryOrdersSubmit,params)
      if(result.success){
        Toast.success(result.msg, 1);
        router.push('/salesReport')
      } else {
        Toast.fail('系统异常，请稍后重试！', 1)
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
  },
};
