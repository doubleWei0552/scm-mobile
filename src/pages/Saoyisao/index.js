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

@connect(({ saoyisao, loading }) => ({
  saoyisao,
  loading: loading.models.saoyisao,
}))
export default class UserCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 500,
      result: 'No result',
    };
  }

  componentWillMount() {
    console.log('saoyosao', this.props)
    console.log('saoyosao', wx)
    const { dispatch } = this.props;
    dispatch({
      type: 'saoyisao/queryConfig',
      // payload: { url: encodeURIComponent('http://www.doublewei.online/') },
      payload: {
        url: 'http://www.doublewei.online/'
      },
      callback: (response) => {
        console.log('response', response)
        wx.config({
          debug: true,
          appId: response.appId,
          timestamp: response.timestamp,
          nonceStr: response.noncestr,
          signature: response.signature,
          jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
          ]
        });
      }
    })
  }

  componentDidMount() {
    // this.queryCurrent();
    // Quagga.init({
    //   inputStream: {
    //     name: "Live",
    //     type: "LiveStream",
    //     target: document.querySelector('#test')    // Or '#yourElement' (optional)
    //   },
    //   decoder: {
    //     readers: ["ean_reader"]
    //     // readers: ["ean_reader", "ean_8_reader"]

    //   }
    // }, function (err) {
    //   if (err) {
    //     console.log(err);
    //     return
    //   }
    //   console.log("Initialization finished. Ready to start");
    //   Quagga.start();
    //   Quagga.onDetected(function (data) {
    //     console.log(data)
    //     alert(data.codeResult.code)
    //   })

    // });


    var barcode = null;
    // 扫码成功回调
    function onmarked(type, result) {
      var text = '未知: ';
      switch (type) {
        case plus.barcode.QR:
          text = 'QR: ';
          break;
        case plus.barcode.EAN13:
          text = 'EAN13: ';
          break;
        case plus.barcode.EAN8:
          text = 'EAN8: ';
          break;
      }
      alert(text + result);
    }
    // 创建Barcode扫码控件
    function createBarcode() {
      if (!barcode) {
        barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
          top: '100px',
          left: '0px',
          width: '100%',
          height: '500px',
          position: 'static'
        });
        barcode.onmarked = onmarked;
        plus.webview.currentWebview().append(barcode);
      }
      barcode.start();
    }
  }

  handleScan = () => {
    wx.scanQRCode({
      desc: 'scanQRCode desc',
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
      }
    });
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
        <Button onClick={this.handleScan}>{this.state.result}</Button>
      </div>
    )
  }
}