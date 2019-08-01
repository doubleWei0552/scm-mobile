import React from 'react'
import { NavBar, Icon,ListView,Button,List,TextareaItem, Stepper,InputItem,WhiteSpace,Picker } from 'antd-mobile'
import { createForm } from 'rc-form'
import router from 'umi/router'
import {connect} from 'dva'
import AddressCom from '@/components/AddressCom/Index'
import arrayTreeFilter from 'array-tree-filter'
import { district, provinceLite } from 'antd-mobile-demo-data';
  
@connect(({ salesReport, loading }) => ({
    salesReport,
}))
class AddCustomerForm extends React.Component{
    state={
        adressvisible: false,
        adressValue:[],
    }
    submit=()=>{
        this.props.form.validateFields((error, value)=>{
            if(!error){
                value.adressValue = this.state.adressValue
                console.log('录入数据',value)
                this.props.dispatch({type:'salesReport/getOrdersSubmit',payload:{
                    Customer:value
                }})
            }
        })
    }
    addressChange=(value)=>{
        this.setState({
            adressValue:value
        })
    }
     
    render(){
        const { getFieldProps } = this.props.form;
        return(
            <div>
                <NavBar
                    mode="dark"
                    leftContent={[
                        <Icon onClick={()=>router.goBack()} key="0" type="left" />,
                    ]}
                >录入客户信息
                </NavBar>
                <WhiteSpace />
                <List>
                    <InputItem
                        {...getFieldProps('name')}
                        placeholder="录入客户名称"
                    />
                    <InputItem
                        {...getFieldProps('contacts')}
                        placeholder="录入联系人"
                    />
                    <InputItem
                        {...getFieldProps('phoneNumber')}
                        placeholder="录入手机号码"
                    />
                    <AddressCom addressChange={(e)=>this.addressChange(e)} />
                    <TextareaItem
                        {...getFieldProps('addressDetail')}
                        placeholder="录入详细地址"
                        rows={5}
                        count={100}
                    />
                </List>
                <div style={{bottom:15,position:'absolute',width:'100%'}}>
                    <Button style={{width:'45%',marginLeft:10,float:'left'}} type='primary'>保存</Button>
                    <Button onClick={this.submit} style={{width:'45%',marginRight:10,float:'right'}} type='primary'>添加</Button>
                </div>
            </div>
        )
    }
}

const AddCustomer = createForm()(AddCustomerForm)
export default AddCustomer