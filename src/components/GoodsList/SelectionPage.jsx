import React from 'react'
import { SearchBar, Button, WhiteSpace, WingBlank, Accordion, List, Checkbox, Flex,Grid } from 'antd-mobile'
import { Tree,Collapse } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'
import GoodsList from './Index.jsx'
import styles from './SelectionPage.less'

import car from '@/assets/car.png'

@connect(({ goodsData }) => ({
    goodsData,
}))

export default class SelectionPage extends React.Component {
    state={
        brandId:32,
        isListPage:false, //是否进入详情页
        MANUFACTURER:null, //汽车对应的厂商
        ID:'',
        MODEL:'',
    }
    componentWillMount=()=>{
        this.props.dispatch({type:'goodsData/getAllcarBrand',callback:res=>{
            if(res.status == "success"){
                this.props.dispatch({type:'goodsData/save',
                payload:{brandId:this.props.goodsData.brandId || res.data[0].ID}})
                this.props.dispatch({type:'goodsData/getcarManufacturer',payload:{
                    brandId:this.props.goodsData.brandId || res.data[0].ID
                }})
            }
        }})
    }
    onChangeCarBrand=(item)=>{
        this.props.onGetId(item.ID)
        this.props.dispatch({type:'goodsData/getcarManufacturer',payload:{
            brandId:item.ID
        }})
        this.setState({
            brandId:item.ID
        })
        this.props.dispatch({type:'goodsData/save',payload:{
            brandId:item.ID,
            selectBrand:item
        }})
    }
    onGoSelectPage=()=>{
        this.setState({
            isListPage:false
        })
    }
    //选择车型的函数
    onSelectVehicleType=(value,AllData)=>{
        console.log('item',value,AllData)
        this.props.onGetModel(value,AllData)
        this.props.dispatch({type:'goodsData/save',payload:{
            ID:this.state.brandId,MODEL:value,MANUFACTURER:AllData.MANUFACTURER
        }})
        this.setState({
            // isListPage:true,
            MODEL:value,
            ID:this.state.brandId,
            MANUFACTURER:this.state.MANUFACTURER,
        })
        this.props.dispatch({type:'goodsData/getcarModelsByModel',payload:{
            ID:this.state.brandId,MODEL:value,MANUFACTURER:AllData.MANUFACTURER
        }})
        this.props.onOpenChange()
    }
    render(){
        const GoodsListProps = {
            onGoSelectPage:this.onGoSelectPage,
            MODEL:this.state.MODEL,
            ID:this.state.ID,
        }
        const AllcarBrand = _.get(this.props.goodsData,'AllcarBrand',[])
        const carManufacturer = _.get(this.props.goodsData,'carManufacturer',[])
        const LeftSide = AllcarBrand.map((item,index)=>{
            return <div onClick={()=>this.onChangeCarBrand(item)} style={{background:item.ID == this.props.goodsData.brandId ? 'white' : null,
            borderLeft:item.ID == this.props.goodsData.brandId ? '3px solid #3c8ee2' : null,
            width:100,paddingTop:4,paddingBottom:4,height:30}} key={item.NAME + index}>
                    {item.NAME}
                </div>
            })
        const rightSide = carManufacturer.map((item,index)=>{
            return <div style={{width:'100%',padding:5}} key={index}>
                <span style={{width:'100%',display:'inline-block',textAlign:'left',color:'gray'}}>{item.MANUFACTURER}</span>
                <div style={{width:'100%',border:'1px solid lightgray',minHeight:70,overflow:'hidden'}}>
                    {
                        item.child.map(ii=>{
                            return <div style={{width:'33.3%',height:86,float:'left',overflow:'hidden',marginTop:'15px'}} onClick={()=>this.onSelectVehicleType(ii,item)} key={ii}>
                                <img style={{width:'50%',display:'block',margin:'0 auto'}} src={car} alt="error"/>
                                <span style={{paddingLeft:4,paddingRight:4,display:'inline-block'}}>{ii}</span>
                            </div>
                        })
                    }
                </div>
            </div>
        })
        return(
            <div style={{height:'100%'}}>
                {/* {
                    this.state.isListPage ? <GoodsList getStart={(e,element)=>this.props.getStart(e,element)} {...GoodsListProps}/> : */}
                    <div style={{height:'100%',overflow:'hidden',display:'flex',flexDirection:'row'}}>
                        {/* left部分 */}
                        <div style={{width:100,height:'100%'}}>
                                <div style={{position: 'absolute',width: 100, background: '#e6e6e6',top: 0,bottom:0,height: '100%',overflowX: 'hidden',}}>
                                    <div style={{overflowX: 'hidden',width: 120,height: '100%'}}>
                                        <div style={{width: 100,marginTop:'44px'}}>
                                            {LeftSide}
                                        </div>   
                                    </div> 
                                </div>
                        </div>
                        {/* right部分 */}
                        <div style={{width:'100%',marginLeft:25,height:'100%',overflowY:'auto'}}>
                            <div style={{height:'100%',overflowY:'auto'}}>
                                {rightSide}
                            </div>
                        </div>
                    </div>
                {/* } */}
            </div>
            
        )
    }
}