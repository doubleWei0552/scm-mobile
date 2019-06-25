import React from 'react'
import { connect } from 'dva';
import Link from 'umi/link';
import _ from 'lodash';
import ReactDOM from 'react-dom';
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
  Toast } from 'antd-mobile';
import router from 'umi/router';

const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 5;
let pageIndex = 0;
let dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 1, list=[]) {
  const sectionName = `Section ${pIndex}`;
  const idx = _.findIndex(sectionIDs, item  => item === sectionName)
  if(idx > -1) {
    return
  }
  sectionIDs.push(sectionName);
  dataBlobs[sectionName] = sectionName;
  rowIDs[pIndex-1] = [];
  _.map(list, (item, i)=>{
    rowIDs[pIndex-1].push(item.ID);
    dataBlobs[item.ID] = item.ID;
  })
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}

@connect(({ goodsData, loading, order }) => ({
    goodsData,
    order,
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
        height: document.documentElement.clientHeight * 3 / 4,
      };
    }
    componentWillMount=()=>{
      this.props.dispatch({type:'order/getOrderList',payload:{params:{
        pageSize:10,
        totalRecord:10,
        currentPage:1,
      }}})
    }
    componentDidMount() {
      const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
      // simulate initial Ajax
      setTimeout(() => {
        genData();
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
          isLoading: false,
          height: hei,
        });
      }, 600);
    }
  
    // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
    // componentWillReceiveProps(nextProps) {
    //   if (nextProps.dataSource !== this.props.dataSource) {
    //     this.setState({
    //       dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
    //     });
    //   }
    // }
  
    onEndReached = (event) => {
      if (this.state.isLoading && !this.state.hasMore) {
        return;
      }
      console.log('reach end', event);
      this.setState({ isLoading: true });
      setTimeout(() => {
        genData(++pageIndex);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
          isLoading: false,
        });
      }, 1000);
    }

    searchBar=(e)=>{
      console.log(e)
    }
  
    render() {
      const data = _.get(this.props.order,'orderList.list',[])
      console.log('显示数据',data)
      const separator = (sectionID, rowID) => (
        <div
          key={`${sectionID}-${rowID}`}
          style={{
            backgroundColor: '#F5F5F9',
            height: 8,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED',
          }}
        />
      );
      let index = data.length - 1;

      //展示内容
      const row = (rowData, sectionID, rowID) => {
        console.log('数据',rowData,sectionID,rowID)
        data.map((item,index)=>{
          var orderAmount = 0 //总金额
          var orderNum = 0  //总件数
          item.detailOrder.map(kk=>{
            orderAmount += (kk.NUM * kk.PRICE)
            orderNum += kk.NUM
          })
          return(
            <div key={index} style={{ padding: '0 15px' }}>
            <div
              style={{
                lineHeight: '50px',
                color: '#888',
                fontSize: 18,
                overflow:'hidden',
                borderBottom: '1px solid #F6F6F6',
              }}
            >
            <span style={{float:'left'}}>订单编号:{item.order.CODE}</span>
            <span style={{float:'right'}}>{moment(item.order.CREATED_ON).format('YYYY/MM/DD')}</span>
            </div>
            <div style={{ height: '94px' ,display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                {item.detailOrder.map((ii,jj) =>{
                    return <img key={jj} style={{ height: '64px', marginRight: '15px' }} src={'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png'} alt="" />
                })}
            </div>
            <div style={{ lineHeight: 2.5,borderTop:'1px solid #f7f7f7' }}>
                 <div style={{textAlign:'right'}}>
                     <span>共{item.detailOrder.length}种</span>
                     <span style={{marginRight:'1rem'}}>{orderNum}件</span>
                     <span>总金额：{orderAmount}元</span>
                 </div>
            </div>
            </div>
          )
        })
      };
  
      return (
        <div>
          <SearchBar placeholder="搜索" maxLength={8} onChange={(e)=>this.searchBar(e)}/>
          {/* <WhiteSpace /> */}
          <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            renderRow={row}  
            renderSeparator={separator}
            style={{
              height: this.state.height,
              overflow: 'auto',
            }}
            pageSize={4}
            onScroll={() => { console.log('scroll'); }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
        </div>
        
      );
    }
  }