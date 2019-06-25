import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import _ from 'lodash';
import ReactDom from 'react-dom';
import { Avatar, Button, Upload, Form } from 'antd';
import { NavBar, PickerView, Icon, TabBar, List, WhiteSpace, WingBlank, Result, ActivityIndicator, Picker } from 'antd-mobile';
import router from 'umi/router';
import styles from './style.less';

const Item = List.Item;
@Form.create()
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
export default class CustomerSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      customerId: ''
    };
  }

  componentDidMount() {
    const userId = localStorage.getItem('userId');
    console.log('userId', userId)
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

    this.setState({
      customerId: customerId[0]
    })
  }

  fnUrlReplace = (href) => {
    // console.log('eleLink', eleLink)
    // if (!eleLink) {
    //   return;
    // }
    // var href = eleLink.href;
    console.log('href', href)
    if (href && /^#|javasc/.test(href) === false) {
      console.log('history', href.split('#')[0])

      if (history.replaceState) {
        const newHref = href.split('#')[0] + '#' + href.split('#')[1] + '#'
        history.replaceState(null, document.title, newHref);
        location.replace(href);
      } else {
        location.replace(href);
      }
    }
  }


  confirmSelect = () => {
    console.log('ssss', location)
    const { customerId } = this.state
    localStorage.setItem('customerId', customerId)
    // this.fnUrlReplace(location.origin + '/#' + '/homepage/goodList')
    router.push('/homepage')
  }

  render() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const { userInfo, customerId } = this.state;
    const { customerUserList = [] } = userInfo;
    const { getFieldProps } = this.props.form;
    _.map(customerUserList, item => {
      item.label = item.NAME,
        item.value = item.ID
    })
    console.log('userInfo', userInfo)
    return (
      <div className={styles.customerselectPage} style={{ height: '100%', position: 'relative' }}>
        <div>
          <NavBar
            mode="dark"
          // icon={<Icon size='lg' type="left" />}
          // onLeftClick={this.goback}
          >
            选择客户
          </NavBar>
        </div>
        {/* <div style={{ marginTop: 20 }}>
          <Picker
            data={customerUserList}
            cols={1}
            visible={true}
            onDismiss={() => this.setState({ visible: false })}
            {...getFieldProps('district3')}
            className="forss"
            onOk={v => this.selectCustomer(v[0])}
          >
            <div>d</div>
          </Picker>
        </div> */}
        <div style={{ marginTop: 50, }}>
          <PickerView
            data={customerUserList}
            value={[customerId]}
            cascade={false}
            onChange={(e) => this.selectCustomer(e)}
          />
        </div>

        <div style={{ height: 45, marginBottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 50, width: '100%' }}>
          <Button onClick={this.confirmSelect} style={{ width: '85%', height: 40, fontSize: '16px' }} type="primary" >确认选择</Button>
        </div>



      </div>
    )
  }
}