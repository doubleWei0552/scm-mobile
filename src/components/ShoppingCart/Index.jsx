import { ListView, List, Checkbox, Stepper, PullToRefresh, } from 'antd-mobile';
import { Input, Icon, Button } from 'antd'
import ReactDOM from 'react-dom';
import { connect } from 'dva'
import React from 'react'
import _ from 'lodash'
import router from 'umi/router';
import noImg from '@/assets/noImg.svg'
import styles from './Index.less'

const CheckboxItem = Checkbox.CheckboxItem;

function MyBody(props) {
  return (
    <div className="am-list-body my-body">
      <span style={{ display: 'none' }}>you can custom body wrap element</span>
      {props.children}
    </div>
  );
}
const NUM_SECTIONS = 5;
let pageIndex = 0;

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];

function genData(pIndex = 0, list) {
  const sectionName = `Section ${pIndex}`;
  const idx = _.findIndex(sectionIDs, item => item === sectionName)
  if (idx < 0) {
    sectionIDs.push(sectionName);
    dataBlobs[sectionName] = sectionName;
  }
  rowIDs[pIndex] = [];
  _.map(list, (item, i) => {
    rowIDs[pIndex].push(item.ID);
    dataBlobs[item.ID] = item.ID;
  })
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}

@connect(({ shoppingCart }) => ({
  shoppingCart
}))

// 这是带选择和全选版本的购物车
export default class ShoppingCart extends React.Component {
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
      loading: false,
    };
  }

  componentDidMount() {
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    let list = this.props.shoppingCart.goodsLists
    // simulate initial Ajax
    setTimeout(() => {
      genData(0, list);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
        height: hei,
      });
    }, 600);
  }

  // 复选框
  onChange = (val, obj) => {
    this.props.dispatch({ type: 'shoppingCart/selectGoods', payload: { obj } })
  }
  // 复选框全选
  onAllSelectChange = () => {
    let isAllSelect = this.props.shoppingCart.allSelect
    this.props.dispatch({ type: 'shoppingCart/onAllSelectChange', payload: { isAllSelect: !isAllSelect, } })
  }

  // 进入详情页
  getDetailsPage = (rowID) => {
    this.setState({
      loading: true
    })
    const { dispatch } = this.props;
    const { SelectedData } = this.props.shoppingCart;
    const customerId = localStorage.getItem('customerId')
    dispatch({
      type: 'goodsData/confirmOrder',
      payload: { list: SelectedData, customerId },
      callback: response => {
        if (response.status === 'success') {
          this.setState({
            loading: false
          })
          router.push(`/orderdetail/${response.data}`)
        }
      }
    })
  }

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

  stepperChange = (e, obj) => {
    this.props.dispatch({ type: 'shoppingCart/changeGoodsNumber', payload: { value: e, obj } })
  }

  render() {
    let { SelectedData, TotalAmount, TotalNumber, allSelect, goodsLists } = this.props.shoppingCart
    const separator = (sectionID, rowID) => {
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
    const row = (rowData, sectionID, rowID) => {
      const index = _.findIndex(goodsLists, item => item.ID === rowID)
      const checked = _.findIndex(SelectedData, item => item.ID === rowID)
      const obj = goodsLists[index];
      return (
        <List key={rowID} className={styles.ShoppingCart}>
          <CheckboxItem checked={allSelect ? true : checked > -1 ? true : false} onChange={() => this.onChange(rowID, obj)}>
            <div className={styles.GoodsItem}>
              <div className={styles.itemLeft}>
                <img className={styles.goodsImg} src={noImg} alt="error" />
              </div>
              <div className={styles.itemRight}>
                <div className={styles.goodsTitle}>
                  {obj.GOODS_NAME}
                </div>
                <div className={styles.goodsDes}>
                  {obj.GOODS_SPEC}
                </div>
                <div className={styles.goodsOther}>
                  <div className={styles.goodsPrice}>
                    ¥{obj.PRICE}
                  </div>
                  <div style={{ float: 'right' }}>
                    <Stepper
                      style={{ minWidth: '100px' }}
                      showNumber
                      min={0}
                      step={1}
                      defaultValue={obj.number}
                      onChange={(e) => this.stepperChange(e, obj)}
                    />
                  </div>

                </div>
              </div>
            </div>
          </CheckboxItem>
        </List>
      );
    };

    return (
      <div>
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
            height: this.state.height,
            overflow: 'auto',
          }}
          pageSize={4}
          onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
          pullToRefresh={<PullToRefresh  //下拉刷新
            onRefresh={() => console.log('假装在刷新页面！')}
          />}
        />
        {/* 商品选择框 */}
        <div className={styles.settlementBox}>
          <List>
            <CheckboxItem checked={allSelect} onChange={this.onAllSelectChange}>
              <div className={styles.selectBox}>
                <div className={styles.Amount}>
                  <span style={{ marginRight: '1rem' }}>全选</span>
                  <span>合计:¥{TotalAmount}</span>
                </div>
                <div className={styles.TotalButton}>
                  <Button disabled={TotalNumber > 0} loading={this.state.loading} className={styles.Button} onClick={() => this.getDetailsPage()} >提交订单({TotalNumber})</Button>
                </div>
              </div>
            </CheckboxItem>
          </List>
        </div>
      </div>
    );
  }
}

