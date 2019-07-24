import React from 'react'
import AMap from '@/components/MapModule/Index'
import {
  Carousel,
  WingBlank
} from 'antd-mobile';
import noImg from '@/assets/noImg.svg'
import Styles from './Index.less'
import router from 'umi/router';
import { Button } from 'antd';


export default class HomePage extends React.Component {
  state = {
    data: ['1', '2', '3'],
    imgHeight: 176,
  }

  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
      });
    }, 100);
  }

  componentWillReceiveProps(newProps) {
    if (window.location.href.indexOf("qrresult=") > -1)
      alert(location.href.split("qrresult=")[1]);
  }



  handleServices = () => {
    router.push('/user/services')
  }

  handleScan = () => {
    window.location.replace(`http://sao315.com/w/api/saoyisao?redirect_uri=${window.location.origin}/mobile?pparams=/homepage/index`)
  }

  render() {
    return (
      <div className={Styles.homePage}>
        <div>
          <Carousel
            autoplay
            infinite
          >
            {this.state.data.map(val => (
              <a
                key={val}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              >
                <img
                  src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    // fire window resize event to change height
                    window.dispatchEvent(new Event('resize'));
                    this.setState({ imgHeight: 'auto' });
                  }}
                />
              </a>
            ))}
          </Carousel>
        </div>
        <div className="items">
          <div className='item' onClick={this.handleServices}>
            <div className='item-img'>
              <img src={noImg} alt='' />
            </div>

            <div className='item-title'>
              服务预约
            </div>
          </div>

          <div className='item'>
            <a href={`http://sao315.com/w/api/saoyisao?redirect_uri=${window.location.origin}/mobile?pparams=/homepage/index`}>
              <div className='item-img'>
                <img src={noImg} alt='' />
              </div>
            </a>

            <div className='item-title'>
              付款登记
            </div>
          </div>

          <div className='item'>
            <div className='item-img'>
              <img src={noImg} alt='' />
            </div>

            <div className='item-title'>
              产品知识
            </div>
          </div>
          <div className='item'>
            <div className='item-img'>
              <img src={noImg} alt='' />
            </div>

            <div className='item-title'>
              问题提报
            </div>
          </div>
        </div>
      </div >
    )
  }
}