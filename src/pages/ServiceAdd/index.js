import React, { Component, mountNode } from "react";
import ReactDOM from 'react-dom';
import {
  NavBar,
  Icon,
  List,
  InputItem,
  Switch,
  LocaleProvider,
  Stepper,
  Range,
  Button,
  Picker,
  TextareaItem,
  WhiteSpace,
  DatePicker
} from 'antd-mobile';
import moment from 'moment'
import zhCN from 'antd/es/locale/zh_CN';
import enUS from 'antd-mobile/lib/locale-provider/en_US';
import ruRU from 'antd-mobile/lib/locale-provider/ru_RU';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import Styles from './style.less';

const Item = List.Item;

@createForm()
@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
export default class ServiceAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customerUserList: [],
      postData: {},
      date: null,
      customerContact: [],
      checked: false,
      START_DATE: null,
      END_DATE: null,
    }
  }

  componentDidMount = () => {
    const userId = localStorage.getItem('userId');
    this.queryCurrent(userId);
  }

  // 查询客户
  queryCurrent = (userId) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/queryCurrent',
      payload: { userId },
      callback: response => {
        if (response.status === 'success') {
          const { customerUserList } = response.data;
          this.setState({
            userInfo: response.data,
            visible: false,
            customerUserList
          })
        }
      }
    })

  }

  // 返回
  goBack = () => {
    window.history.back()
  }

  // 表单数据
  handleItemChange = (value, key) => {
    const { dispatch } = this.props;
    this.state.postData[key] = value

    if (key === 'ORGANIZATION_ID') {
      dispatch({
        type: 'serviceAdd/queryCustomer',
        payload: { Id: value },
        callback: (result) => {
          if (result.status === 'success') {
            const { CUSTOMER_CONTACT = [] } = result.data
            this.setState({
              customerContact: CUSTOMER_CONTACT
            })
          }
        }
      })
    }
    this.setState({
    })
  }

  // Switch
  handleSwitch = (checked) => {
    this.setState({
      checked
    })
  }

  // 日期变化
  handleChangeData = (date, key) => {
    const { checked } = this.state
    let newDate 
    if (checked) {
      newDate = moment(date).set({hour:0,minute:0,second:0,millisecond:0}).valueOf()
      if(key == 'START_DATE'){
        this.state.postData['START_DATE'] = newDate 
      } else if(key == 'END_DATE'){
        this.state.postData['END_DATE'] = newDate
      }
    } else {
      newDate = _.cloneDeep(date.valueOf())
      this.state.postData[key] = date.valueOf()
    }
    this.state[key] = date
    this.setState({})
  }

  // 保存
  handleAdd = () => {
    const { dispatch } = this.props;
    const { postData } = this.state;
    dispatch({
      type: 'serviceAdd/serviceAdd',
      payload: postData
    })
  }

  render() {
    const { customerUserList, customerContact, checked, START_DATE, END_DATE, postData } = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    _.map(customerUserList, item => {
      item.label = item.NAME
      item.value = item.ID
    })
    _.map(customerContact, item => {
      item.label = `${item.CONTACT}(${item.MOBILE_PHONE})`
      item.value = item.ID
    })
    const district = [
      {
        label: '2013',
        value: '2013',
      }];
    return (
      <LocaleProvider>
        <div className={Styles.serviceAdd}>
          <div>
            <NavBar
              mode="dark"
              icon={<Icon type="left" size='lg' />}
              onLeftClick={this.goBack}
              rightContent={[
                // <Icon type="plus" size='lg' />
              ]}
            >
              新任务
          </NavBar>
          </div>
          <div>

            <List
            // renderHeader={() => 'Form Validation'}
            // renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
            >
              <InputItem
                clear
                onChange={(v) => this.handleItemChange(v, 'SUBJECT')}
              // placeholder="auto focus"
              >
                标题
            </InputItem>
              <Picker value={[postData.ORGANIZATION_ID]} data={customerUserList} cols={1} onOk={v => this.handleItemChange(v[0], 'ORGANIZATION_ID')} className="forss">
                <List.Item arrow="horizontal">公司</List.Item>
              </Picker>
              <Picker value={[postData.CONTACT_ID]} data={customerContact} cols={1} onOk={v => this.handleItemChange(v[0], 'CONTACT_ID')} className="forss">
                <List.Item arrow="horizontal">联系人</List.Item>
              </Picker>
              <TextareaItem
                title='地址'
                autoHeight
                onChange={(v) => this.handleItemChange(v, 'ADDRESS')}
              />
            </List>
            <WhiteSpace size="lg" />
            <List
            // renderHeader={() => 'Form Validation'}
            // renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
            >
              <Item
                extra={<Switch checked={checked} onChange={(v) => this.handleSwitch(v)} />}
              >全天</Item>
              <DatePicker
                value={START_DATE}
                title='开始时间'
                onChange={date => this.handleChangeData(date, 'START_DATE')}
                mode={checked ? 'date' : 'datetime'}
              >
                <List.Item arrow="horizontal">开始时间</List.Item>
              </DatePicker>
              <DatePicker
                value={END_DATE}
                onChange={date => this.handleChangeData(date, 'END_DATE')}
                mode={checked ? 'date' : 'datetime'}
                title='结束时间'
              >
                <List.Item arrow="horizontal">结束时间</List.Item>
              </DatePicker>
            </List>
            <WhiteSpace size="lg" />
            {/* <List renderHeader={() => <div style={{ color: '#000', fontSize: 17 }}>描述</div>}>
              <TextareaItem
                // defaultValue="我是描述..."
                onChange={(v) => this.handleItemChange(v, 'DESCRIBE')}
                rows={5}
                count={100}
              />
            </List> */}
            <List>
              <TextareaItem
                onChange={(v) => this.handleItemChange(v, 'DESCRIBE')}
                placeholder="描述..."
                rows={5}
                count={100}
              />
            </List>
          </div>
          <div style={{ display: 'flex', position: 'absolute', bottom: 16, width: '100%', justifyContent: 'space-around' }}>
            <Button onClick={this.goBack} style={{ width: '45%' }} type="warning">取消</Button>
            <Button onClick={this.handleAdd} style={{ width: '45%' }} type="primary">保存</Button>
          </div>
        </div >
      </LocaleProvider>
    )
  }
}

    // const BasicInputWrapper = createForm()(ServiceAdd);
// ReactDOM.render(<BasicInputWrapper />, mountNode);