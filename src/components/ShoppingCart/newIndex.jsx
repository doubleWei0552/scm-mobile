import { ListView, Stepper, Modal, WhiteSpace, WingBlank, Toast, PullToRefresh } from 'antd-mobile';
import { Button } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'dva'
import router from 'umi/router';
import noImg from '@/assets/noImg.svg'
import styles from './newIndex.less'

function MyBody(props) {
    return (
        <div className="am-list-body my-body">
            <span style={{ display: 'none' }}>you can custom body wrap element</span>
            {props.children}
        </div>
    );
}
const alert = Modal.alert
const NUM_SECTIONS = 5;
const NUM_ROWS_PER_SECTION = 10;
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
        };
    }

    componentDidMount() {
        // you can scroll to the specified position
        // setTimeout(() => this.lv.scrollTo(0, 120), 800);

        const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
        // simulate initial Ajax
        let list = this.props.shoppingCart.goodsLists
        setTimeout(() => {
            genData(0, list);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
                isLoading: false,
                height: hei,
            });
        }, 600);
        // 首次加载需要统计金额
        let { goodsLists } = this.props.shoppingCart
        let TotalAmount = 0
        let TotalNumber = 0
        goodsLists.map(item => {
            TotalAmount = TotalAmount + item.number * item.PRICE
            TotalNumber = TotalNumber + item.number * 1
        })
        this.props.dispatch({ type: 'shoppingCart/save', payload: { TotalAmount, TotalNumber } })
    }

    // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
    componentWillReceiveProps(nextProps) {
        let list = nextProps.shoppingCart.goodsLists
        setTimeout(() => {
            genData(0, list);
        }, 1000);
    }

    showAlert = (e, obj) => {
        const alertInstance = alert('警告', '商品数量为0时，将从购物车列表移除，是否继续？', [
            { text: '取消', onPress: () => null, style: 'default' },
            {
                text: '确定', onPress: () => {
                    this.props.dispatch({ type: 'shoppingCart/removeGoods', payload: { obj } })
                    this.props.dispatch({ type: 'shoppingCart/changeGoodsNumber', payload: { value: e, obj } })
                }
            },
        ]);
    };


    stepperChange = (e, obj) => {
        if (e == 0) {
            this.showAlert(e, obj)
        } else {
            this.props.dispatch({ type: 'shoppingCart/changeGoodsNumber', payload: { value: e, obj } })
        }
    }

    // 进入详情页
    getDetailsPage = (rowID) => {
        const { dispatch } = this.props;
        const { goodsLists } = this.props.shoppingCart;
        const customerId = localStorage.getItem('customerId')
        dispatch({
            type: 'goodsData/confirmOrder',
            payload: { list: goodsLists, customerId },
            callback: response => {
                if (response.status === 'success') {
                    router.push(`/orderdetail/${response.data}`)
                }
            }
        })
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

    render() {
        let { TotalAmount, TotalNumber, goodsLists } = this.props.shoppingCart
        const separator = (sectionID, rowID) => {
            const idx = _.findIndex(goodsLists, item => item.ID === rowID)
            if (idx < 0) {
                return null
            } else {
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
                );
            }

        }
        // let index = goodsLists.length - 1;
        const row = (rowData, sectionID, rowID) => {
            const index = _.findIndex(goodsLists, item => item.ID === rowID)
            const obj = goodsLists[index]
            if (index < 0) {
                return null
            } else {
                return (
                    <div key={rowID} style={{ padding: '0 10px' }}>
                        <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
                            <img style={{ height: '80px', marginRight: '15px' }} src={obj.url || noImg} alt="error" />
                            <div style={{ lineHeight: 1, width: 'calc(100% - 95px)' }}>
                                <div style={{ marginBottom: '8px', fontWeight: 'bold', textAlign: 'left' }}>{obj.GOODS_NAME}</div>
                                <div style={{ marginBottom: '8px', textAlign: 'left', color: 'gray' }}>{obj.GOODS_SPEC}</div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div style={{ color: 'red', textAlign: 'left', float: 'left' }}>¥{obj.PRICE}</div>
                                    <div><Stepper
                                        style={{ minWidth: '100px', backgroundColor: 'white', float: 'right' }}
                                        showNumber
                                        max={999999}
                                        min={0}
                                        step={1}
                                        value={obj.number}
                                        onChange={(e) => this.stepperChange(e, obj)}
                                    /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

        };

        return (
            <div style={{ height: '100%' }} className={styles.ShoppingCart}>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                        {this.state.isLoading ? '加载中...' : '已加载所有的数据'}
                    </div>)}
                    renderBodyComponent={() => <MyBody />}
                    renderRow={row}
                    renderSeparator={separator}
                    style={{
                        height: this.state.height - 45,
                        overflow: 'auto',
                        top: 0
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
                <div className={styles.settlementBox}>
                    <span className={styles.amount}>合计:¥{TotalAmount}</span>
                    <Button className={styles.Button} onClick={() => this.getDetailsPage()}>提交订单({TotalNumber})</Button>
                </div>
            </div>
        );
    }
}