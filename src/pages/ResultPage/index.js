import React, { Component } from "react";
import { NavBar, Icon, Button, SearchBar } from 'antd-mobile'
import router from "umi/router";
import { connect } from 'dva';
import ListViews from '@/components/ListView'

// @connect(({ }) => ({
//   services,
//   loading: loading.models.queryWorkTasks,
// }))
export default class ResultPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillMount() {
    console.log('willMount', this.props)
    const { type = '1' } = _.get(this.props.match, 'params');
    if (window.location.href.indexOf("pparams=") > -1) {
      const path = window.location.href.match(/pparams=(\S*)&/)[1];
      let CODE = ''
      if (window.location.href.indexOf("%2C") > -1) {
        CODE = window.location.href.match(/%2C(\S*)#/)[1];
      } else {
        CODE = window.location.href.match(/qrresult=(\S*)#/)[1];
      }
      router.push(`${path}?CODE=${CODE}`)
      // alert(window.location.href)
      return
    }
    if (type === '1') {
      router.push('/welcome')
    }

  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    console.log('rrrrnewProps', newProps)
    const { type = '1' } = _.get(newProps.match, 'params');
    if (type === '1') {
      alert(window.location.href)
      router.push('/welcome')
    } else {
      const { pparams = '' } = _.get(newProps.location, 'query')
      if (window.location.href.indexOf("qrresult=") > -1) {
        alert(location.href.split("qrresult=")[1]);
      } else {
        alert(pparams)
      }

    }
    alert(type)
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
          data: response.data
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
    console.log('this.props', this.props)
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
            Result
          </NavBar>
        </div>

      </div>
    )
  }
}