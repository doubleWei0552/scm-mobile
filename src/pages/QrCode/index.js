import React, { Component } from 'react';
import { NavBar, Icon } from 'antd-mobile';
import code from './images/qrcode.png'

export default class QrcodePage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
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
            ]}
          >
            精诚SCM
          </NavBar>
        </div>
        <div style={{ marginTop: 40, marginBottom: 40 }}>
          <img
            src={code}
            alt=''
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <div style={{ textAlign: 'center', fontSize: 16 }}>
            长按识别图中二维码，关注精诚SCM公众号！
          </div>
        </div>

      </div>
    )
  }
}