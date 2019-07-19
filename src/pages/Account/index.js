import React, { Component } from "react";
import {
  List,
  NavBar,
  Icon
} from 'antd-mobile';
import router from 'umi/router'

const Item = List.Item;

export default class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  goBack = () => {
    window.history.back()
  }

  render() {
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
            账号与安全
          </NavBar>
        </div>
        <div>
          <List>
            <Item onClick={() => { router.push('/user/password') }} arrow="horizontal">修改登录密码</Item>
          </List>
        </div>
      </div>
    )
  }
}