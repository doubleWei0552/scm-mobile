import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router'
import _ from 'lodash';
import ReactDom from 'react-dom';
import { Avatar, Button, Upload, Form } from 'antd';
import noHead from '@/assets/noHead.svg'
import { NavBar, Icon, TabBar, List, WhiteSpace, WingBlank, Result, ActivityIndicator, Picker } from 'antd-mobile';
import styles from './style.less';

const Item = List.Item;
@Form.create()
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
export default class UserCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      visible: false,
      value: [localStorage.getItem('customerId') * 1] || [],
    };
  }

  componentDidMount() {
    const userId = localStorage.getItem('userId');
    this.queryCurrent(userId);
    // window.addEventListener("popstate", function (e) {
    //   window.location = 'http://www.baidu.com';
    // }, false);
  }



  queryCurrent = (userId) => {
    const { dispatch, user } = this.props;
    const { wechatinfo } = user;

    dispatch({
      type: 'user/queryCurrent',
      payload: { userId },
      callback: response => {
        if (response.status === 'success') {
          this.setState({
            userInfo: response.data,
            visible: false,
          })
        }
      }
    })

  }

  selectCustomer = (customerId) => {
    localStorage.setItem('customerId', customerId)
    this.setState({
      visible: false,
      value: [customerId]
    })
  }

  render() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const { userInfo, visible, value } = this.state;
    const { customerUserList } = userInfo;
    const { getFieldProps } = this.props.form;
    const newData = [];
    _.map(customerUserList, item => {
      item.label = item.NAME,
        item.value = item.ID
    })
    const phone = _.toString(_.get(userInfo, 'MOBILE')) || ''
    // _.toString(value)
    const str = phone !== '' ? phone.substring(4, 9) : ''
    console.log('userInfo', localStorage.getItem('customerId') * 1, customerUserList)
    const mobile = _.replace(phone, str, '*****')
    return (
      <div className={styles.usercenterpage}>
        <div style={{ margin: '20px, 20px, 20px, 20px', paddingTop: 20, }}>
          <Avatar size={120} src={noHead} style={{ backgroundColor: this.state.color, verticalAlign: 'middle' }}>
            {this.state.user}
          </Avatar>
        </div>
        <div style={{ marginTop: 20 }}>
          <List>
            <Item extra={_.get(userInfo, 'USERNAME')} onClick={() => { }}>用户名</Item>
            <Item extra={mobile} onClick={() => { }}>手机</Item>
            <Item extra={_.get(userInfo, 'EMAIL')} onClick={() => { }}>邮箱</Item>
            <Item extra={_.get(userInfo, 'subRole')} onClick={() => { }}>员工角色</Item>
            {customerUserList && (
              <Picker
                data={customerUserList}
                cols={1}
                visible={visible}
                value={value}
                onDismiss={() => this.setState({ visible: false })}
                // {...getFieldProps('district3')}
                className="forss"
                onOk={v => this.selectCustomer(v[0])}
              >
                <List.Item arrow="horizontal" onClick={() => this.setState({ visible: true })}>当前客户</List.Item>
              </Picker>
            )}
          </List>
          <Button type="primary" onClick={() => {
            router.push('/welcome')
            this.props.dispatch({ type: 'shoppingCart/save', payload: { goodsLists: [], TotalAmount: 0, TotalNumber: 0 } })
          }} className={styles.signOut}>退出</Button>
        </div>
      </div>
    )
  }
}