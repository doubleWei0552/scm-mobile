import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router'
import _ from 'lodash';
import ReactDom from 'react-dom';
import {
  NavBar,
  Icon,
  List
} from 'antd-mobile';
import { Avatar } from 'antd';
import { apiConfig } from '@/defaultSettings';


const Item = List.Item;
const Brief = Item.Brief;

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 返回
  goBack = () => {
    window.history.back()
  }

  handleHelp = () => {
    const helpLink = localStorage.getItem('helpLink')
    if (helpLink) {
      window.location.href = helpLink
    }
  }

  render() {
    const loginLogo = localStorage.getItem('wechatLoginLogoImg') && localStorage.getItem('wechatLoginLogoImg') !== 'undefined' ? JSON.parse(localStorage.getItem('wechatLoginLogoImg')) : [];
    if (loginLogo[0]) {
      if (!loginLogo[0].url.includes('http:')) {
        const { apiUrl: _apiUrl } = apiConfig;
        let port = window.location.origin.split(':')
        const origin = port[0] + ':' + port[1] || '';
        const apiUrl = process.env.NODE_ENV === 'development' ? _apiUrl : origin;
        let newUrl = apiUrl.split(':')
        loginLogo[0].url = `${newUrl[0]}:${newUrl[1]}${loginLogo[0].url}`
      }
    }
    const helpLink = localStorage.getItem('helpLink')
    return (
      <div>
        <div>
          <NavBar
            mode="dark"
            icon={<Icon type="left" size='lg' />}
            onLeftClick={this.goBack}
            rightContent={[
            ]}
          >
            关于
          </NavBar>
        </div>
        <div>
          <List>
            <Item extra={<Avatar shape="square" src={loginLogo.length > 0 ? loginLogo[0].url : ''} size={32} />}>公司Logo</Item>
            <Item extra={'精诚供应链'}>产品名称</Item>
            <Item extra={'1.0'}>版本</Item>
            <Item extra={'精诚SCM'} arrow="horizontal" onClick={() => router.push('/company/qrcode')}>公众号</Item>
            <Item extra={''} arrow="horizontal" onClick={this.handleHelp}>帮助</Item>
          </List>
        </div>
        <div
          style={{ position: 'absolute', bottom: 16, width: '100%', fontSize: 16 }}
        >
          <div style={{ alignItems: 'center', textAlign: 'center' }}>
            Copyright © 2013-2019
          </div>
          <div style={{ alignItems: 'center', textAlign: 'center' }}>
            精诚Systex版权所有
          </div>
        </div>
      </div>
    )
  }
}