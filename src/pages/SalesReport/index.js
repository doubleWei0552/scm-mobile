import React from 'react'
import { NavBar, Icon,ListView } from 'antd-mobile'
import ReactDOM from 'react-dom'
import { Button } from 'antd';
import { connect } from 'dva'
import style from './index.less'
import router from 'umi/router';
import moment from 'moment'

import noImg from '@/assets/noImg.svg'

function MyBody(props) {
    return (
      <div key={Math.random()} className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
  }

let pageIndex = 1;
const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 1,list=[]) {
    const sectionName = `Section ${pIndex}`
    let index = _.findIndex(sectionIDs,item => item == sectionName)
    if(index < 0){
        sectionIDs.push(sectionName)
        dataBlobs[sectionName] = sectionName
    }
    
    if(index < 0){
      rowIDs[pIndex] = [];
      for (let jj = 0; jj < list.length; jj++) {
        rowIDs[pIndex].push(list[jj].ID);
        dataBlobs[list[jj].ID] = list[jj].ID;
      }
    }
    
    sectionIDs = [...sectionIDs];
    rowIDs = _.filter([...rowIDs],item => item != undefined);
}

@connect(({ salesReport, loading }) => ({
    salesReport,
}))  
export default class SalesReportList extends React.Component{
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
    
    
    componentDidMount() {
      const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        this.props.dispatch({type:'salesReport/getSalesOrder',payload:{
          PAGEINDEX:pageIndex
        },callback:res=>{
          setTimeout(() => {
            genData(1,res.body);
            this.setState({
              dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
              isLoading: false,
              height: hei,
            });
          }, 1000);
        }})
      this.props.dispatch({
        type:'salesReport/save',
        payload:{
          SalesGoodsList:[], 
          SalesSelectGoods:{}, 
          SalesAllSelectGoods:[],
        }
      })
    }
    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        //暂时不做分页
        this.props.dispatch({type:'salesReport/getSalesOrder',payload:{
          PAGEINDEX:++pageIndex
        },callback:res=>{
          setTimeout(() => {
            genData(++pageIndex,res.body);
            this.setState({
              dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
              isLoading: false,
            });
          }, 1000);
        }})
        console.log('reach end', event);
        this.setState({ isLoading: true });
    }
    //跳转到详情页
    onGetDetail =(value)=>{
      console.log('选择的数据',value)
        this.props.dispatch({
          type:'salesReport/save',
          payload:{OrderSelectData:value}
        })
        router.push(`/salesReportDetail`)
    }
    //跳转到新增页
    onAddGoods=()=>{
        router.push('/salesReportAddGoods')
    }

    // componentWillUnmount=()=>{
    //   pageIndex = 1;
    //   dataBlobs = {};
    //   sectionIDs = [];
    //   rowIDs = [];
    // }
        
    render(){
        const  SalesReportList = _.get(this.props.salesReport,'SalesReportList')
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

        const row = (rowData, sectionID, rowID) => {
          let index = _.findIndex(SalesReportList,item => item.ID == rowID)
          const obj = SalesReportList[index];
          return (
              <div onClick={()=>this.onGetDetail(obj)} key={rowID} style={{ padding: '0 15px' }}>
                  <div
                      style={{
                      lineHeight: '2.5rem',
                      color: '#888',
                      fontSize: '1rem',
                      borderBottom: '1px solid #F6F6F6',
                      }}
                  >订单：<label style={{marginRight:'1rem'}}>{obj.CODE}</label>{moment(obj.DOCUMENT_DATE).format('YYYY年MM月DD日')}</div>
                  <div style={{ display: '-webkit-box', display: 'flex', padding: '10px 0',borderBottom: '1px solid #F6F6F6' }}>
                      <img style={{ height: '64px', marginRight: '15px' }} src={obj.img || noImg} alt="error" />
                  </div>
                  <div style={{ lineHeight: 1,lineHeight:'2.5rem',textAlign:'right' }}>
                      <span>共 {obj.ChildSize} 种 {obj.ChildSnum} 件　总金额：{obj.ChildSprice}</span>
                  </div>
              </div>
        );}
        return(
            <div style={{height:'100%'}} className={style.SalesReportListMain}>
                <NavBar
                    mode="dark"
                    leftContent={[
                        <Icon key={'left'} onClick={()=>router.goBack()} type="left" />,
                    ]}
                    // rightContent={[
                    //     <Icon key={'right'} type="search" />,
                    // ]}
                >销售提报
                </NavBar>
                <div style={{height:'calc(100% - 45px)'}}>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                        {this.state.isLoading ? '数据加载中...' : '已加载所有数据'}
                        </div>)}
                        // renderBodyComponent={() => <MyBody />}
                        renderRow={row}
                        renderSeparator={separator}
                        style={{
                        height: this.state.height,
                        overflow: 'auto',
                        }}
                        pageSize={4}
                        scrollRenderAheadDistance={500}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
                    />
                </div>
                <div onClick={this.onAddGoods} className={style.addButton}>
                    <Icon key="add" type="plus" />
                </div>
            </div>
        )
    }
}