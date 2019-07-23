import React from 'react'
import { NavBar, Icon,List, TextareaItem,Button,WhiteSpace } from 'antd-mobile'
import { createForm } from 'rc-form'
import router from 'umi/router'
import { connect } from 'dva'
import moment from 'moment'
import MapApp from '@/components/MapModule/Index'

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
    updataWorkTasks=()=>{
        this.props.form.validateFields((error, value) => {
            if(!error){
                this.props.dispatch({type:'task/updataWorkTasks',payload:{
                    EXPLAIN:value.EXPLAIN,
                    Id:this.state.taskId,
                    REGISTRATION_DATE:moment().valueOf()
                }})
            }
        });
    }
    render(){
        const { getFieldProps } = this.props.form
        let { taskDetail,CUSTOMER,CUSTOMERCONTACT } = this.props.task
        const MapAppProps = {
            longitude:_.get(taskDetail,'longitude')*1,
            latitude:_.get(taskDetail,'latitude')*1,
        }
        return (
            <div>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick={() => router.goBack()}
                >任务签到</NavBar>
                <div style={{padding:'1rem'}}>
                <h2>拜访{_.get(CUSTOMER,'name')}</h2>
                    <p style={{marginBottom:'5px'}}>{moment().format('YYYY年MM月DD HH:mm')}</p>
                    <p style={{marginBottom:'5px'}}>{_.get(CUSTOMER,'name')}</p>
                    <p style={{marginBottom:'5px'}}>{_.get(CUSTOMERCONTACT,'contact')}({_.get(CUSTOMERCONTACT,'mobilePhone')})</p>
                    <div style={{width:'100%',height:'180px'}}>
                        <MapApp {...MapAppProps}/>
                    </div>
                    <p style={{margin:'5px 0'}}>{_.get(taskDetail,'address')}</p>
                <List>
                    <TextareaItem
                        {...getFieldProps('EXPLAIN')}
                        rows={4}
                        placeholder="描述"
                    />
                </List>
                </div>
                <div style={{padding:'1rem',position:'absolute',bottom:0,width:'100%',height:'80px'}}>
                    <Button onClick={this.updataWorkTasks} type="primary">签到</Button>
                </div>
            </div>
        )
    }
}

const ServiceSignIn = createForm()(TextareaItemExample);
export default ServiceSignIn