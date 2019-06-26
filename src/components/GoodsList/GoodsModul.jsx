import { ListView, List, Checkbox, Stepper, PullToRefresh, } from 'antd-mobile';
import { Input, Icon, Button } from 'antd'
import ReactDOM from 'react-dom';
import { connect } from 'dva'
import React from 'react'
import _ from 'lodash'
import router from 'umi/router';
import noImg from '@/assets/noImg.svg'
// import styles from './Index.less'

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

function genData(pIndex = 1, list) {
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

@connect(({ shoppingCart,goodsList }) => ({
    shoppingCart,
    goodsList,
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
            show: false,
            pageIndex: 1,
            height: document.documentElement.clientHeight * 3 / 4,
            cart: [],
            value: [],
            isEnd: false,
            stepper: {}, //用于存储步进器的数值
        };
    }

    componentDidMount() {
        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        let list = this.props.goodsList.goodsData
        // simulate initial Ajax
        setTimeout(() => {
            genData(0, list);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                isLoading: false,
                height: hei,
            });
        }, 1000);
    }

    // 进入详情页
    getDetailsPage = (rowID) => {
        const { dispatch } = this.props;
        const { SelectedData } = this.props.shoppingCart;
        const customerId = localStorage.getItem('customerId')
        dispatch({
            type: 'goodsData/confirmOrder',
            payload: { list: SelectedData, customerId },
            callback: response => {
                if (response.status === 'success') {
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

    onChange = (value) => {
        const { goodsData: { menuData } } = this.props;
        let label = '';
        menuData.forEach((dataItem) => {
          if (dataItem.value === value[0]) {
            label = dataItem.label;
            if (dataItem.children && value[1]) {
              dataItem.children.forEach((cItem) => {
                if (cItem.value === value[1]) {
                  label += ` ${cItem.label}`;
                }
              });
            }
          }
        });
        this.setState({
          pageIndex: 1,
          value,
          isLoading: true,
        }, () => {
          dataBlobs = {};
          sectionIDs = [];
          rowIDs = [];
          this.getGoodsList()
        })
      }

    // 获取商品列表
  getGoodsList = (refresh = false) => {
    const { dispatch } = this.props;
    const { pageIndex, value } = this.state
    const customerId = localStorage.getItem('customerId') * 1;
    const userId = localStorage.getItem('userId') * 1;
    if (refresh) {
      setTimeout(() => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
          refreshing: false,
        });
      }, 1000);
      return
    }
    dispatch({
      type: 'goodsData/getGoodsList',
      payload: { customerId, userId, pageSize: 10, category: value[1] ? value[1] : null, currentPage: pageIndex },
      callback: response => {
        if (response.status === 'success') {
          const { data: { list } } = response;
          setTimeout(() => {
            genData(pageIndex, list);
            this.setState({
              dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
              isLoading: false,
              pageIndex: pageIndex + 1,
              show: false,
              refreshing: false,
              isEnd: list.length < 10 ? true : false,
            });
          }, 1000);
        } else {
          this.setState({
            isLoading: false,
            refreshing: false,
          })
        }

      }
    })
  }

    stepperChange = (val, obj) => {
        const { cart } = this.state;
        const idx = _.findIndex(cart, item => item.ID === obj.ID)
        if (idx > -1) {
          if (val === 0) {
            _.remove(cart, c => c.ID === obj.ID)
            this.setState({
              cart
            })
          } else {
            cart[idx].number = val
            this.setState({
              cart
            })
          }
    
        } else {
          obj.number = val;
          cart.push(obj);
          this.setState({
            cart
          })
        }
        this.props.dispatch({ type: 'shoppingCart/save', payload: { goodsLists: cart } })
      }

    render() {
        let { SelectedData, TotalAmount, TotalNumber, allSelect } = this.props.shoppingCart
        let goodsLists = this.props.goodsList.goodsData
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
            const obj = goodsLists[index];
            return (
                <div key={rowID} style={{ padding: '0 10px' }}>
                    <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                        <img style={{ height: '80px', marginRight: '15px' }} src={obj.img || noImg} alt="" />
                        <div style={{ lineHeight: 1, width: 'calc(100% - 95px)' }}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold', textAlign: 'left' }}>{obj.GOODS_NAME}</div>
                            <div style={{ marginBottom: '8px', textAlign: 'left' }}>{obj.des}</div>
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ color: 'red', textAlign: 'left', float: 'left' }}>{obj.PRICE}</div>
                                <div><Stepper
                                    style={{ minWidth: '100px', backgroundColor: 'white', float: 'right' }}
                                    showNumber
                                    max={999999}
                                    min={0}
                                    step={1}
                                    defaultValue={index > -1 ? goodsLists[index].number : 0}
                                    onChange={(e, f) => {
                                        if (e > this.state.stepper[rowID] || !this.state.stepper[rowID]) {
                                        this.props.getStart(rowID, this._circle)
                                        }
                                        let stepper = this.state.stepper
                                        stepper[rowID] = e
                                        this.setState({
                                        stepper
                                        })
                                        this.stepperChange(e, obj)
                                    }}
                                />
                                    <span id={rowID} ref={r => this._circle = r} style={{ display: 'none', zIndex: 1000, position: 'absolute', right: '20px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'red' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
            </div>
        );
    }
}

