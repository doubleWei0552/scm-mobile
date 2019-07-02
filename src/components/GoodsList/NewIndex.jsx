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
import styles from './NewIndex.less'
import { element } from 'prop-types';

const CheckboxItem = Checkbox.CheckboxItem;
const { TreeNode } = Tree;
const { Panel } = Collapse

@connect(({ goodsData }) => ({
    goodsData,
}))

export default class NewGoodsList extends React.Component {
    state = {
        PriceRanking: null, //价格筛选的图标展示
        subscript: 0, //筛选底部的下标线展示
        isMask: false, //是否展示遮罩层
        ChoiceButton: null, //选择的筛选按钮，用于判断哪个要触发下拉框
        choiceBox:[], //选择框选择到的数据
    }
    componentDidMount=()=>{
        this.getTypeList();
    }

    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
      };
    
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
        console.log('SearchBar', value)
    };

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

    onComprehensive = () => { //综合筛选的方法
        this.setState({
            subscript: 0
        })
    }

    onSales = () => {  // 销量的筛选
        this.setState({
            subscript: 1
        })
    }

    onPrice = () => {  //价格的筛选
        this.setState({
            subscript: 2,
            PriceRanking: this.state.PriceRanking == 'scend' ? 'descend' : 'scend',
        })
    }

    onScreening = () => {  //点击筛选弹框
        this.setState({
            subscript: 3
        })
    }

    onCheckboxChange = (value) => { // 复选框的选择事件
        let choiceBox = this.state.choiceBox
        let index = _.findIndex(choiceBox,item => item.ID == value.ID)
        if(index > 0){
            choiceBox.splice(index,1)
        } else {
            choiceBox.push(value)
        }
        this.setState({
            choiceBox
        })
    }

    submit=()=>{
        let choiceBox = this.state.choiceBox
        console.log(JSON.stringify(choiceBox))
        this.props.dispatch({
            type:'goodsData/',
            payload:{choiceBox}
        })
    }

    onClassification =(value)=>{  //分类选择
        console.log(value)
        this.setState({
            ChoiceButton:null,
            isMask:false
        })
        this.props.dispatch({type:'goodsData/onGoodsClassify',payload:{categoryId:value.ID}})
    }

    onChoiceButton = (value, item) => {
        if (item.CHILD.length > 0) {
            this.setState({
                isMask: this.state.ChoiceButton == value ? false : true,
                ChoiceButton: this.state.ChoiceButton == value ? null : value
            })
        } else {
            this.setState({
                isMask: false,
                ChoiceButton: this.state.ChoiceButton == value ? null : value
            })
        }
    }

    render() {
        if(_.get(this.props.goodsData, 'menuData').length == 0) return null
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
                    {/* 第一层的筛选条件,勿删！！！ */}
                    {/* <div className={styles.screenTop}>
                        <div onClick={this.onComprehensive} className={styles.screenTopItem}>
                            <span style={{ borderBottom: this.state.subscript == 0 ? '2px solid #3c8ee2' : null, paddingBottom: '3px' }}>综合</span>
                        </div>

                        <div onClick={this.onSales} className={styles.screenTopItem}>
                            <span style={{ borderBottom: this.state.subscript == 1 ? '2px solid #3c8ee2' : null, paddingBottom: '3px' }} > 销量</span>
                        </div>

                        <div onClick={this.onPrice} className={styles.screenTopItem}>
                            <span style={{ borderBottom: this.state.subscript == 2 ? '2px solid #3c8ee2' : null, paddingBottom: '3px' }}> 价格</span>
                            <img src={this.state.PriceRanking ?
                                this.state.PriceRanking == 'scend' ? descend : scend
                                : disort} alt="error" />
                        </div>

                        <div onClick={this.onScreening} className={styles.screenTopItem}>
                            <span style={{ borderBottom: this.state.subscript == 3 ? '2px solid #3c8ee2' : null, paddingBottom: '3px' }}> 筛选</span>
                            <img src={screens} alt="error" />
                        </div>
                    </div> */}
                    {/* 第二层的筛选条件 */}
                    <div className={styles.screenBottom}>
                        {
                            _.get(this.props.goodsData, 'menuData').map((item, index) => {
                                return (
                                    <div onClick={() => this.onChoiceButton(item.NAME, item)} className={this.state.ChoiceButton == item.NAME && item.CHILD.length > 0 ? styles.screenBottomItemSelect : styles.screenBottomItem} key={item.NAME + index}>
                                        <span style={{ color: this.state.ChoiceButton == item.NAME ? '#3c8ee2' : null }}>
                                            {item.NAME}
                                            {item.CHILD.length > 0 ? <img src={this.state.ChoiceButton == item.NAME ? upward : down} alt="error" /> : null}
                                        </span>
                                    </div>
                                )
                            })
                        }
                        {
                            _.get(this.props.goodsData, 'handMenu').map((item, index) => {
                                return (
                                    <div onClick={() => this.onChoiceButton(item.NAME, item)} className={this.state.ChoiceButton == item.NAME && item.CHILD.length > 0 ? styles.screenBottomItemSelect : styles.screenBottomItem} key={item.NAME + index}>
                                        <span style={{ color: this.state.ChoiceButton == item.NAME ? '#3c8ee2' : null }}>
                                            {item.NAME}
                                            {item.CHILD.length > 0 ? <img src={this.state.ChoiceButton == item.NAME ? upward : down} alt="error" /> : null}
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* 第二层弹框的浮框 */}
                    <div className={styles.floatFrame}>
                    {
                            _.get(this.props.goodsData, 'menuData').map((item, index) => {
                                return item.NAME == this.state.ChoiceButton ? <div key={index} style={{ background: '#efeff4', borderBottomLeftRadius: '10px', WebkitBorderBottomRightRadius: '10px' }}>
                                    <div style={{ overflow: 'hidden' }}> {/*  清除浮动带来的影响，划重点，要考的！！！ */}
                                        {item.CHILD.map((ii, jj) => {
                                            if(ii.CHILD.length > 0){
                                                return <Collapse accordion key={jj + ii.NAME}>
                                                    <Panel header={ii.NAME} key={ii.NAME + jj}>
                                                        {ii.CHILD.map((bb,cc)=>{
                                                            return <p style={{textAlign:'left',borderBottom:'1px solid lightgray'}} onClick={()=>this.onClassification(bb)} key={bb.NAME + ii.NAME + jj}>
                                                            {bb.NAME}</p>
                                                        })}
                                                    </Panel>
                                                </Collapse>
                                            } else {
                                                return (
                                                    <div key={jj}>
                                                        <CheckboxItem onChange={() => this.onCheckboxChange(ii)} style={{ minHeight: '30px', background: '#efeff4' }} className={styles.CheckboxItem} key={ii.NAME + jj}>
                                                            {ii.NAME}
                                                        </CheckboxItem>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div> : null
                            })
                        }
                        {
                            _.get(this.props.goodsData, 'handMenu').map((item, index) => {
                                return item.NAME == this.state.ChoiceButton ? <div key={index} style={{ background: '#efeff4', borderBottomLeftRadius: '10px', WebkitBorderBottomRightRadius: '10px' }}>
                                    <div style={{ overflow: 'hidden' }}> {/*  清除浮动带来的影响，划重点，要考的！！！ */}
                                        {item.CHILD.map((ii, jj) => {
                                                return (
                                                    <div key={jj}>
                                                        <CheckboxItem onChange={() => this.onCheckboxChange(ii)} style={{ minHeight: '30px', background: '#efeff4' }} className={styles.CheckboxItem} key={ii.NAME + jj}>
                                                            {ii.NAME}
                                                        </CheckboxItem>
                                                    </div>
                                                )
                                        })}
                                    </div>
                                    <div style={{ display: item.CHILD.length > 0 ? 'block' : 'none' }} className={styles.ChoiceButton}>
                                        <span style={{ borderBottomLeftRadius: '10px' }} className={styles.ChoiceButtonItem}>重置</span>
                                        <span style={{ background: '#3c8ee2', borderBottomRightRadius: '10px' }} onClick={this.submit} className={styles.ChoiceButtonItem}>确定</span>
                                    </div>
                                </div> : null
                            })
                        }
                    </div>
                </div>
                <div className={styles.hr} />
                {/* 商品列表部分 */}
                <div style={{ zIndex: 10 }}>
                    <GoodsModul getStart={(e,element)=>this.props.getStart(e,element)}/>
                </div>
            </div>
        )
    }
}
