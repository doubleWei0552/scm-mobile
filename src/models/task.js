import { 
    getTaskDetail,
    getUpdataDetail,
    getdeledetById,
    updataWorkTasks,
  } from '@/services/task';
  import { Toast } from 'antd-mobile';
  import router from 'umi/router';
  import _ from 'lodash';
  
  export default {
    namespace: 'task',
  
    state: {
        taskDetail:null, //任务单详情
        CUSTOMERCONTACT:null,
        CUSTOMER:null,
    },
  
    effects: {
       //任务详情接口
      *getTaskDetails({payload,callback},{select,put,call}){
          let params = {
              Id:payload.Id
          }
          let result = yield call(getTaskDetail,params)
          yield put({type:'save',payload:{
              taskDetail:result.data.WORKTASKS,
              CUSTOMERCONTACT:result.data.CUSTOMERCONTACT,
              CUSTOMER:result.data.CUSTOMER,
            }})
      },
       //任务详情提交接口
      *getUpdataDetail({payload,callback},{select,put,call}){
        Toast.loading('Loading...')
        let params = {
            ID:payload.Id *1,
            DESCRIBE:payload.DESCRIBE,
            VISIT_RECORD:payload.VISIT_RECORD,
        }
        let result = yield call(getUpdataDetail,params)
        if(result.success){
            Toast.hide()
            Toast.success('任务提交成功', 1);
            router.goBack()
        } else {
            Toast.fail('发生未知错误 !!!', 1);
        }
      },
      //任务详情删除接口
      *getdeledetById({payload,callback},{select,put,call}){
        let params = {
            ID:payload.Id *1,
        }
        let result = yield call(getdeledetById,params)
        if(result.success){
            Toast.success('删除成功', 1);
            router.goBack()
        } else {
            Toast.fail('发生未知错误 !!!', 1);
        }
      },
      //任务签到页签到接口
      *updataWorkTasks({payload,callback},{select,put,call}){
        let params = {
            ID:payload.Id *1,
            EXPLAIN:payload.EXPLAIN,
            REGISTRATION_DATE:payload.REGISTRATION_DATE,
        }
        let result = yield call(updataWorkTasks,params)
        console.log('提交结果',result)
        if(result.success){
            Toast.success('签到成功', 1);
            router.goBack()
        } else {
            Toast.fail('发生未知错误 !!!', 1);
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
    },
  };
  