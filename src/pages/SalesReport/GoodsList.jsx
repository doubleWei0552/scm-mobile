import React from 'react'
import { NavBar, Icon,ListView,Button,List, Stepper } from 'antd-mobile'
import {connect} from 'dva'
import ReactDOM from 'react-dom'
import router from 'umi/router'
import noImg from '@/assets/noImg.svg'

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
  function genData(pIndex = 0,list=[]) {
      const sectionName = `Section ${pIndex}`;
      if(!sectionIDs.includes(sectionName)){
        sectionIDs.push(sectionName);
        dataBlobs[sectionName] = sectionName;
      }
      rowIDs[pIndex] = [];
  
      for (let jj = 0; jj < list.length; jj++) {
        const rowName = `S${pIndex}, R${jj}`;
        rowIDs[pIndex].push(list[jj].ID);
        dataBlobs[list[jj].ID] = list[jj].ID;
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
          TotalAmount:0,  //提交时显示的总金额
        };
      }
    
      componentWillMount=()=>{
        this.getTotalAmount()
      }
      componentDidMount() {
        let TotalAmount = _.get(this.state,'TotalAmount')
        let {SalesAllSelectGoods} = this.props.salesReport
        console.log('选择的所有数据',SalesAllSelectGoods,TotalAmount)
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        // simulate initial Ajax
        setTimeout(() => {
          genData(0,SalesAllSelectGoods);
          this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
            isLoading: false,
            height: hei,
            TotalAmount,
          });
        }, 600);
      }
    getTotalAmount = ()=>{
      console.log('统计总额')
      let {SalesAllSelectGoods} = this.props.salesReport
      let TotalAmount = 0
      SalesAllSelectGoods.map(item => {
        if(item.setNum && item.setPrice){
          TotalAmount = TotalAmount + (item.setNum * item.setPrice)
        } else {
          TotalAmount = TotalAmount + 0
        }
      })
      this.setState({
        TotalAmount
      })
    }
    //   步进器改变方法
    onStepperChange=(e,value)=>{
      console.log(e,value)
      let {SalesAllSelectGoods} = this.props.salesReport
      let index = _.findIndex(SalesAllSelectGoods,item => item.ID == value.ID)
      SalesAllSelectGoods[index].setNum = e
      this.props.dispatch({
        type:'salesReport/save',
        payload:{ SalesAllSelectGoods }
      })
      this.getTotalAmount()
    }
    render(){
      let {SalesAllSelectGoods} = this.props.salesReport
      let {TotalAmount} = this.state
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
            let index = _.findIndex(SalesAllSelectGoods,item => item.ID == rowID)
            const obj = SalesAllSelectGoods[index];
            return (
              <div key={rowID} style={{padding:'0 10px'}}>
                <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                  <img style={{ height: '64px', marginRight: '15px' }} src={obj.img || noImg} alt="error" />
                  <div style={{ lineHeight: 1,width:'100%' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>{obj.GOODS_NAME}</div>
                    <div style={{ width:'100%',display:'flex',justifyContent:'space-between'}}>
                        <div>
                            <div style={{ marginBottom: '8px',fontSize:'0.8rem' }}>单价：{obj.setPrice}</div>
                            <div style={{ marginBottom: '8px',fontSize:'0.8rem' }}>金额：{obj.setPrice * obj.setNum || 0}</div>
                        </div>
                        <div>
                            <Stepper
                                style={{ width: '100%', minWidth: '100px' }}
                                showNumber
                                min={1}
                                value={obj.setNum}
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
                            <Button onClick={()=>router.push('/salesReportAddGoods')} type='primary'>添加商品</Button>
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
                    />
                </div>
                <div style={{borderTop:'1px solid lightgray',height:40,display:'flex',flexDirection:'row-reverse'}}>
                    <div onClick={()=> router.push('/salesReportAddCustomer')} style={{height:40,lineHeight:'40px',width:'30%',textAlign:'center',background:'#bf6b69'}}>下一步</div>
                    <div style={{height:40,lineHeight:'40px',marginRight:'10px'}}>合计：{TotalAmount}</div>
                </div>
            </div>
        )
    }
}