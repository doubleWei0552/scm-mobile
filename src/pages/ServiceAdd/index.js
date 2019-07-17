import React, { Component, mountNode } from "react";
import ReactDOM from 'react-dom';
import {
  NavBar,
  Icon,
  List,
  InputItem,
  Switch,
  Stepper,
  Range,
  Button,
  Picker,
  TextareaItem,
  WhiteSpace,
  DatePicker
} from 'antd-mobile';
import { createForm } from 'rc-form';
import Styles from './style.less';

const Item = List.Item;

@createForm()
export default class ServiceAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: null
    }
  }

  // 返回
  goBack = () => {
    window.history.back()
  }

  render() {
    console.log('ssss', this.props)
    const { getFieldProps, getFieldError } = this.props.form;

    const district = [
      {
        label: '2013',
        value: '2013',
      }];
    return (
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
            // placeholder="auto focus"
            >
              标题
            </InputItem>
            <Picker data={district} cols={1} {...getFieldProps('district3')} className="forss">
              <List.Item arrow="horizontal">公司</List.Item>
            </Picker>
            <Picker data={district} cols={1} {...getFieldProps('district3')} className="forss">
              <List.Item arrow="horizontal">联系人</List.Item>
            </Picker>
            <TextareaItem
              title='地址'
              autoHeight
            />
          </List>
          <WhiteSpace size="lg" />
          <List
          // renderHeader={() => 'Form Validation'}
          // renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
          >
            <Item
              extra={<Switch {...getFieldProps('1', { initialValue: true, valuePropName: 'checked' })} />}
            >全天</Item>
            <DatePicker
              value={this.state.date}
              onChange={date => this.setState({ date })}
            >
              <List.Item arrow="horizontal">开始时间</List.Item>
            </DatePicker>
            <DatePicker
              value={this.state.date}
              onChange={date => this.setState({ date })}
            >
              <List.Item arrow="horizontal">结束时间</List.Item>
            </DatePicker>
          </List>
          <WhiteSpace size="lg" />
          <List renderHeader={() => <div style={{ color: '#000', fontSize: 17 }}>描述</div>}>
            <TextareaItem
              defaultValue="我是描述..."
              rows={5}
              count={100}
            />
          </List>
          {/* <List>
            <TextareaItem
              defaultValue="描述..."
              rows={5}
              count={100}
            />
          </List> */}
        </div>
        <div style={{ display: 'flex', position: 'absolute', bottom: 16, width: '100%', justifyContent: 'space-around' }}>
          <Button style={{ width: '45%' }} type="warning">取消</Button>
          <Button style={{ width: '45%' }} type="primary">保存</Button>
        </div>
      </div >
    )
  }
}

    // const BasicInputWrapper = createForm()(ServiceAdd);
// ReactDOM.render(<BasicInputWrapper />, mountNode);