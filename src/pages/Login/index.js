import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ReactDom from 'react-dom';
import _ from 'lodash';
import { ListView, NavBar, Drawer, List, WingBlank, ActivityIndicator } from 'antd-mobile';
import {
  Form, Input, Icon, Button, Checkbox, Avatar,
} from 'antd';
import { local } from 'd3-selection';
import Style from './style.less';
import Logo from './image/logoO.png';
import { apiConfig } from '@/defaultSettings';
import router from 'umi/router';

@Form.create()
@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/login'],
}))
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const code = _.get(this.props.location.query, 'code');
    const state = _.get(this.props.location.query, 'state');

    dispatch({
      type: 'user/queryLogoParameter',
    })
    // if (code) {
    //   dispatch({
    //     type: 'user/getUserInfo',
    //     payload: { code, state },
    //     callback: response => {
    //       if (response.status === 'success') {
    //         if (response.data.bind) {
    //           router.push('/layout')
    //         } else {
    //           router.push('/wechatbind')
    //         }
    //       }
    //     }
    //   })

    // } else {
    //   window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2c109902ccf13bee&redirect_uri=http://www.doublewei.online/welcome&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
    // }

  }

  componentDidMount() {
    const code = _.get(this.props.location.query, 'code');
    const appId = 'wx2c109902ccf13bee';
    if (!code) {
      // window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2c109902ccf13bee&redirect_uri=http://www.doublewei.online/welcome&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
    } else {
      // alert(code)
    }

  }

  // componentWillReceiveProps(newProps){
  //   console.log('newProps', newProps)
  //   const code = newProps.location.querry || ''; 
  //   alert(code)
  // }

  handleSubmit = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { remember, password, userName } = values;
        if (remember) {
          localStorage.setItem('mPassword', password)
          localStorage.setItem('mUserName', userName)
        } else {
          localStorage.setItem('mPassword', '')
          localStorage.setItem('mUserName', '')
        }
        dispatch({
          type: 'user/login',
          payload: values,
        })
      }
    });
  }


  render() {
    const { loading = false } = this.props;
    const { getFieldDecorator } = this.props.form;
    const loginLogo = localStorage.getItem('wechatLoginLogoImg') && localStorage.getItem('wechatLoginLogoImg') !== 'undefined' ? JSON.parse(localStorage.getItem('wechatLoginLogoImg')) : [];
    if(loginLogo[0]){
      if(!loginLogo[0].url.includes('http:')){
          const { apiUrl: _apiUrl } = apiConfig;
          let port = window.location.origin.split(':')
          const origin = port[0]+':'+port[1] || '';
          const apiUrl = process.env.NODE_ENV === 'development' ? _apiUrl : origin;
          let newUrl = apiUrl.split(':')
          loginLogo[0].url = `${newUrl[0]}:${newUrl[1]}${loginLogo[0].url}`
      }
    }
    return (
      <div className={Style.welcomePage}>
        <ActivityIndicator
          toast
          text="登录中..."
          animating={loading}
        />
        <WingBlank className="logo">
          {/* <Avatar shape="square" src={Logo} size={64} icon="user" /> */}
          <Avatar shape="square" src={loginLogo.length > 0 ? loginLogo[0].url : ''} size={64} icon="user" />
          {/* <div className='title'>精诚供应链系统</div> */}
          <div className='title'>{localStorage.getItem('wechatLoginTitle') && localStorage.getItem('wechatLoginTitle') !== 'undefined' ? localStorage.getItem('wechatLoginTitle') : ''}</div>
        </WingBlank>
        <WingBlank>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('userName', {
                initialValue: localStorage.getItem('mUserName'),
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="请输入用户名" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                initialValue: localStorage.getItem('mPassword'),
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入密码" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住密码</Checkbox>
              )}
              {/* <a className="login-form-forgot" href="">忘记密码</a> */}
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
              {/* Or <Link to='/user/register'>register now!</Link> */}
            </Form.Item>
          </Form>
        </WingBlank>
      </div>
    );
  }
}

export default LoginPage;
