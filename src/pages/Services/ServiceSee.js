import React from 'react'
import { NavBar, Icon,List, TextareaItem,Button,WhiteSpace,Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import router from 'umi/router'
import { connect } from 'dva'
import moment from 'moment'
import MapApp from '@/components/MapModule/Index'
import _ from 'lodash'

@connect(({ task }) => ({
    task,
  }))
class TextareaItemExample extends React.Component{
    constructor(props){
        super(props)
        this.state={
            taskId:null
        }
    }

    componentDidMount=()=>{
        this.getTaskData()
    }
    getTaskData =()=>{
        const { dispatch, match } = this.props;
        const taskId = _.get(match, 'params.orderId')
        dispatch({
            type:'task/getTaskDetails',payload:{Id:taskId}
        })
        this.setState({
            taskId
        })
    }
    ToAudited=()=>{ //待审核方法
        this.props.form.validateFields((error, value) => {
            if(!error){
                this.props.dispatch({
                    type:'task/updataStatus',payload:{
                        Id:this.state.taskId,
                        DESCRIBE:value.DESCRIBE,
                        Sign_In:value.Sign_In,
                    }
                })
            }
        }); 
    }
    CheckIn=()=>{  //点击签到
        // router.push(`/user/service/signIn/${this.state.taskId}`)
        this.props.form.validateFields((error, value) => {
            if(!error){
                if(value.Sign_In){
                    this.props.dispatch({
                        type:'task/updataWorkTasks',
                        payload:{
                            DESCRIBE:value.DESCRIBE,
                            Sign_In:value.Sign_In,
                            Id:this.state.taskId,
                            REGISTRATION_DATE:moment().valueOf()
                    }})
                } else {
                    Toast.fail('请填写签到记录 !!!', 1);
                }
            }
        });
    }
    onVisit=()=>{
        this.props.form.validateFields((error, value) => {
            if(!error){
                if(value.VISIT_RECORD){
                    const taskId = _.get(this.state, 'taskId')
                    this.props.dispatch({
                        type:'task/updataWorkTesksEnum',payload:{
                            Id:taskId,
                            DESCRIBE:value.DESCRIBE,
                            VISIT_RECORD:value.VISIT_RECORD,
                            Sign_In:value.Sign_In,
                        }
                    })
                    this.setState({
                        taskId
                    })
                } else {
                    Toast.fail('请填写拜访记录 !!!', 1);
                }
            }
        }); 
    }
    renderButton=()=>{
        let { taskDetail,CUSTOMER,CUSTOMERCONTACT } = this.props.task
        switch(_.get(taskDetail,'buttonStatus')){
            case 'draft':
                return <div style={{display:'flex',justifyContent:'space-between',}}>
                    <Button onClick={this.delete} style={{width:'45%'}} type="warning">删除</Button>
                    <Button onClick={this.submit} style={{width:'45%'}} type="primary">提交</Button>
                </div>
            break
            case 'submit':
                return <div>
                    <Button onClick={this.ToAudited} type="primary">审核</Button>
                </div>
            break
            case 'approve':
                return <div>
                    <Button onClick={this.CheckIn} type="primary">签到</Button>
                </div>
            break
            case 'signedin':
                return <div>
                    <Button onClick={this.onVisit} type="primary">拜访</Button>
                </div>
            break
            case 'offthestocks':
                return <div onClick={()=>router.goBack()}>
                    <Button onClick={this.onVisit} type="primary">返回</Button>
                </div>
            break
            default:
                break
        }
    }
    submit=()=>{
        this.props.form.validateFields((error, value) => {
            if(!error){
                this.props.dispatch({
                    type:'task/getUpdataDetail',payload:{
                        Id:this.state.taskId,
                        DESCRIBE:value.DESCRIBE,
                        VISIT_RECORD:value.VISIT_RECORD,
                        Sign_In:value.Sign_In,
                    }
                })
            }
        });      
    }
    delete=()=>{
        this.props.dispatch({
            type:'task/getdeledetById',payload:{
                Id:this.state.taskId
            }
        })
    }
    render(){
        let showTime = _.get(this.props.task.taskDetail,'buttonStatus') == 'draft' || _.get(this.props.task.taskDetail,'buttonStatus') == 'offthestocks'
        const { getFieldProps } = this.props.form
        let { taskDetail,CUSTOMER,CUSTOMERCONTACT } = this.props.task
        const MapAppProps = {
            longitude:_.get(taskDetail,'longitude')*1,
            latitude:_.get(taskDetail,'latitude')*1,
        }
        return (
            <div style={{height:'100%'}}>
                <div style={{height:'45px'}}>
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left" />}
                        onLeftClick={() => router.goBack()}
                    >任务详情</NavBar>
                </div>
                <div style={{paddingLeft:'1rem',height:'calc(100% - 125px)',overflow:'auto'}}>
                    <h1 style={{margin:0}}>{_.get(taskDetail,'subject')}</h1>
                    <h3>拜访{_.get(CUSTOMER,'name')}{_.get(CUSTOMERCONTACT,'contact')}</h3>
                    <p style={{marginBottom:'5px',display:showTime ? 'block' : 'none'}}>{_.get(taskDetail,'startTime') ?
                    `${_.get(taskDetail,'startTime')} - ${_.get(taskDetail,'endTime')}` : 
                    `${moment(_.get(taskDetail,'startDate')).format('YYYY-MM-DD hh:mm:ss')} - ${moment(_.get(taskDetail,'endDate')).format('YYYY-MM-DD hh:mm:ss')}` }
                    </p>
                    <p style={{marginBottom:'5px'}}>{_.get(CUSTOMER,'name')}</p>
                    <p style={{marginBottom:'5px'}}>{_.get(CUSTOMERCONTACT,'contact')}({_.get(CUSTOMERCONTACT,'mobilePhone')})</p>
                    <div style={{width:'100%',height:'180px'}}>
                        <MapApp {...MapAppProps}/>
                    </div>
                    <p style={{margin:'5px 0'}}>{_.get(taskDetail,'address')}</p>
                <List style={{background:'pink'}}>
                    <TextareaItem
                        {...getFieldProps('DESCRIBE', {
                            initialValue: _.get(this.props.task,'taskDetail.describe'),
                          })}
                        disabled={true}
                        rows={4}
                        placeholder="描述"
                    />
                    <div style={{borderBottom:'1px solid #dddddd',display:(_.get(taskDetail,'buttonStatus') == 'approve' || _.get(taskDetail,'buttonStatus') == 'signedin' || _.get(taskDetail,'buttonStatus') == 'offthestocks') ? 'block' : 'none'}}>                           
                        <TextareaItem
                            {...getFieldProps('Sign_In', {
                                initialValue: _.get(this.props.task,'taskDetail.explain'),
                              })}
                            disabled={_.get(taskDetail,'buttonStatus') == 'approve' ? false : true}
                            rows={4}
                            placeholder="签到记录"
                        />
                    </div>
                    <div style={{display:(_.get(taskDetail,'buttonStatus') == 'signedin' || _.get(taskDetail,'buttonStatus') == 'offthestocks') ? 'block' : 'none'}}>                           
                        <TextareaItem
                            {...getFieldProps('VISIT_RECORD', {
                                initialValue: _.get(this.props.task,'taskDetail.visitRecord'),
                              })}
                            disabled={_.get(taskDetail,'buttonStatus') == 'signedin' ? false : true}
                            rows={4}
                            placeholder="拜访记录"
                        />
                    </div>
                </List>
                </div>
                <div style={{borderTop:'1px solid #e3e3e3',padding:'1rem',position:'absolute',bottom:0,width:'100%',height:'80px'}}>
                    {this.renderButton()}
                </div>
            </div>
        )
    }
}

const ServiceSee = createForm()(TextareaItemExample);
export default ServiceSee