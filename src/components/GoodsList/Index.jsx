import React from 'react'
import { SearchBar, Button, WhiteSpace, WingBlank, Accordion, List, Checkbox, Flex } from 'antd-mobile'
import { Tree,Collapse } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'

import GoodsModul from './GoodsModul'
import screen from './image/screen.svg' //右上角变化表格图标
import screens from './image/screens.svg' //筛选排序图标
import Scan from './image/Scan.svg' //扫一扫图标
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
    }
    componentDidMount=()=>{
        this.getTypeList();
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

    onSearchBarChange = (value) => {
        this.child.getGoodsList(false,this.state.category,null,value,'father',[])
    };

    onScan = () => {
        console.log('点击扫一扫按钮')
        this.props.onGoSelectPage()
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
        if(this.state.ChoiceButton == '汽车排量年份'){
            return _.get(this.props.goodsData, 'carModel').map((item, index) => {
                return <div key={index} style={{ background: '#efeff4' }}>
                    <div style={{ overflow: 'hidden' }}> 
                        <p onClick={()=>this.onClassification(item)} style={{height:'35px',padding:0,margin:0,lineHeight:'35px',borderBottom:'1px solid lightgray'}}>{item.CAR_MODEL}</p>
                    </div>
                </div>
            })
        } else if(this.state.ChoiceButton == '安装位置'){
            return _.get(this.props.goodsData, 'installPosition').map((item, index) => {
                return <div key={index} style={{ background: '#efeff4' }}>
                    <div style={{ overflow: 'hidden' }}> 
                        <p onClick={()=>this.onPosition(item)} style={{height:'35px',padding:0,margin:0,lineHeight:'35px',borderBottom:'1px solid lightgray'}}>{item.INSTALLATION_POSITION}</p>
                    </div>
                </div>
            })
        }
    }

    render() {
        const goodsModulProps = {
            CAR_MODEL:this.state.CAR_MODEL,
            INSTALLATION_POSITION:this.state.INSTALLATION_POSITION,
            MODEL:this.props.MODEL,
            ID:this.props.ID
        }
        return (
            <div className={styles.GoodsList}>
                {/* 遮罩层 */}
                <div onClick={this.onDismask} style={{ display: this.state.isMask ? 'block' : 'none', zIndex: 11 }} className={styles.Mask} />
                {/* 搜索输入框 */}
                <div style={{ zIndex: 1000, position: 'relative' }} className={styles.searchBarBox}>
                    <div className={styles.Scan} onClick={this.onScan}>
                        <img src={Scan} alt="error" />
                    </div>
                    <div className={styles.searchBar}>
                        <SearchBar placeholder="请输入查询条件" onChange={this.onSearchBarChange} />
                    </div>
                    <div className={styles.screen} onClick={this.onScreen}>
                        <img src={screen} alt="error" />
                    </div>
                </div>
                <div style={{ zIndex: 1000, position: 'relative' }} className={styles.screenBox}>
                    {/* 第二层的筛选条件 */}
                    <div className={styles.screenBottom}>
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
                </div>
                <div className={styles.hr} />
                {/* 商品列表部分 */}
                <div style={{ zIndex: 10 }}>
                    <GoodsModul {...goodsModulProps} onRef={this.onRef} 
                    getStart={(e,element)=>this.props.getStart(e,element)}/>
                </div>
            </div>
        )
    }
}
