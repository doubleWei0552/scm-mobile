import React from 'react'
import { NavBar, Icon,ListView,Button,List, Stepper,InputItem,WhiteSpace,Picker } from 'antd-mobile'
import { createForm } from 'rc-form'
import router from 'umi/router'
import { connect } from 'dva'
import { district, provinceLite } from 'antd-mobile-demo-data';

@connect(({ salesReport, loading }) => ({
    salesReport,
}))  
class AddGoodsForm extends React.Component{
    state={
        goodsData:[]
    }
    componentDidMount=()=>{
        this.props.dispatch({type:'salesReport/getByCarModel',payload:{
            pageSize: 100,
            currentPage:1,
        },callback:res=>{
            this.setState({
                goodsData:res.data.list
            })
        }})
    }
    submit=()=>{
        this.props.form.validateFields((error, value)=>{
            if(!error){
                console.log('录入数据',value)
            }
        })
        router.push('/salesReportGoodsList')
    }
    render(){
        const { getFieldProps } = this.props.form;
        let { goodsData } = this.state
        console.log('goodsData',goodsData)
        return(
            <div>
                <NavBar
                    mode="dark"
                    leftContent={[
                        <Icon onClick={()=>router.goBack()} key="0" type="left" />,
                    ]}
                >添加商品
                </NavBar>
                <WhiteSpace />
                <List>
                    <Picker data={goodsData} cols={1} {...getFieldProps('addGoods')} className="forss">
                        <List.Item style={{color:'#bbbbbb'}} arrow="horizontal">
                            <span style={{color:'#bbbbbb'}}>录入商品</span>
                        </List.Item>
                    </Picker>
                    <InputItem
                        {...getFieldProps('addNum')}
                        placeholder="录入数量"
                    />
                    <InputItem
                        {...getFieldProps('addPrice')}
                        placeholder="录入单价"
                    />
                    <InputItem
                        {...getFieldProps('money')}
                        placeholder="金额"
                    />
                </List>
                <div style={{bottom:15,position:'absolute',width:'100%'}}>
                    <Button onClick={()=>router.goBack()} style={{width:'45%',marginLeft:10,float:'left'}} type='warning'>取消</Button>
                    <Button onClick={this.submit} style={{width:'45%',marginRight:10,float:'right'}} type='primary'>添加</Button>
                </div>
            </div>
        )
    }
}

const AddGoods = createForm()(AddGoodsForm)
export default AddGoods