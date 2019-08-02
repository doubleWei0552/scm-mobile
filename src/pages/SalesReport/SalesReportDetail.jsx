import React from 'react'
import { NavBar, Icon,ListView,Button,List, Stepper } from 'antd-mobile'
import {connect} from 'dva'
import ReactDOM from 'react-dom'
import router from 'umi/router'
import moment from 'moment'
import noImg from '@/assets/noImg.svg'
import { thisExpression } from '@babel/types';

function MyBody(props) {
    return (
      <div className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
  }

  const dataBlobs = {};
  let sectionIDs = [];
  let rowIDs = [];
  function genData(pIndex = 0,list) {
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
}
  

@connect(({ salesReport, loading }) => ({
    salesReport,
}))
export default class SalesReportDetail extends React.Component{
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
          ModifyData:[],  //被修改的数据，即将提交数组
          data:[], //展示的商品数据
        };
      }
    
      componentDidMount() {
        let data = _.get(this.props.salesReport,'OrderSelectData.Child')
        this.setState({
          data
        })
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        // simulate initial Ajax
        setTimeout(() => {
          genData(0,data);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            isLoading: false,
            height: hei,
          });
        }, 1000);
      }
    
    //   步进器改变方法
      onStepperChange=(e,value)=>{
        let {ModifyData,data} = this.state
        let dataIndex = _.findIndex(data,item => item.ID == value.ID)
        let index = _.findIndex(ModifyData,item => item.ID == value.ID)
        if(index < 0){
          value.PRODUCTION_AMOUNT = e
          value.PRODUCTION_TOTAL_PRICE = value.PRODUCTION_PRICE * e
          ModifyData.push(value)
        } else {
          ModifyData[index].PRODUCTION_AMOUNT = e
          data[dataIndex].PRODUCTION_TOTAL_PRICE = value.PRODUCTION_PRICE * e
        }
        this.setState({
          ModifyData,
          data,
        })
      }
    // 提交按钮
    submit=()=>{
      let {ModifyData} = this.state
      this.props.dispatch({
        type:'salesReport/getOrdersUpdate',
        payload:{ModifyData}
      })
    }
    render(){
        const {OrderSelectData} = this.props.salesReport
        let {data} = this.state
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
            let index = _.findIndex(data,item => item.ID == rowID)
            const obj = data[index];
            return (
              <div key={rowID} style={{padding:'0 10px'}}>
                <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                  <img style={{ height: '64px', marginRight: '15px' }} src={obj.img || noImg} alt="error" />
                  <div style={{ lineHeight: 1,width:'100%' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.PRODUCTION_NAME}</div>
                    <div style={{ width:'100%',display:'flex',justifyContent:'space-between'}}>
                        <div>
                            <div style={{ marginBottom: '8px',fontSize:'0.8rem' }}>单价：{obj.PRODUCTION_PRICE}</div>
                            <div style={{ marginBottom: '8px',fontSize:'0.8rem' }}>金额：{obj.PRODUCTION_TOTAL_PRICE || 0}</div>
                        </div>
                        <div>
                            <Stepper
                                style={{ width: '100%', minWidth: '100px' }}
                                showNumber
                                min={1}
                                defaultValue={obj.PRODUCTION_AMOUNT}
                                onChange={(e)=>this.onStepperChange(e,obj)}
                            />
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          };
        return(
            <div>
                <NavBar
                    mode="dark"
                    leftContent={[
                        <Icon onClick={()=>router.goBack()} key="0" type="left" />,
                    ]}
                >销售提报详情
                </NavBar>
                <div style={{padding:'15px 15px 0 15px'}}>
                    <div>
                      <h3>{OrderSelectData.SIGN_FOR_CUSTOMER}</h3>
                      <p>{moment(OrderSelectData.DOCUMENT_DATE).format('YYYY年MM月DD日 hh:mm:ss')}</p>
                      <p>{OrderSelectData.SIGNER}（{OrderSelectData.TELEPHONE}）</p>
                      <p>{OrderSelectData.NATION}{OrderSelectData.PROVINCE}{OrderSelectData.CITY}{OrderSelectData.ADDRESS}</p>
                    </div>
                    <div>
                      <ListView
                          ref={el => this.lv = el}
                          dataSource={this.state.dataSource}
                          renderFooter={() => (<div style={{ textAlign: 'center' }}>
                          {this.state.isLoading ? '数据加载中...' : '数据加载完成'}
                          </div>)}
                          renderBodyComponent={() => <MyBody />}
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
                </div>
                <div style={{width:'100%',height:'50px',bottom:0,position:'absolute',background:'white',padding:'5px 3% 0 3%',borderTop:'1px solid #f5f5f9'}}>
                        <Button style={{width:'45%',height:'40px',lineHeight:'40px',float:'left'}} type="warning">关闭</Button>
                        <Button onClick={this.submit} style={{width:'45%',height:'40px',lineHeight:'40px',float:'right'}} type="primary">提交</Button>
                </div>
            </div>
        )
    }
}

