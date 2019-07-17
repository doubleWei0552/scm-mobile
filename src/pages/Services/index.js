import React, { Component } from "react";
import { NavBar, Icon, Button } from 'antd-mobile'
import router from "umi/router";

export default class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // 返回
  goBack = () => {
    window.history.back()
  }

  // 新增任务
  handleAddService = () => {
    router.push('/user/service/add')
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
            任务列表
          </NavBar>
        </div>
        <div>

        </div>
        <Button
          onClick={this.handleAddService}
          style={{ position: 'absolute', right: 30, bottom: 60, width: 40, height: 40, borderRadius: 20, opacity: 0.9, boxShadow: "5px 5px 5px #888888" }} type="primary">
          <Icon style={{ fontWeight: "bolder" }} type="plus" size='sm' />
        </Button>
      </div>
    )
  }
}