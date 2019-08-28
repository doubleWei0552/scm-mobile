import React, { Component } from "react";
import { NavBar, Icon, Button, SearchBar } from 'antd-mobile'
import router from "umi/router";
import { connect } from 'dva';
import ListViews from '@/components/ListView'

@connect(({ services, loading }) => ({
  services,
  loading: loading.models.queryWorkTasks,
}))
export default class ServicesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.queryWorkTasks()
  }

  // 获取数据
  queryWorkTasks = (queryvalue = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'services/queryWorkTasks',
      payload: { queryvalue },
      callback: (response) => {
        console.log('response', response)
        this.setState({
          data: _.reverse(response.data)
        })
      }
    })
  }
  // 返回
  goBack = () => {
    window.history.back()
  }

  // 新增任务
  handleAddService = () => {
    router.push('/user/service/add')
  }

  // 页面跳转
  onJump = (value) => {
    router.push(`/user/service/see/${value.ID}`)
  }

  // 查询
  handleSearch = (v) => {
    console.log('vvvv', v)
    this.queryWorkTasks(v)
  }

  render() {
    const { data } = this.state
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
        <SearchBar placeholder="Search" maxLength={8} onChange={(v) => this.handleSearch(v)} />
        <div>
          {data.length > 0 && (
            <ListViews list={data} onJump={this.onJump} />
          )}

        </div>
        <Button
          onClick={this.handleAddService}
          style={{ position: 'absolute',zIndex:100, right: 30, bottom: 60, width: 40, height: 40, borderRadius: 20, opacity: 0.9, boxShadow: "5px 5px 5px #888888" }} type="primary">
          <Icon style={{ fontWeight: "bolder" }} type="plus" size='sm' />
        </Button>
      </div>
    )
  }
}