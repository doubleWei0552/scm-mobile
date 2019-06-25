/* eslint no-dupe-keys: 0, no-mixed-operators: 0 */
import React from 'react'
import { connect } from 'dva';
import Link from 'umi/link';
import _ from 'lodash';
import ReactDOM from 'react-dom';
import noImg from '@/assets/noImg.svg'
import moment from 'moment'
import {
  Menu,
  ActivityIndicator,
  NavBar,
  Icon,
  Card,
  WhiteSpace,
  ListView,
  Stepper,
  PullToRefresh,
  Badge,
  Modal,
  List,
  Button,
  SearchBar,
  WingBlank,
  Toast
} from 'antd-mobile';
import router from 'umi/router';
import styles from './order.less'

const NUM_SECTIONS = 10;
const NUM_ROWS_PER_SECTION = 10;  //每页展示的数据
let pageIndex = 0;

let dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 1, list = []) {
  const sectionName = `Section ${pIndex}`
  const idx = _.findIndex(sectionIDs, item => item === sectionName)
  if (idx > -1) {
    sectionIDs[idx] = sectionName;
    dataBlobs[sectionName] = sectionName;
    rowIDs[idx] = [];
    _.map(list, (item, i) => {
      rowIDs[idx].push(item.order.ID);
      dataBlobs[item.ID] = item.order.ID;
    })
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];
  } else {
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[pIndex - 1] = [];
    _.map(list, (item, i) => {
      rowIDs[pIndex - 1].push(item.order.ID);
      dataBlobs[item.ID] = item.order.ID;
    })
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];
  }

}

@connect(({ goodsData, loading, orderList }) => ({
  goodsData,
  orderList,
  loading: loading.models.goodsData,
}))

export default class OrderList extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      pageIndex: 1,
      height: document.documentElement.clientHeight * 3 / 4,
      refreshing: false
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);
    let showData = _.get(this.props.orderList, 'orderList')
    const customerId = localStorage.getItem('customerId') * 1;
    const userId = localStorage.getItem('userId') * 1;
    this.props.dispatch({
      type: 'orderList/getOrderList',
      payload: {
        userId,
        customerId,
        pageSize: 10,
        totalRecord: 10,
        currentPage: this.state.pageIndex,
      },
      callback: res => {
        genData(this.state.pageIndex, res.data.list);
      }
    })

    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    // simulate initial Ajax
    setTimeout(() => {
      // genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
        height: hei,
      });
    }, 1000);
  }

  // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
  componentWillReceiveProps(nextProps) {
    // if (nextProps.dataSource !== this.props.dataSource) {
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
    //   });
    // }
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', event);
    this.setState({ isLoading: true });
    let showData = _.get(this.props.orderList, 'orderList')
    const customerId = localStorage.getItem('customerId') * 1;
    const userId = localStorage.getItem('userId') * 1;
    this.props.dispatch({
      type: 'orderList/getOrderList',
      payload: {
        userId,
        customerId,
        pageSize: 10,
        totalRecord: 10,
        currentPage: this.state.pageIndex + 1,
      },
      callback: res => {
        if (res.data.list.length > 0) {
          setTimeout(() => {
            genData(res.data.currentPage, res.data.list)
            this.setState({
              dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
              isLoading: false,
              pageIndex: this.state.pageIndex + 1
            });
          }, 1000)
        } else {
          this.setState({
            isLoading: false
          })
        }
      }
    })
  }

  onRefresh = () => {
    this.setState({
      refreshing: false
    })
    const customerId = localStorage.getItem('customerId') * 1;
    const userId = localStorage.getItem('userId') * 1;
    this.props.dispatch({
      type: 'orderList/getOrderList',
      payload: {
        userId,
        customerId,
        pageSize: 10,
        totalRecord: 10,
        currentPage: 1,
      },
      callback: res => {
        genData(this.state.pageIndex, res.data.list);
      }
    })
    setTimeout(() => {
      // genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
        // height: hei,
      });
    }, 600);
  }

  //订单列表模糊搜索
  searchBar = (e) => {
    let searchParams = {
      code: e
    }
    this.props.dispatch({
      type: 'orderList/getSearch', payload: {
        params: {
          searchParams,
          pageSize: 10,
          totalRecord: 10,
          currentPage: this.state.pageIndex,
        }
      }, callback: res => {
        genData(this.state.pageIndex, res.data.list);
      }
    })
  }

  getDetailsPage = (rowID) => {
    console.log('order rowID', rowID)
    router.push(`/orderdetail/${rowID}`)
  }

  render() {
    const separator = (sectionID, rowID) => {
      let showData = _.get(this.props.orderList, 'orderList')
      let index = _.findIndex(showData, item => item.order.ID === rowID);
      if (index > -1) {
        return (
          <div
            key={`${sectionID}-${rowID}`}
            style={{
              backgroundColor: '#F5F5F9',
              height: 8,
              borderTop: '1px solid #ECECED',
              borderBottom: '1px solid #ECECED',
            }}
          />
        )
      }
    };

    const row = (rowData, sectionID, rowID) => {
      let showData = _.get(this.props.orderList, 'orderList')
      let index = _.findIndex(showData, item => item.order.ID === rowID);
      if (index > -1) {
        const obj = showData[index];
        var orderAmount = 0 //总金额
        var orderNum = 0  //总件数
        obj.detailOrder.map(kk => {
          orderAmount += (kk.NUM * kk.PRICE)
          orderNum += kk.NUM
        })
        return (
          <div onClick={() => this.getDetailsPage(rowID)} key={rowID} style={{ padding: '0 15px', width: '100%' }}>
            <div
              style={{
                lineHeight: '50px',
                color: '#888',
                fontSize: 18,
                overflow: 'hidden',
                borderBottom: '1px solid #F6F6F6',
              }}
            >
              <span style={{ float: 'left' }}>订单编号:{obj.order.CODE}</span>
              <span style={{ float: 'right' }}>{moment(obj.order.CREATED_ON).format('YYYY/MM/DD')}</span>
            </div>
            <div style={{ height: '94px', width: '100%', padding: '15px 0', whiteSpace: 'nowrap' }}>
              <div style={{ overflowX: 'scroll', whiteSpace: 'nowrap', display: '-webkit-box' }}>
                {obj.detailOrder.map((ii, jj) => {
                  return <img key={jj} style={{ height: '64px', marginRight: '15px' }} src={noImg || obj.order.URL} alt="error" />
                })}
              </div>
            </div>
            <div style={{ lineHeight: 2.5, borderTop: '1px solid #f7f7f7' }}>
              <div style={{ textAlign: 'right' }}>
                <span>共{obj.detailOrder.length}种</span>
                <span style={{ marginRight: '1rem' }}>{orderNum}件</span>
                <span>总金额：{orderAmount}元</span>
              </div>
            </div>
          </div>
        )
      } else {
        return null
      }
    };
    return (
      <div className={styles.orderMain}>
        <SearchBar placeholder="搜索" onChange={(e) => this.searchBar(e)} />
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? 'Loading...' : '已加载所有数据'}
          </div>)}
          renderRow={row}
          renderSeparator={separator}
          style={{
            height: this.state.height,
            // overflow: 'auto',
            top: 0
          }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
          pullToRefresh={<PullToRefresh
            refreshing={false}
            onRefresh={() => this.onRefresh()}
          />}
        />
      </div>
    );
  }
}