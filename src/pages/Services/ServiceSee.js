import React from 'react'
import { NavBar, Icon,List, TextareaItem,Button,WhiteSpace } from 'antd-mobile'
import { createForm } from 'rc-form'
import router from 'umi/router'
import { connect } from 'dva'
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

    }
    CheckIn=()=>{  //点击签到
        router.push(`/user/service/signIn/${this.state.taskId}`)
    }
    renderButton=()=>{
        let { taskDetail,CUSTOMER,CUSTOMERCONTACT } = this.props.task
        switch(_.get(taskDetail,'status')){
            case 'draft':
                return <div style={{display:'flex',justifyContent:'space-between',}}>
                    <Button onClick={this.delete} style={{width:'45%'}} type="warning">删除</Button>
                    <Button onClick={this.submit} style={{width:'45%'}} type="primary">提交</Button>
                </div>
            break
            case 'submit':
                return <div style={{display:'flex',justifyContent:'space-between',}}>
                    <Button onClick={this.ToAudited} type="primary">待审核</Button>
                </div>
            break
            case 'approve':
                return <div style={{display:'flex',justifyContent:'space-between',}}>
                    <Button onClick={this.CheckIn} type="primary">签到</Button>
                </div>
            break
            case 'close':
                return <div style={{display:'flex',justifyContent:'space-between',}}>
                    <Button onClick={this.delete} style={{width:'45%'}} type="warning">删除</Button>
                    <Button onClick={this.submit} style={{width:'45%'}} type="primary">提交</Button>
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
                    <h2>拜访{_.get(CUSTOMER,'name')}</h2>
                    <p style={{marginBottom:'5px'}}>{_.get(taskDetail,'startTime')} - {_.get(taskDetail,'endTime')}</p>
                    <p style={{marginBottom:'5px'}}>{_.get(CUSTOMER,'name')}</p>
                    <p style={{marginBottom:'5px'}}>{_.get(CUSTOMERCONTACT,'contact')}({_.get(CUSTOMERCONTACT,'mobilePhone')})</p>
                    <div style={{width:'100%',height:'180px'}}>
                        <MapApp {...MapAppProps}/>
                    </div>
                    <p style={{margin:'5px 0'}}>{_.get(taskDetail,'address')}</p>
                <List>
                    <TextareaItem
                        {...getFieldProps('DESCRIBE')}
                        rows={4}
                        placeholder="描述"
                    />
                    <div style={{height:'1rem',width:'100%'}}/>
                    <TextareaItem
                        {...getFieldProps('VISIT_RECORD')}
                        rows={4}
                        placeholder="拜访记录"
                    />
                </List>
                </div>
                <div style={{borderTop:'1px solid #e3e3e3',padding:'1rem',position:'fixed',bottom:0,width:'100%',height:'80px'}}>
                    {this.renderButton()}
                </div>
            </div>
        )
    }
}

const ServiceSee = createForm()(TextareaItemExample);
export default ServiceSee