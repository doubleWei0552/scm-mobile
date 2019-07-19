import React, { Component } from "react";
import { NavBar, Icon } from 'antd-mobile';

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
          修改登录密码
        </div>
      </div>
    )
  }
}