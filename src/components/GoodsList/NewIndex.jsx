import React from 'react'
import { SearchBar, Button, WhiteSpace, WingBlank, Accordion, List, Checkbox, Flex } from 'antd-mobile'
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

@connect(({ goodsList }) => ({
    goodsList,
}))

export default class NewGoodsList extends React.Component {
    state = {
        PriceRanking: null, //价格筛选的图标展示
        subscript: 0, //筛选底部的下标线展示
        isMask: false, //是否展示遮罩层
        ChoiceButton: null, //选择的筛选按钮，用于判断哪个要触发下拉框
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
        console.log('Checkbox', value)
    }

    onChoiceButton = (value, item) => {
        if (item.children.length > 0) {
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
                            _.get(this.props.goodsList, 'searchData').map((item, index) => {
                                return (
                                    <div onClick={() => this.onChoiceButton(item.label, item)} className={this.state.ChoiceButton == item.label && item.children.length > 0 ? styles.screenBottomItemSelect : styles.screenBottomItem} key={item.label + index}>
                                        <span style={{ color: this.state.ChoiceButton == item.label ? '#3c8ee2' : null }}>
                                            {item.label}
                                            {item.children.length > 0 ? <img src={this.state.ChoiceButton == item.label ? upward : down} alt="error" /> : null}
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {/* 第二层弹框的浮框 */}
                    <div className={styles.floatFrame}>
                        {
                            _.get(this.props.goodsList, 'searchData').map((item, index) => {
                                return item.label == this.state.ChoiceButton ? <div key={index} style={{ background: '#efeff4', borderBottomLeftRadius: '10px', WebkitBorderBottomRightRadius: '10px' }}>
                                    <div style={{ overflow: 'hidden' }}> {/*  清除浮动带来的影响，划重点，要考的！！！ */}
                                        {item.children.map((ii, jj) => {
                                            return (
                                                <div key={jj}>
                                                    <CheckboxItem onChange={() => this.onCheckboxChange(ii)} style={{ minHeight: '30px', background: '#efeff4' }} className={styles.CheckboxItem} key={ii.label + jj}>
                                                        {ii.label}
                                                    </CheckboxItem>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div style={{ display: item.children.length > 0 ? 'block' : 'none' }} className={styles.ChoiceButton}>
                                        <span style={{ borderBottomLeftRadius: '10px' }} className={styles.ChoiceButtonItem}>重置</span>
                                        <span style={{ background: '#3c8ee2', borderBottomRightRadius: '10px' }} className={styles.ChoiceButtonItem}>确定</span>
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
