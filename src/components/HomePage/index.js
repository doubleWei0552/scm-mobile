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
import WaterfallFlow from '../WaterfallFlow/Index'
// 临时添加
import banner1 from '@/assets/jzq/banner1.jpg'
import banner2 from '@/assets/jzq/banner2.jpg'
import banner3 from '@/assets/jzq/banner3.jpg'
import banner4 from '@/assets/jzq/banner4.jpg'
import jzq1 from '@/assets/jzq/jzq1.jpg'
import jzq2 from '@/assets/jzq/jzq2.jpg'
import jzq3 from '@/assets/jzq/jzq3.jpg'
import jzq4 from '@/assets/jzq/jzq4.jpg'
import jzq5 from '@/assets/jzq/jzq5.jpg'
import jzq6 from '@/assets/jzq/jzq6.jpg'
import jzq7 from '@/assets/jzq/jzq7.jpg'
import jzq8 from '@/assets/jzq/jzq8.jpg'
import jzq9 from '@/assets/jzq/jzq9.jpg'
import jzq10 from '@/assets/jzq/jzq1.jpg'
import tag1 from '@/assets/jzq/tag1.jpg'
import tag2 from '@/assets/jzq/tag2.jpg'
import tag3 from '@/assets/jzq/tag3.jpg'
import tag4 from '@/assets/jzq/tag4.jpg'

export default class HomePage extends React.Component {
  state = {
    data: ['1', '2', '3', '4'],
    banners: [banner1, banner2, banner3, banner4], // 临时添加
    images: [jzq1, jzq2, jzq3, jzq4, jzq5, jzq6, jzq7, jzq8, jzq9, jzq10], //临时添加
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
            {this.state.data.map((val, index) => (
              <a
                key={val}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              >
                <img
                  src={this.state.banners[index]}
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
        <div className="items" style={{ paddingTop: 10 }}>
          <div className='item' onClick={this.handleServices}>
            <div className='item-img'>
              <img src={tag1} alt='' />
            </div>

            <div className='item-title'>
              服务预约
            </div>
          </div>

          <div className='item'>
            <a href={`http://sao315.com/w/api/saoyisao?redirect_uri=${window.location.origin}/mobile?pparams=/homepage/index`}>
              <div className='item-img'>
                <img src={tag2} alt='' />
              </div>
            </a>

            <div className='item-title'>
              付款登记
            </div>
          </div>

          <div className='item'>
            <div className='item-img'>
              <img src={tag3} alt='' />
            </div>

            <div className='item-title'>
              产品知识
            </div>
          </div>
          <div className='item' onClick={() => router.push('/salesReport')}>
            <div className='item-img'>
              <img src={tag4} alt='' />
            </div>

            <div className='item-title'>
              销售提报
            </div>
          </div>
        </div>
        {/* 瀑布流组件 */}
        <div style={{ height: '1rem', borderBottom: '1px solid lightgray', marginBottom: '1rem' }} />
        <div style={{ paddingBottom: '70px' }}>
          <WaterfallFlow images={this.state.images} />
        </div>
      </div >
    )
  }
}