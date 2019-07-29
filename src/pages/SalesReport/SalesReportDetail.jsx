import React from 'react'
import { NavBar, Icon,ListView,Button,List, Stepper } from 'antd-mobile'
import {connect} from 'dva'
import ReactDOM from 'react-dom'
import router from 'umi/router'

function MyBody(props) {
    return (
      <div className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
  }
  
  const data = [
    {
      img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
      title: '表头1',
      des: '见风使舵',
    },
    {
      img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
      title: 'McDonald\'s invites you',
      des: '反对封',
    },
    {
      img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
      title: 'Eat the week',
      des: '可根据',
    },
    {
      img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
      title: 'McDonald\'s invites you',
      des: '反对封',
    },
    {
      img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
      title: 'Eat the week',
      des: '可根据',
    },
  ];
  const NUM_SECTIONS = 5;
  const NUM_ROWS_PER_SECTION = 5;
  let pageIndex = 0;
  
  const dataBlobs = {};
  let sectionIDs = [];
  let rowIDs = [];
  function genData(pIndex = 0,list=[]) {
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
        };
      }
    
      componentDidMount() {
        const {dispatch,match} = this.props
        let orderId = _.get(match, 'params.orderId')
    
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        // simulate initial Ajax
        setTimeout(() => {
          genData(0,data);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            isLoading: false,
            height: hei,
          });
        }, 600);
      }
    
      onEndReached = (event) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if (this.state.isLoading && !this.state.hasMore) {
          return;
        }
        console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
          // genData(++pageIndex);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            isLoading: false,
          });
        }, 1000);
      }
    //   步进器改变方法
      onStepperChange=()=>{

      }
    render(){
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
          const row = (rowData, sectionID, rowID) => {
            if (index < 0) {
              index = data.length - 1;
            }
            const obj = data[index--];
            return (
              <div key={rowID}>
                <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                  <img style={{ height: '64px', marginRight: '15px' }} src={obj.img} alt="" />
                  <div style={{ lineHeight: 1,width:'100%' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.title}</div>
                    <div style={{ marginBottom: '8px',fontSize:'0.8rem' }}>销售号：{obj.des}</div>
                    <div style={{ width:'100%',display:'flex',justifyContent:'space-between'}}>
                        <div>
                            <div style={{ marginBottom: '8px',fontSize:'0.8rem' }}>单价：{obj.des}</div>
                            <div style={{ marginBottom: '8px',fontSize:'0.8rem' }}>金额：{obj.des}</div>
                        </div>
                        <div>
                            <Stepper
                                style={{ width: '100%', minWidth: '100px' }}
                                showNumber
                                min={1}
                                // value={22}
                                onChange={this.onStepperChange}
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
                      <h3>南京一点科技</h3>
                      <p>2019年12月22日 09:00:40</p>
                      <p>李三（188 8888 8888）</p>
                      <p>江苏南京新街口1号一点大厦1808室</p>
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
                          onScroll={() => { console.log('scroll'); }}
                          scrollRenderAheadDistance={500}
                          onEndReached={this.onEndReached}
                          onEndReachedThreshold={10}
                      />
                    </div>
                </div>
                <div style={{width:'100%',height:'50px',bottom:0,position:'absolute',background:'white',padding:'5px 3% 0 3%',borderTop:'1px solid #f5f5f9'}}>
                        <Button style={{width:'45%',height:'40px',lineHeight:'40px',float:'left'}} type="warning">关闭</Button>
                        <Button style={{width:'45%',height:'40px',lineHeight:'40px',float:'right'}} type="primary">提交</Button>
                </div>
            </div>
        )
    }
}