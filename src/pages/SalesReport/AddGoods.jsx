import React from 'react'
import { Toast,NavBar, Icon,ListView,Button,List, Stepper,InputItem,WhiteSpace,Picker } from 'antd-mobile'
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
        Num:null, //数量
        Price:null, //单价
        SalesSelectGoods:{}, //用户选择的商品
    }

    componentDidMount=()=>{
        if(this.props.location.query.CODE){
            this.props.dispatch({
                type:'salesReport/getCarModelBySaoYiSao',
                payload:{currentPage:1,search:this.props.location.query.CODE},
            })
            setTimeout(()=>{
                let SalesSelectGoods = _.get(this.props.salesReport,'SalesSelectGoods')
                this.setState({
                    SalesSelectGoods
                })
            },600)
        } else {
            let SalesSelectGoods = _.get(this.props.salesReport,'SalesSelectGoods')
            this.setState({
                SalesSelectGoods
            })
        }
    }
    addNum=(e)=>{
        let {SalesSelectGoods} = this.state
        if(SalesSelectGoods.GOODS_NAME){
            this.setState({
                Num:e
            })
            SalesSelectGoods.setNum = e*1
        } else {
            Toast.info('请先选择商品 !!!', 1);
        }
    }
    addPrice=(e)=>{
        let {SalesSelectGoods} = this.state
        if(SalesSelectGoods.GOODS_NAME){
            this.setState({
                Price:e
            })
            SalesSelectGoods.setPrice = e*1
        } else {
            Toast.info('请先选择商品 !!!', 1);
        }
    }
    submit=()=>{
        let {SalesAllSelectGoods} = this.props.salesReport
        let {SalesSelectGoods} = this.state
        if(SalesSelectGoods.GOODS_NAME){
            SalesAllSelectGoods.push(SalesSelectGoods)
            this.props.dispatch({type:'salesReport/save',payload:{
                SalesAllSelectGoods
            }})
            router.push('/salesReportGoodsList')
        } else {
            Toast.info('请先选择要添加的商品 !!!', 1);
        }
    }
    componentWillUnmount=()=>{
        this.props.dispatch({type:'salesReport/save',payload:{
            SalesSelectGoods:{}
        }})
        this.setState({
            Num:null, 
            Price:null, 
            SalesSelectGoods:{},
        })
    }
    render(){
        const { getFieldProps } = this.props.form;
        let {Num,Price,SalesSelectGoods} = this.state
        return(
            <div>
                <NavBar
                    mode="dark"
                    leftContent={[
                        <Icon onClick={()=>router.push('/salesReport')} key="0" type="left" />,
                    ]}
                >添加商品
                </NavBar>
                <WhiteSpace />
                <List>
                    <div style={{height:44,borderBottom:'1px solid #f3f3f3'}}>
                        <a href={`http://sao315.com/w/api/saoyisao?redirect_uri=${window.location.origin}/mobile?pparams=/salesReportAddGoods`}>
                            <img style={{height:32,margin:6,float:'left'}} src={Scan} />  
                        </a>
                        <div onClick={()=>router.push('/salesReportSelectGoods')} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                            <span style={{color:SalesSelectGoods.GOODS_NAME ? 'black' : '#c4c4c4',marginTop:9,display:'inline-block',fontSize:'1.1rem' }}>
                                {SalesSelectGoods.GOODS_NAME ? SalesSelectGoods.GOODS_NAME : '选择商品'}
                            </span>
                            <img style={{height:28,margin:8,float:'right'}} src={Right} /> 
                        </div>  
                    </div>
                    <InputItem
                        clear value={Num} onChange={(e)=>this.addNum(e)}
                        placeholder="录入数量"
                    >数量：</InputItem>
                    <InputItem
                        clear value={Price} onChange={(e)=>this.addPrice(e)}
                        placeholder="录入单价"
                    >单价：</InputItem>
                    <InputItem
                        clear value={(Num && Price) ? Num*Price : null}
                        placeholder="0" editable={false}
                    >金额：</InputItem>
                </List>
                <div style={{bottom:15,position:'absolute',width:'100%'}}>
                    <Button onClick={()=>router.push('/salesReport')} style={{width:'45%',marginLeft:10,float:'left'}} type='warning'>取消</Button>
                    <Button onClick={this.submit} style={{width:'45%',marginRight:10,float:'right'}} type='primary'>添加</Button>
                </div>
            </div>
        )
    }
}

const AddGoods = createForm()(AddGoodsForm)
export default AddGoods