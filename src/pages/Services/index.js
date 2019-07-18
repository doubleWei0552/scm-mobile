import React, { Component } from "react";
import { NavBar, Icon, Button, SearchBar } from 'antd-mobile'
import router from "umi/router";
import ListViews from '@/components/ListView'

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
    const data = [
      {
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        title: 'Meet hotel',
        des: '不是所有的兼职汪都需要风吹日晒',
        ID: 1,
      },
      {
        img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
        title: 'McDonald\'s invites you',
        des: '不是所有的兼职汪都需要风吹日晒',
        ID: 2,
      },
      {
        img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
        title: 'Eat the week',
        des: '不是所有的兼职汪都需要风吹日晒',
        ID: 3,
      },
      {
        img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
        title: 'Meet hotel',
        des: '不是所有的兼职汪都需要风吹日晒',
        ID: 4,
      },
      {
        img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
        title: 'McDonald\'s invites you',
        des: '不是所有的兼职汪都需要风吹日晒',
        ID: 5,
      },
      {
        img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
        title: 'Eat the week',
        des: '不是所有的兼职汪都需要风吹日晒',
        ID: 6,
      },
    ];
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
        <SearchBar placeholder="Search" maxLength={8} />
        <div>
          {data.length && (
            <ListViews list={data} />
          )}

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