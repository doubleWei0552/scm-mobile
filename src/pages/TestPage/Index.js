import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import _ from 'lodash';
import ReactDom from 'react-dom';
import { NavBar, Icon, TabBar, List, Button, WhiteSpace, WingBlank, Result, ActivityIndicator, Badge } from 'antd-mobile';
import GoodsList from '@/components/GoodsList/FinalIndex'
import SelectionPage from '@/components/GoodsList/SelectionPage'
import OrderList from '@/components/OrderList/Index'
import HomePage from '@/components/HomePage'
// import ShoppingCart from '@/components/ShoppingCart/Index' //带选择功能的购物车
import ShoppingCart from '@/components/ShoppingCart/newIndex'
import shoppingCartClick from '@/components/ShoppingCart/image/shoppingCartClick.png'
import shoppingCart from '@/components/ShoppingCart/image/shoppingCart.png'
import UserCenter from '../UserCenter';
import router from 'umi/router';

import homeS from './images/shouye.svg'
import home from './images/shouyeunselect.svg'
import fenleiS from './images/fenlei.svg'
import fenlei from './images/fenleiunselect.svg'
import yewuS from './images/yewu.svg'
import yewu from './images/yewuunselect.svg'
import gouwucheS from './images/gouwuche.svg'
import gouwuche from './images/gouwucheunselect.svg'
import wodeS from './images/wode.svg'
import wode from './images/wodeunselect.svg'
import { funParabola } from '@/utils/funParabola' //购物车跳转动画

const Item = List.Item;

const tabCfg = {
  'index': '首页',
  'goodList': '商品列表',
  'orderList': '订单列表',
  'shoppingCart': '购物车',
  'me': '我的',
}

@connect(({ order, loading, goods, shoppingCart }) => ({
  order,
  goods,
  shoppingCart,
  loading: loading.effects['order/getOrderDetail'],
}))

class TabPanePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NavBarTitle: '', //导航栏顶部的标题
      selectedTab: 'index',
    };
  }

  componentWillMount() {
    const name = _.get(this.props.match, 'params.name')
    this.setState({
      selectedTab: name,
      NavBarTitle: tabCfg[name]
    })
  }

  componentWillReceiveProps(newProps) {
    const oldName = _.get(this.props.match, 'params.name')
    const name = _.get(newProps.match, 'params.name')
    if (oldName === name) {
      return
    }
    this.setState({
      selectedTab: name,
      NavBarTitle: tabCfg[name]
    })
  }

  getStart = (rowID, element) => { //购物车动效
    var element = document.getElementById(`${rowID}`);
    var target = document.getElementById('target') //会有bug，第一次拿不到，直接用ref写
    // 抛物线元素的的位置标记
    var parabola = funParabola(element, this.target).mark();
    parabola.init();
  };

  renderDom = (selectedTab) => {
    switch (selectedTab) {
      case 'index':
        return (
          <div key={0} style={{ flex: 1, textAlign: 'center' }}>
            <HomePage key={0} {...this.props} />
          </div>
        )
        break
      case 'goodList':
        return (
          <div key={1} style={{ flex: 1, textAlign: 'center', height: '100%' }}>
            <GoodsList {...this.props} getStart={(rowID, element) => this.getStart(rowID, element)} ref={dom => {
              this.goodsListRef = dom; 
            }} />
          </div>
        )
        break
      case 'orderList':
        return (
          <div key={2} style={{ flex: 1, textAlign: 'center' }}>
            <OrderList key={2} />
          </div>
        )
        break
      case 'shoppingCart':
        return (
          <div key={3} style={{ flex: 1, textAlign: 'center' }}>
            <ShoppingCart key={3} {...this.props} />
          </div>
        )
        break
      case 'me':
        return (
          <div key={4} style={{ height: '100%', textAlign: 'center' }}>
            <UserCenter key={4} {...this.props} />
          </div>
        )
        break
    }
  }

  rightContent = (selectedTab) => {
    switch (selectedTab) {
      case 'index':
      case 'goodList':
      case 'shoppingCart':
      case 'me':
        return (
          [<Icon key="1" type="ellipsis" />]
        )
        break
      case 'orderList':
        return (
          [<Icon key="0" type="search" />]
        )
        break
      default:
        break
    }
  }


  render() {
    const { selectedTab } = this.state
    let { goodsLists } = this.props.shoppingCart
    return (
      <div style={{ height: '100%' }}>
        <div>
          <NavBar
            mode="dark"
          >{
              this.state.NavBarTitle}
          </NavBar>
        </div>
        <div style={{ height: 'calc(100% - 45px)', position: 'relative', }}>
          <div style={{ height: 'calc(100% - 50px)', width: '100%',overflow:'scroll' }}>
            {
              this.renderDom(selectedTab)
            }
          </div>
          <div style={{ height: '50px', width: '100%', zIndex: '1000', position: 'fixed', bottom: '0', background: 'white', borderTop: '1px solid lightgray' }}>
            {/* 首页 */}
            <div
              style={{
                width: '20%',
                height: '45px',
                lineHeight: '70px',
                textAlign: 'center',
                background: selectedTab != 'index' ? `url(${home}) center 8px /  21px 21px no-repeat` :
                  `url(${homeS}) center 8px /  21px 21px no-repeat`,
                float: 'left',
              }}
              onClick={
                () => {
                  router.push('/homepage/index')
                  this.setState({
                    selectedTab: 'index',
                    NavBarTitle: '首页',
                  });
                }
              }
            >
              <span style={{ fontSize: '0.7rem', color: selectedTab != 'index' ? '#353535' : '#0090ff' }}>首页</span>
            </div>
            {/* 分类 */}
            <div style={{
              width: '20%',
              height: '45px',
              lineHeight: '70px',
              textAlign: 'center',
              background: selectedTab != 'goodList' ? `url(${fenlei}) center 8px /  21px 21px no-repeat` :
                `url(${fenleiS}) center 8px /  21px 21px no-repeat`,
              float: 'left',
            }}
              onClick={
                () => {
                  router.push('/homepage/goodList')
                  this.setState({
                    selectedTab: 'goodList',
                    NavBarTitle: '分类页',
                  });
                }
              }
            >
              <span style={{ fontSize: '0.7rem', color: selectedTab != 'goodList' ? '#353535' : '#0090ff' }}>分类页</span>
            </div>
            {/* 购物车 */}
            <div style={{
              width: '20%',
              height: '45px',
              lineHeight: '70px',
              textAlign: 'center',
              background: selectedTab != 'shoppingCart' ? `url(${gouwuche}) center 8px /  21px 21px no-repeat` :
                `url(${gouwucheS}) center 8px /  21px 21px no-repeat`,
              float: 'left',
            }}
              onClick={
                () => {
                  router.push('/homepage/shoppingCart')
                  this.setState({
                    selectedTab: 'shoppingCart',
                    NavBarTitle: '购物车',
                  });
                }
              }
            >
              <div ref={dom => this.target = dom} style={{}}>
                <Badge id='target' text={goodsLists.length} style={{ top: '-35px', right: '-43px', position: 'absolute' }} />
                <span style={{ fontSize: '0.7rem', color: selectedTab != 'shoppingCart' ? '#353535' : '#0090ff' }}>购物车</span>
              </div>
            </div>
            {/* 订单 */}
            <div style={{
              width: '20%',
              height: '45px',
              lineHeight: '70px',
              textAlign: 'center',
              background: selectedTab != 'orderList' ? `url(${yewu}) center 8px /  21px 21px no-repeat` :
                `url(${yewuS}) center 8px /  21px 21px no-repeat`,
              float: 'left',
            }}
              onClick={
                () => {
                  router.push('/homepage/orderList')
                  this.setState({
                    selectedTab: 'orderList',
                    NavBarTitle: '订单页',
                  });
                }
              }
            >
              <span style={{ fontSize: '0.7rem', color: selectedTab != 'orderList' ? '#353535' : '#0090ff' }}>订单页</span>
            </div>
            {/* 我的 */}
            <div style={{
              width: '20%',
              height: '45px',
              lineHeight: '70px',
              textAlign: 'center',
              background: selectedTab != 'me' ? `url(${wode}) center 8px /  21px 21px no-repeat` :
                `url(${wodeS}) center 8px /  21px 21px no-repeat`,
              float: 'left',
            }}
              onClick={
                () => {
                  router.push('/homepage/me')
                  this.setState({
                    selectedTab: 'me',
                    NavBarTitle: '我的',
                  });
                }
              }
            >
              <span style={{ fontSize: '0.7rem', color: selectedTab != 'me' ? '#353535' : '#0090ff' }}>我的</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TabPanePage;

