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
  ];
  const NUM_SECTIONS = 5;
  const NUM_ROWS_PER_SECTION = 5;
  let pageIndex = 0;
  
  const dataBlobs = {};
  let sectionIDs = [];
  let rowIDs = [];
  function genData(pIndex = 0) {
    for (let i = 0; i < NUM_SECTIONS; i++) {
      const ii = (pIndex * NUM_SECTIONS) + i;
      const sectionName = `Section ${ii}`;
      sectionIDs.push(sectionName);
      dataBlobs[sectionName] = sectionName;
      rowIDs[ii] = [];
  
      for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
        const rowName = `S${ii}, R${jj}`;
        rowIDs[ii].push(rowName);
        dataBlobs[rowName] = rowName;
      }
    }
    sectionIDs = [...sectionIDs];
    rowIDs = [...rowIDs];
}
  

@connect(({ salesReport, loading }) => ({
    salesReport,
}))
export default class GoodsList extends React.Component{
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
          genData();
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
          genData(++pageIndex);
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
              <div key={rowID} style={{padding:'0 10px'}}>
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
            <div style={{height:'100%'}}>
                <NavBar
                    mode="dark"
                    leftContent={[
                        <Icon onClick={()=>router.goBack()} key="0" type="left" />,
                    ]}
                >商品清单
                </NavBar>
                <div style={{height:'calc(100% - 85px)'}}>
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}
                        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            <Button type='primary'>添加商品</Button>
                        </div>)}
                        renderBodyComponent={() => <MyBody />}
                        renderRow={row}
                        renderSeparator={separator}
                        style={{
                        height: '100%',
                        overflow: 'auto',
                        }}
                        pageSize={4}
                        onScroll={() => { console.log('scroll'); }} 
                        scrollRenderAheadDistance={500}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={10}
                    />
                </div>
                <div style={{borderTop:'1px solid lightgray',borderBottom:'1px solid lightgray',height:40,display:'flex',flexDirection:'row-reverse'}}>
                    <div onClick={()=> router.push('/salesReportAddCustomer')} style={{height:40,lineHeight:'40px',width:'30%',textAlign:'center',background:'#bf6b69'}}>下一步</div>
                    <div style={{height:40,lineHeight:'40px',marginRight:'10px'}}>合计：13890.00</div>
                </div>
            </div>
        )
    }
}