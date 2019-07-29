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

  const NUM_SECTIONS = 1;
  const NUM_ROWS_PER_SECTION = 100; //每次加载数据时的渲染个数
  let pageIndex = 0;
  
  const dataBlobs = {};
  let sectionIDs = [];
  let rowIDs = [];

  function genData(pIndex = 0,list = []) {
    const sectionName = `Section ${pIndex}`;
    const idx = _.findIndex(sectionIDs, item => item === sectionName)
    if (idx > -1) {
      return
    }
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
    rowIDs[pIndex] = [];
    _.map(list, (item, i) => {
      rowIDs[pIndex].push(item.ID);
      dataBlobs[item.ID] = item.ID;
    })
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];
    console.log('sectionIDs,rowIDs',sectionIDs,rowIDs)
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
        let list = []
        this.props.dispatch({type:'salesReport/getSalesOrder',payload:{
          PAGEINDEX:1,PAGECOUNT:100
        },callback:res=>{
          list = res.body
        }})
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        // simulate initial Ajax
        setTimeout(() => {
          genData(0,list);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            isLoading: false,
            height: hei,
          });
        }, 1000);
      }
    onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        let list = []
        //暂时不做分页
        // this.props.dispatch({type:'salesReport/getSalesOrder',payload:{
        //   PAGEINDEX:1,PAGECOUNT:100
        // },callback:res=>{
        //   list = res.body
        // }})
        console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
          genData(++pageIndex,list);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            isLoading: false,
          });
        }, 1000);
    }
    //跳转到详情页
    onGetDetail =(value)=>{
        router.push(`/salesReportDetail${value.ID}`)
    }
    //跳转到新增页
    onAddGoods=()=>{
        router.push('/salesReportAddGoods')
    }
        
    render(){
        const { SalesReportList } = this.props.salesReport
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
                    rightContent={[
                        <Icon key={'right'} type="search" />,
                    ]}
                >销售提报
                </NavBar>
                <div style={{height:'calc(100% - 45px)'}}>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                        {this.state.isLoading ? '数据加载中...' : '数据加载完成'}
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