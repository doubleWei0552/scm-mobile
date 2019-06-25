import React, { Component } from 'react';
import { connect } from 'dva';
// import QrReader from 'react-qr-reader'
import Link from 'umi/link';
import _ from 'lodash';
import ReactDom from 'react-dom';
import Quagga from 'quagga';
import { Avatar, Button, Upload } from 'antd';
import { NavBar, Icon, TabBar, List, WhiteSpace, WingBlank, Result, ActivityIndicator } from 'antd-mobile';

const Item = List.Item;

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
export default class UserCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 500,
      result: 'No result',
    };
  }

  componentDidMount() {
    // this.queryCurrent();
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#test')    // Or '#yourElement' (optional)
      },
      decoder: {
        readers: ["ean_8_reader"]
      }
    }, function (err) {
      if (err) {
        console.log(err);
        return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
    });
  }

  handleScan = (data) => {
    console.log('result', data)
    if (data) {
      // this.setState({ result })
      this.setState({
        result: data
      })
    }
  }
  handleError = (err) => {
    console.error(err)
  }
  render() {
    console.log('center', Quagga)
    const previewStyle = {
      height: 240,
      width: 320,
    }
    return (
      <div>
        {/* <QrReader
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
        /> */}

        <p id='test'></p>
        <Button onClick={this.onScan}>{this.state.result}</Button>
      </div>
    )
  }
}