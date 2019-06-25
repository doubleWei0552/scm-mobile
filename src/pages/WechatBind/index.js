import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import _ from 'lodash';
import ReactDom from 'react-dom';
import { Avatar } from 'antd';
import { List, InputItem, WhiteSpace, Button, WingBlank, Toast, NavBar, Icon } from 'antd-mobile';
import { createForm } from 'rc-form';


const Item = List.Item;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
class BasicInputExample extends React.Component {
  state = {
    phone: '',
  }

  componentDidMount() {
    // this.autoFocusInst.focus();
  }

  handleClick = () => {
    this.inputRef.focus();
  }

  handleChange = (value) => {

    console.log('value', value)
    this.setState({
      phone: value
    })
  }

  bindWeChat = () => {
    const { dispatch, user } = this.props;
    const { wechatinfo: { openid = '' } } = user;
    const appId = 'wx2c109902ccf13bee';
    const { phone } = this.state;
    const username = phone.replace(/\s*/g, "");
    // if (!username) {
    //   Toast.fail('手机号不能为空', 1)
    //   return
    // }
    dispatch({
      type: 'user/bindWeChat',
      payload: { username, openid }
    })
  }

  render() {
    console.log('12000', this.props);
    const { getFieldProps } = this.props.form;
    const { phone } = this.state;
    return (
      <div>
        <List>
          <InputItem
            {...getFieldProps('phone')}
            type="phone"
            placeholder="请输入手机号"
            onChange={this.handleChange}
            value={phone}
          >手机号:
          </InputItem>
        </List>
        <WhiteSpace style={{ height: 30 }} />
        <WingBlank><Button disabled={phone ? false : true} onClick={this.bindWeChat} type="primary">立即绑定</Button></WingBlank>
        <WhiteSpace />

      </div>
    );
  }
}

const BasicInputExampleWrapper = createForm()(BasicInputExample);

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.wechat,
}))
export default class UserCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  goback = () => {
    window.history.back()
  }

  render() {
    console.log('local', this.props)
    const userData = JSON.parse(localStorage.getItem('userData'));
    return (
      <div>
        <div>
          <NavBar
            mode="dark"
          // icon={<Icon size='lg' type="left" />}
          // onLeftClick={this.goback}
          >
            绑定手机号
          </NavBar>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: 40 }}>
          <Avatar size={160} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style={{ backgroundColor: this.state.color, verticalAlign: 'middle' }}>
            {this.state.user}
          </Avatar>
        </div>
        <div style={{ marginTop: 20 }}>
          <BasicInputExampleWrapper />
        </div>

      </div>
    )
  }
}