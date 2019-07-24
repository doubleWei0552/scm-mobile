import React from 'react'
import { SearchBar, Button, WhiteSpace, WingBlank, Accordion, List, Checkbox, Flex,Drawer, NavBar, Icon } from 'antd-mobile'
import { Tree,Collapse } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'

import GoodsModul from './GoodsModul'
import SelectionPage from './SelectionPage'
import screen from './image/screen.svg' //右上角变化表格图标
import screenOpen from './image/screenOpen.png' //右上角open以后的图标
import screens from './image/screens.svg' //筛选排序图标
import Scan from './image/Scan.svg' //扫一扫图标
import goBack from './image/goBack.png' //返回图标
import descend from './image/descend.svg' //下降排序
import scend from './image/scend.svg' //上升排序
import disort from './image/disort.svg' //无序默认排布
import down from './image/down.svg' //向下箭头
import upward from './image/Upward.svg' //向上箭头
import styles from './Index.less'
import { element } from 'prop-types';

const CheckboxItem = Checkbox.CheckboxItem;
const { TreeNode } = Tree;
const { Panel } = Collapse

@connect(({ goodsData }) => ({
    goodsData,
}))

export default class GoodsList extends React.Component {
    state = {
        PriceRanking: null, //价格筛选的图标展示
        subscript: 0, //筛选底部的下标线展示
        isMask: false, //是否展示遮罩层
        ChoiceButton: null, //选择的筛选按钮，用于判断哪个要触发下拉框
        choiceBox:[], //选择框选择到的数据
        category:{}, //分类
        INSTALLATION_POSITION:'', //选择的安装位置
        CAR_MODEL:'', //汽车年份
        open: false, //抽屉管控
        MANUFACTURER:null, //汽车对应的厂商
        brandId:null,
        MODEL:null,
        search:'',
    }
    componentWillMount=()=>{
        if(this.props.location.query.CODE){
            this.setState({
                search:this.props.location.query.CODE
            })
            this.onSearchBarChange(this.props.location.query.CODE)
        }
    }
    
    onOpenChange = (...args) => {
        this.setState({ open: !this.state.open,search:'' });
    }
    
    onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    };    

    getTypeList = () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'goodsData/getTypeList',
          payload: {},
          callback: response => {
            if (response.status === 'success') {
              const value = [_.get(response, 'data[0].ID'), _.get(response, 'data[0].CHILD[0].ID')];
              this.setState({
                value,
              })
            }
          }
        })
    }

    //列表页延时搜索
    timeOut = null
    onSearchBarChange = (value) => {
        if(this.timeOut)clearTimeout(this.timeOut)
        this.setState({
            search:value,
            MODEL:null
        })
        this.timeOut = setTimeout(()=>this.fn(value),1000)
    };
    fn=(value)=>{
        this.child.getGoodsList(false,'','','',[],value)
        if(this.timeOut){
            clearTimeout(this.timeOut)
            this.timeOut = null
        }
    }

    onScan = () => {
        console.log('点击扫一扫按钮')
    }

    onScreen = () => {
        console.log('点击筛选按钮')
    }

    onDismask = () => { //点击遮罩层的方法
        this.setState({
            isMask: false,
            ChoiceButton: null,
        })
    }

    onCheckboxChange = (value) => { // 复选框的选择事件
        let choiceBox = this.state.choiceBox
        let index = _.findIndex(choiceBox,item => item.ID == value.ID)
        if(index > -1){
            choiceBox.splice(index,1)
        } else {
            choiceBox.push(value)
        }
        this.setState({
            choiceBox
        })
    }

    onClassification =(value)=>{  //分类选择事件
        this.child.getGoodsList(false,this.state.INSTALLATION_POSITION,value.CAR_MODEL,'',[])
        this.setState({
            ChoiceButton:null,
            isMask:false,
            CAR_MODEL:value.CAR_MODEL,
        })
    }

    onPosition =(value)=>{
        this.child.getGoodsList(false,value.INSTALLATION_POSITION,this.state.CAR_MODEL,'',[])
        this.setState({
            ChoiceButton:null,
            isMask:false,
            INSTALLATION_POSITION:value.INSTALLATION_POSITION,
        })
    }

    onRef = (ref) => {
        this.child = ref
    }

    onChoiceButton = (value) => {
        this.setState({
            isMask: this.state.ChoiceButton == value ? false : true,
            ChoiceButton: this.state.ChoiceButton == value ? null : value
        })
    }
    floatFrame=()=>{
        if(!_.isEmpty(this.state.MODEL)){
            if(this.state.ChoiceButton == '汽车排量年份'){
                return _.get(this.props.goodsData, 'carModel').map((item, index) => {
                    return <div key={index} style={{ background: '#efeff4',minHeight:'35px' }}>
                        <div style={{ overflow: 'hidden' }}> 
                            <p onClick={()=>this.onClassification(item)} style={{height:'35px',padding:0,margin:0,lineHeight:'35px',borderBottom:'1px solid lightgray'}}>{item.CAR_MODEL}</p>
                        </div>
                    </div>
                })
            } else if(this.state.ChoiceButton == '安装位置'){
                return _.get(this.props.goodsData, 'installPosition').map((item, index) => {
                    return <div key={index} style={{ background: '#efeff4',minHeight:'35px' }}>
                        <div style={{ overflow: 'hidden' }}> 
                            <p onClick={()=>this.onPosition(item)} style={{height:'35px',padding:0,margin:0,lineHeight:'35px',borderBottom:'1px solid lightgray'}}>{item.INSTALLATION_POSITION}</p>
                        </div>
                    </div>
                })
            }
        }
    }
    onGetModel=(value,AllData)=>{
        this.setState({
            MODEL:value,
            MANUFACTURER:AllData.MANUFACTURER,
        })
    }
    onGetId=(value)=>{
        this.setState({
            brandId:value
        })
    }

    render() {
        console.log('搜索框的值',this.state.search)
        const goodsModulProps = {
            CAR_MODEL:this.state.CAR_MODEL,
            INSTALLATION_POSITION:this.state.INSTALLATION_POSITION,
            MODEL:this.state.MODEL,
            ID:this.state.brandId,
            MANUFACTURER:this.state.MANUFACTURER,
            INSTALLATION_POSITION:this.state.INSTALLATION_POSITION, //选择的安装位置
            CAR_MODEL:this.state.CAR_MODEL,
            search:this.state.search,
            onDismask:this.onDismask,
            isMask:this.state.isMask,
        }
        const SelectionPageProps = {
            onOpenChange:this.onOpenChange,
            onGetId:this.onGetId,
            onGetModel:this.onGetModel,
        }
        const {brandId,MODEL} = this.state
        const {selectBrand} = this.props.goodsData
        const nameMODEL = this.props.goodsData.MODEL
        return (
            <div className={styles.GoodsList}>
                {/* 遮罩层 */}
                {/* <div onClick={this.onDismask} style={{ display: this.state.isMask ? 'block' : 'none', zIndex: 1000 }} className={styles.Mask} /> */}
                {/* 搜索输入框 */}
                <div style={{ zIndex: 10000, position: 'relative' }} className={styles.searchBarBox}>
                    <div className={styles.Scan} onClick={this.onScan}>
                        <a href={`http://sao315.com/w/api/saoyisao?redirect_uri=${window.location.origin}/mobile?pparams=/homepage/goodList`}>
                            <img src={Scan} alt="error" />
                        </a>
                    </div>
                    <div className={styles.searchBar}>
                        <SearchBar placeholder="请输入查询条件" value={this.state.search} onChange={this.onSearchBarChange} />
                    </div>
                    <div className={this.state.open ? styles.screenOpen : styles.screen}>
                        <img src={this.state.open ? screenOpen : screen} onClick={this.onOpenChange} alt="error" />
                    </div>
                </div>
                { 
                    this.state.open ? <SelectionPage {...SelectionPageProps}/> : 
                    <div style={{position: 'relative',height:'100%' }} className={styles.screenBox}>
                    {/* <div style={{color:'gray',zIndex:100000,height:'30px',width:'100%',textAlign:'left',lineHeight:'30px',padding:'0 1rem'}}>
                        {`已选择：${selectBrand ? selectBrand.NAME : null}  ->  ${nameMODEL}`}
                    </div> */}
                    {/* 第二层的筛选条件 */}
                    <div style={{display:!_.isEmpty(this.state.MODEL) ? 'block' : 'none'}} className={styles.screenBottom}>
                        {/* 商品属性 */}
                        <div onClick={() => this.onChoiceButton('汽车排量年份')} className={this.state.ChoiceButton == '汽车排量年份'  ? styles.screenBottomItemSelect : styles.screenBottomItem} key={'汽车排量年份'}>
                            <span style={{ color: this.state.ChoiceButton == '汽车排量年份' ? '#3c8ee2' : null }}>
                                汽车排量年份
                                <img src={this.state.ChoiceButton == '汽车排量年份' ? upward : down} alt="error" />
                            </span>
                        </div>
                        <div onClick={() => this.onChoiceButton('安装位置')} className={this.state.ChoiceButton == '安装位置'  ? styles.screenBottomItemSelect : styles.screenBottomItem} key={'安装位置'}>
                            <span style={{ color: this.state.ChoiceButton == '安装位置' ? '#3c8ee2' : null }}>
                                安装位置
                                <img src={this.state.ChoiceButton == '安装位置' ? upward : down} alt="error" />
                            </span>
                        </div>
                    </div>
                    {/* 第二层弹框的浮框 */}
                    <div className={styles.floatFrame}>
                        {
                            this.floatFrame()
                        }
                    </div>
                    <div style={{width:'100%',height:'100%'}}>
                        {
                            <GoodsModul {...goodsModulProps} onRef={this.onRef} 
                                getStart={(e,element)=>this.props.getStart(e,element)}/>
                        }
                    </div>
                </div>
                }
            </div>
        )
    }
}
