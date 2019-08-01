import React from 'react'
import { NavBar, Icon,ListView,Button,List, Stepper,InputItem,WhiteSpace,Picker,SearchBar } from 'antd-mobile'
import router from 'umi/router'
import ReactDOM from 'react-dom'
import { connect } from 'dva'

import noImg from '@/assets/noImg.svg'

function MyBody(props) {
    return (
      <div className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
}  

let pageIndex = 0;
const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0,list=[]) {
    const sectionName = `Section ${pIndex}`
    let index = _.findIndex(sectionIDs,item => item == sectionName)
    if(index < 0){
        sectionIDs.push(sectionName)
        dataBlobs[sectionName] = sectionName
    }
    rowIDs[pIndex] = [];
    for (let jj = 0; jj < list.length; jj++) {
      rowIDs[pIndex].push(list[jj].ID);
      dataBlobs[list[jj].ID] = list[jj].ID;
    }
    sectionIDs = [...sectionIDs];
    rowIDs = _.filter([...rowIDs],item => item != undefined);
}
  
@connect(({ salesReport, loading }) => ({
    salesReport,
}))  
export default class SelectGoods extends React.Component{
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
        // simulate initial Ajax
        this.props.dispatch({
          type:'salesReport/getByCarModel',
          payload:{currentPage:++pageIndex},
          callback:res=>{
            if(res.status == 'success'){
              let SalesGoodsList = res.data.list
              setTimeout(() => {
                genData(0,SalesGoodsList);
                this.setState({
                  dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                  isLoading: false,
                  height: hei,
                });
              }, 600);
            }
          }
        })
      }
      addGoods=(value)=>{
        console.log('用户选择添加的商品',value)
        this.props.dispatch({type:'salesReport/save',payload:{SalesSelectGoods:value}})
        router.push(`/salesReportAddGoods`)
      }
    
      onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        let SalesGoodsList = []
        console.log('reach end', event);
        this.setState({ isLoading: true });
        this.props.dispatch({
          type:'salesReport/getByCarModel',
          payload:{currentPage:++pageIndex},
          callback:res=>{
            if(res.status == 'success'){
              let SalesGoodsList = res.data.list
              setTimeout(() => {
                genData(++pageIndex,SalesGoodsList);
                this.setState({
                  dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                  isLoading: false,
                });
              }, 1000);
            }
          }
        })
      }    
        
    render(){
        let SalesGoodsList = _.get(this.props.salesReport,'SalesGoodsList')
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
            let index = _.findIndex(SalesGoodsList,item => item.ID == rowID)
            let obj = SalesGoodsList[index]
            return (
              <div key={rowID} style={{ padding: '0 15px' }}>
                <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                  <img style={{ height: '64px', marginRight: '15px' }} src={obj.IMAGES || noImg} alt="" />
                  <div style={{ lineHeight: 1,flex:1 }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.GOODS_NAME}</div>
                    <div style={{marginBottom: '8px',}}>价格：{obj.PRICE}</div>
                    <div style={{height:25,display:'flex',flexDirection:'row-reverse'}}>
                      <Button onClick={()=>this.addGoods(obj)} style={{height:25,width:25,textAlign:'center',paddingLeft:'0.5em',marginRight:'0.5em'}} icon="plus" />
                    </div>
                  </div>
                </div>
              </div>
            );
        };
 
        return (
            <div style={{height:'100%'}}>
                <NavBar
                    mode="dark"
                    leftContent={[
                        <Icon onClick={()=>router.goBack()} key="0" type="left" />,
                    ]}
                >选择商品
                </NavBar>
                <SearchBar placeholder="请输入搜索条件" />
                <div style={{height:'calc(100% - 89px)'}}>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                    {this.state.isLoading ? '数据加载中...' : '已加载所有数据'}
                    </div>)}
                    renderBodyComponent={() => <MyBody />}
                    renderRow={row}
                    renderSeparator={separator}
                    style={{
                    height: '100%',
                    overflow: 'auto',
                    }}
                    pageSize={4}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                />
                </div>
            </div>
        )
    }
}