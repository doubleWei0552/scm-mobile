import React, { Component } from "react";
import { connect } from "dva";
import {
  NavBar,
  Icon,
  List,
  InputItem,
  Toast,
  Button,
  WhiteSpace
} from 'antd-mobile';

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
export default class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      rePassword: '',
      newPassword: '',
    }
  }

  goBack = () => {
    window.history.back()
  }

  changPassword = () => {
    const { dispatch } = this.props;
    const userId = localStorage.getItem('userId');
    const { password, rePassword, newPassword } = this.state;
    if (rePassword !== newPassword) {
      this.setState({
        newPasswordErr: true
      })
      Toast.fail('两次密码不一致！', 1)
      return
    } else if (!password) {
      this.setState({
        passwordErr: true
      })
      Toast.fail('密码不能为空！', 1)
      return
    }

    dispatch({
      type: 'user/changPassword',
      payload: { password, rePassword, userId },
      callback: (response) => {
        console.log('response', response)
        if (response.status === 'success') {
          this.setState({
            newPasswordErr: false,
            passwordErr: false
          })
          Toast.success('修改成功', 1)
        }

      }
    })
  }

  handleChange = (value, key) => {
    this.state[key] = value
    this.setState({

    })
  }

  render() {
    console.log(this.state)
    const { newPasswordErr, passwordErr } = this.state;
    return (
      <div>
        <div>
          <NavBar
            mode="dark"
            icon={<Icon type="left" size='lg' />}
            onLeftClick={this.goBack}
            rightContent={[
              // <Icon type="plus" size='lg' />
            ]}
          >
            修改登录密码
          </NavBar>
        </div>
        <div style={{ marginTop: 20 }}>
          <List>
            <InputItem
              type="password"
              placeholder="请输入原密码"
              error={passwordErr}
              onErrorClick={this.onErrorClick}
              onChange={(v) => this.handleChange(v, 'password')}

            >
              原密码
            </InputItem>
            <InputItem
              type="password"
              placeholder="请输入新密码"
              onErrorClick={this.onErrorClick}
              onChange={(v) => this.handleChange(v, 'rePassword')}

            >
              新密码
            </InputItem>
            <InputItem
              type="password"
              placeholder="请确认新密码"
              error={newPasswordErr}
              onErrorClick={this.onErrorClick}
              onChange={(v) => this.handleChange(v, 'newPassword')}

            >
              确认密码
            </InputItem>
          </List>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
          <Button onClick={this.changPassword} style={{ width: '80%', color: '#fff' }} type="primary">修改</Button>
        </div>
      </div>
    )
  }
}