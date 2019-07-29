import React from 'react'
import { NavBar, Icon,ListView,Button,List, Stepper,InputItem,WhiteSpace,Picker } from 'antd-mobile'
import { createForm } from 'rc-form'
import router from 'umi/router'
import arrayTreeFilter from 'array-tree-filter'
import { district, provinceLite } from 'antd-mobile-demo-data';
  
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
            }
        })
    }
    getSel() {
        const value = this.state.adressValue;
        if (!value) {
          return '';
        }
        const treeChildren = arrayTreeFilter(district, (c, level) => c.value === value[level]);
        return treeChildren.map(v => v.label).join(',');
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
                        {...getFieldProps('addGoods')}
                        placeholder="录入客户名称"
                    />
                    <Picker data={district} cols={1} {...getFieldProps('contacts')} className="forss">
                        <List.Item arrow="horizontal">
                            <span style={{color:'#bbbbbb'}}>录入联系人</span>
                        </List.Item>
                    </Picker>
                    <Picker data={district} cols={1} {...getFieldProps('phoneNumber')} className="forss">
                        <List.Item style={{color:'#bbbbbb'}} arrow="horizontal">
                            <span style={{color:'#bbbbbb'}}>录入手机号码</span>
                        </List.Item>
                    </Picker>
                    <Picker 
                        visible={this.state.adressvisible}
                        data={district}
                        value={this.state.adressValue}
                        onChange={v => this.setState({ adressValue: v })}
                        onOk={() => this.setState({ adressvisible: false })}
                        onDismiss={() => this.setState({ adressvisible: false })}
                    >
                        <List.Item style={{color:'#bbbbbb'}} extra={this.getSel()} onClick={() => this.setState({ adressvisible: true })}>
                            <span style={{color:'#bbbbbb'}}>选择地址</span>
                        </List.Item>
                    </Picker>
                    <InputItem
                        {...getFieldProps('addressDetail')}
                        placeholder="录入详细地址"
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