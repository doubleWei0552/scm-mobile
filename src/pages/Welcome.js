import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import ReactDom from 'react-dom';
import { ListView, NavBar, Icon, Drawer, List  } from 'antd-mobile';
import Style from './welcome.less'


// @connect(({ login, loading }) => ({
//   login,
//   submitting: loading.effects['login/login'],
// }))
class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    
  }

  render() {
    
    return (
      <div className={Style.welcomePage}>
        login
      </div>    
    );
  }
}

export default LoginPage;
