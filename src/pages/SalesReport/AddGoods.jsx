import React from 'react'
import { NavBar, Icon,ListView,Button,List, Stepper,InputItem,WhiteSpace,Picker } from 'antd-mobile'
import { createForm } from 'rc-form'
import router from 'umi/router'
import { connect } from 'dva'
import Scan from './image/Scan.svg' //扫一扫图标
import Right from './image/Right.svg' //向右图标
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
            pageSize: 10,
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
                    <div style={{height:44,borderBottom:'1px solid #f3f3f3'}}>
                        <img onClick={()=>alert('扫一扫还没做！')} style={{height:32,margin:6,float:'left'}} src={Scan} />  
                        <div onClick={()=>router.push('/salesReportSelectGoods')}>
                            <span style={{color:'#c4c4c4',marginTop:9,display:'inline-block' ,fontSize:'1.1rem'}}>选择商品</span>
                            <img style={{height:28,margin:8,float:'right'}} src={Right} /> 
                        </div>  
                    </div>
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