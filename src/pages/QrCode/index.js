import React, { Component } from 'react';

import code from './images/code.png'

export default class QrcodePage extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
        <img
          src={code}
          alt=''
          style={{ width: '100%' }}
        />
      </div>
    )
  }
}