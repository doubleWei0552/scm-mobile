import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import _ from 'lodash';
import ReactDom from 'react-dom';
import { NavBar, Icon, List, Button, WhiteSpace, WingBlank, Result, ActivityIndicator } from 'antd-mobile';
import Style from './style.less';

const Item = List.Item;

@connect(({ order, loading }) => ({
  order,
  loading: loading.effects['order/getOrderDetail'],
}))
class OrderDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    this.getOrderDetail()
    this.props.dispatch({
      type: 'shoppingCart/save', payload: {
        SelectedData: [],
        goodsLists: [],
        TotalAmount: 0,
        TotalNumber: 0,
        allSelect: false,
      }
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  // 获取订单详情
  getOrderDetail = () => {
    const { dispatch, match } = this.props;
    const orderId = _.get(match, 'params.orderId')
    dispatch({
      type: 'order/getOrderDetail',
      payload: orderId,
    })
  }


  goBack = () => {
    window.history.back()
  }

  render() {
    const { match, order: { order, orderDList }, loading } = this.props;
    const orderId = _.get(match, 'params.orderId')
    const { CODE = '' } = order
    let totalNum = 0;
    let totalPrice = 0;
    _.map(orderDList, o => {
      totalNum += o.NUM;
      totalPrice += o.AMOUNT;
    })
    // const orderId =
    return (
      <div className={Style.orderdetail}>
        <ActivityIndicator
          toast
          text="Loading..."
          animating={loading}
        />
        <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 10 }}>
          <NavBar
            mode="dark"
            // leftContent="Back"
            onLeftClick={this.goBack}
            icon={<Icon type="left" size='lg' />}
            rightContent={[]}
          >
            订单详情
          </NavBar>
        </div>

        {/* <div style={{position: 'relative', top: 45}}>
          <WhiteSpace />
          <Result
            img={<Icon type="check-circle" className="spe" style={{ fill: '#1F90E6' }} />}
            title="验证成功"
            message="所提交内容已成功完成验证"
          />
          <WhiteSpace />
        </div> */}

        <List renderHeader={() => <div>订单号： {CODE}</div>} className="my-list">
          {_.map(orderDList, o => (
            <Item key={o.ID} extra={<div style={{ fontSize: 18 }}>金额：<div style={{ display: 'inline-block', minWidth: 36, textAlign: 'left' }}>{o.AMOUNT}</div></div>}>
              <div style={{ display: 'flex' }}>
                <div>
                  <img style={{ height: '64px', width: '64px', marginRight: '15px' }} src='https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png' alt="" />
                </div>
                <div>
                  <div style={{ lineHeight: '40px', fontSize: 20 }}>{o.GOODS_NAME}</div>
                  <div style={{ lineHeight: '24px', color: '#736f6f' }}><span>数量： {o.NUM}</span></div>
                </div>
              </div>
            </Item>))}


          <Item style={{ background: '#c5dff9', overflow: 'unset' }} extra={<div style={{ fontSize: 18 }}>总价：<span style={{ color: 'red', fontSize: 24, }}>{totalPrice}</span></div>}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                共{totalNum} 件
              </div>

            </div>
          </Item>



        </List>
        {/* <div style={{ position: 'fixed', bottom: 0, background: '#ffffff', width: '100%', zIndex: 10 }}>
          <WhiteSpace />
          <WingBlank size="md"><Button type="primary">立即支付</Button></WingBlank>

          <WhiteSpace />
        </div> */}
      </div>
    );
  }
}

export default OrderDetailPage;
