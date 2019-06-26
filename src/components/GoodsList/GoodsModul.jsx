// import { ListView, Stepper, PullToRefresh } from 'antd-mobile';
// import ReactDOM from 'react-dom'
// import { callbackify } from 'util';

// function MyBody(props) {
//     return (
//         <div className="am-list-body my-body">
//             <span style={{ display: 'none' }}>you can custom body wrap element</span>
//             {props.children}
//         </div>
//     );
// }

// const data = [
//     {
//         img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
//         title: 'Meet hotel',
//         des: '不是所有的兼职汪都需要风吹日晒',
//     },
//     {
//         img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
//         title: 'McDonald\'s invites you',
//         des: '不是所有的兼职汪都需要风吹日晒',
//     },
//     {
//         img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
//         title: 'Eat the week',
//         des: '不是所有的兼职汪都需要风吹日晒',
//     },
// ];
// const NUM_SECTIONS = 5;
// const NUM_ROWS_PER_SECTION = 5;
// let pageIndex = 0;

// const dataBlobs = {};
// let sectionIDs = [];
// let rowIDs = [];
// function genData(pIndex = 0) {
//     for (let i = 0; i < NUM_SECTIONS; i++) {
//         const ii = (pIndex * NUM_SECTIONS) + i;
//         const sectionName = `Section ${ii}`;
//         sectionIDs.push(sectionName);
//         dataBlobs[sectionName] = sectionName;
//         rowIDs[ii] = [];

//         for (let jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
//             const rowName = `S${ii}, R${jj}`;
//             rowIDs[ii].push(rowName);
//             dataBlobs[rowName] = rowName;
//         }
//     }
//     sectionIDs = [...sectionIDs];
//     rowIDs = [...rowIDs];
// }

// export default class GoodsModul extends React.Component {
//     constructor(props) {
//         super(props);
//         const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
//         const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

//         const dataSource = new ListView.DataSource({
//             getRowData,
//             getSectionHeaderData: getSectionData,
//             rowHasChanged: (row1, row2) => row1 !== row2,
//             sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
//         });

//         this.state = {
//             dataSource,
//             isLoading: true,
//             height: document.documentElement.clientHeight * 3 / 4,
//         };
//     }

//     componentDidMount() {
//         // you can scroll to the specified position
//         // setTimeout(() => this.lv.scrollTo(0, 120), 800);

//         const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
//         // simulate initial Ajax
//         setTimeout(() => {
//             genData();
//             this.setState({
//                 dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
//                 isLoading: false,
//                 height: hei,
//             });
//         }, 600);
//     }

//     // If you use redux, the data maybe at props, you need use `componentWillReceiveProps`
//     // componentWillReceiveProps(nextProps) {
//     //   if (nextProps.dataSource !== this.props.dataSource) {
//     //     this.setState({
//     //       dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
//     //     });
//     //   }
//     // }

//     onEndReached = (event) => {
//         // load new data
//         // hasMore: from backend data, indicates whether it is the last page, here is false
//         if (this.state.isLoading && !this.state.hasMore) {
//             return;
//         }
//         console.log('reach end', event);
//         this.setState({ isLoading: true });
//         setTimeout(() => {
//             genData(++pageIndex);
//             this.setState({
//                 dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
//                 isLoading: false,
//             });
//         }, 1000);
//     }

//     render() {
//         const separator = (sectionID, rowID) => (
//             <div
//                 key={`${sectionID}-${rowID}`}
//                 style={{
//                     backgroundColor: '#F5F5F9',
//                     height: 8,
//                     borderTop: '1px solid #ECECED',
//                     borderBottom: '1px solid #ECECED',
//                 }}
//             />
//         );
//         let index = data.length - 1;
//         const row = (rowData, sectionID, rowID) => {
//             if (index < 0) {
//                 index = data.length - 1;
//             }
//             const obj = data[index--];
//             return (
//                 <div key={rowID} style={{ padding: '0 10px' }}>
//                     <div style={{ display: '-webkit-box', display: 'flex', padding: '15px 0' }}>
//                         <img style={{ height: '80px', marginRight: '15px' }} src={obj.img} alt="" />
//                         <div style={{ lineHeight: 1, width: 'calc(100% - 95px)' }}>
//                             <div style={{ marginBottom: '8px', fontWeight: 'bold', textAlign: 'left' }}>{obj.title}</div>
//                             <div style={{ marginBottom: '8px', textAlign: 'left' }}>{obj.des}</div>
//                             <div style={{ overflow: 'hidden' }}>
//                                 <div style={{ color: 'red', textAlign: 'left', float: 'left' }}>¥ 35</div>
//                                 <div><Stepper
//                                     style={{ minWidth: '100px', backgroundColor: 'white', float: 'right' }}
//                                     showNumber
//                                     max={999999}
//                                     min={0}
//                                     step={1}
//                                     defaultValue={0}
//                                 /></div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             );
//         };

//         return (
//             <ListView
//                 ref={el => this.lv = el}
//                 dataSource={this.state.dataSource}
//                 renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
//                     {this.state.isLoading ? '加载中...' : '已加载所有数据！'}
//                 </div>)}
//                 renderBodyComponent={() => <MyBody />}
//                 renderRow={row}
//                 renderSeparator={separator}
//                 style={{
//                     height: this.state.height,
//                     overflow: 'auto',
//                 }}
//                 pageSize={4}
//                 onScroll={() => { console.log('scroll'); }}
//                 scrollRenderAheadDistance={500}
//                 onEndReached={this.onEndReached}
//                 onEndReachedThreshold={10}
//                 pullToRefresh={<PullToRefresh  //下拉刷新
//                     onRefresh={() => console.log('假装在刷新页面！')}
//                 />}
//             />
//         );
//     }
// }











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
            height: document.documentElement.clientHeight * 3 / 4,
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

    stepperChange = (e, obj) => {
        this.props.dispatch({ type: 'shoppingCart/changeGoodsNumber', payload: { value: e, obj } })
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
                        <img style={{ height: '80px', marginRight: '15px' }} src={obj.img} alt="" />
                        <div style={{ lineHeight: 1, width: 'calc(100% - 95px)' }}>
                            <div style={{ marginBottom: '8px', fontWeight: 'bold', textAlign: 'left' }}>{obj.title}</div>
                            <div style={{ marginBottom: '8px', textAlign: 'left' }}>{obj.des}</div>
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ color: 'red', textAlign: 'left', float: 'left' }}>¥ 35</div>
                                <div><Stepper
                                    style={{ minWidth: '100px', backgroundColor: 'white', float: 'right' }}
                                    showNumber
                                    max={999999}
                                    min={0}
                                    step={1}
                                    defaultValue={0}
                                /></div>
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

