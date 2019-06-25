import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import _ from 'lodash';
import ReactDom from 'react-dom';
import { Menu, ActivityIndicator, NavBar, Icon, ListView, Stepper, PullToRefresh, Badge, Modal, List, Button, Toast } from 'antd-mobile';
import router from 'umi/router';
import Style from './style.less';

let dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 1, list = []) {
  const sectionName = `Section ${pIndex}`;
  const idx = _.findIndex(sectionIDs, item => item === sectionName)
  if (idx > -1) {
    return
  }
  sectionIDs.push(sectionName);
  dataBlobs[sectionName] = sectionName;
  rowIDs[pIndex - 1] = [];
  _.map(list, (item, i) => {
    rowIDs[pIndex - 1].push(item.ID);
    dataBlobs[item.ID] = item.ID;
  })
  sectionIDs = [...sectionIDs];
  rowIDs = [...rowIDs];
}


@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
class GoodsListPage extends Component {
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
      modal2: false,
      value: [],
    };
  }

  componentDidMount() {
    // you can scroll to the specified position
    // setTimeout(() => this.lv.scrollTo(0, 120), 800);

    const { goods: { menuData, list } } = this.props;
    const { pageIndex } = this.state;

    const hei = document.documentElement.clientHeight - ReactDom.findDOMNode(this.lv).parentNode.offsetTop;
    // simulate initial Ajax
    this.getTypeList();
    this.getGoodsList();
    setTimeout(() => {
      // genData(pageIndex, list );
      this.setState({
        // dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
        height: hei,
      });
    }, 600);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(nextProps.dataSource),
      });
    }
  }

  getTypeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/getTypeList',
      payload: {},
      callback: response => {

        if (response.status === 'success') {
          const value = [_.get(response, 'data[0].ID'), _.get(response, 'data[0].childCategory[0].ID')];
          this.setState({
            value,
          })
        }
      }
    })
  }

  // 获取商品列表
  getGoodsList = (refresh = false) => {
    const { dispatch } = this.props;
    const { pageIndex, value } = this.state
    const customerId = localStorage.getItem('userId') * 1;
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
      type: 'goods/getGoodsList',
      payload: { customerId, category: value[1] ? value[1] : null, currentPage: pageIndex },
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
            });
          }, 1000);
        } else {
          this.setState({
            isLoading: false,
            refreshing: false,
            // show: false,
          })
        }

      }
    })
  }


  onChange = (value) => {
    const { goods: { menuData } } = this.props;
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

  handleClick = (e) => {
    e.preventDefault(); // Fix event propagation on Android
    this.setState({
      show: !this.state.show,
    });

  }

  goBack = () => {
    window.history.back()
  }

  onMaskClick = () => {
    this.setState({
      show: false,
    });
  }

  onClose = () => {
    this.setState({
      modal2: false,
    });
  }

  // 确认下单
  confirmOrder = () => {
    const { dispatch } = this.props;
    const { cart } = this.state;
    dispatch({
      type: 'goods/confirmOrder',
      payload: { list: cart },
      callback: response => {
        if (response.status === 'success') {
          this.setState({
            modal2: false,
          })

          router.push(`/orderdetail/${response.data}`)
        }
      }
    })
  }

  showModal = () => {
    this.setState({
      modal2: true,
    });
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    const { pageIndex } = this.state;
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({ isLoading: true, pageIndex }, () => {
      this.getGoodsList();
    });
    // setTimeout(() => {
    //   genData(pageIndex+1);
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
    //     isLoading: false,
    //     pageIndex: pageIndex+1,
    //   });
    // }, 1000);
  }

  onRefresh = () => {

    this.setState({ refreshing: true, }, () => {

      this.getGoodsList(true)
    });
    // simulate initial Ajax
    // window.location.reload()
  };

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

  }

  render() {
    const { goods: { menuData, list } } = this.props;
    const { initData, show, dataSource, cart, value, isLoading } = this.state;

    _.map(menuData, item => {
      item.value = item.ID;
      item.label = item.NAME;
      item.children = item.childCategory;
      if (item.childCategory.length) {
        _.map(item.children, child => {
          child.label = child.NAME;
          child.value = child.ID;
        })
      }
    })
    let cartNum = 0;
    let totalPrice = 0;
    _.map(cart, item => {
      cartNum += item.number;
      totalPrice += (item.PRICE || 0) * (item.number || 1);
    })
    const menuEl = (
      <Menu
        className="foo-menu"
        data={menuData}
        value={value}
        onChange={this.onChange}
        level={2}
        height={document.documentElement.clientHeight * 0.6}
      />
    );
    const loadingEl = (
      <div style={{ width: '100%', height: document.documentElement.clientHeight * 0.6, display: 'flex', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </div>
    );

    const separator = (sectionID, rowID) => (
      <div
        key={rowID}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const row = (rowData, sectionID, rowID) => {
      const index = _.findIndex(list, item => item.ID === rowData)
      let obj = {}
      if (index > -1) {
        obj = list[index];
      }

      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div
            style={{
              lineHeight: '43px',
              color: 'rgba(0,0,0,0.8)',
              fontSize: 18,
              fontWeight: 500,
              borderBottom: '1px solid #F6F6F6',
              textAlign: 'left',
            }}
          >{_.get(obj, 'GOODS_NAME')}
          </div>
          <div style={{ display: '-webkit-box', display: 'flex', padding: '5px 0' }}>
            <img style={{ height: '64px', marginRight: '15px' }} src={_.get(obj, 'img') || 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png'} alt="" />
            <div style={{ lineHeight: 1, flex: 1 }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold', textAlign: 'left' }}>{_.get(obj, 'des', '我是商品描述')}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '30px', color: '#FF6E27' }}><span style={{ fontSize: 18, color: 'rgba(0,0,0,0.65)' }}>价格：</span>{_.get(obj, 'PRICE')}</div>
                <Stepper
                  style={{ minWidth: '100px' }}
                  showNumber
                  max={10}
                  min={0}
                  step={1}
                  defaultValue={0}
                  onChange={(e) => this.stepperChange(e, obj)}
                />
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div ref={el => this.content = el} className={show ? Style.menuactive : Style.goodsPage}>
        <ActivityIndicator
          toast
          text="Loading..."
          animating={isLoading}
        />
        <div style={{ position: 'fixed', top: 0, zIndex: 10, width: '100%' }}>
          <NavBar
            // leftContent="Menu"
            icon={<Icon type="left" size='lg' />}
            onLeftClick={this.goBack}
            rightContent={[
              <Icon onClick={this.handleClick} key="1" type="ellipsis" />,
            ]}
            className="top-nav-bar"
          >
            商品列表
          </NavBar>
        </div>
        {show ? menuData ? menuEl : loadingEl : null}
        {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}

        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource}
          renderRow={row}
          renderSeparator={separator}
          style={{
            height: show ? document.documentElement.clientHeight - 140 : document.documentElement.clientHeight - 95,
            overflow: 'auto',
            top: 45,
          }}
          pageSize={4}
          // onScroll={() => { console.log('scroll'); }}
          scrollRenderAheadDistance={400}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
          pullToRefresh={<PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
        // renderScrollComponent={()=> this.content}
        />

        <div className="animated fadeIn" style={{ position: 'fixed', bottom: 0, zIndex: 10, width: '100%', display: cart.length > 0 ? 'block' : 'none' }}>
          <NavBar
            // leftContent="Menu"

            mode="light"
            icon={<Badge text={cartNum} style={{ marginLeft: 12 }}>购物车</Badge>}
            onLeftClick={this.showModal}
            rightContent={[
              <span key={3} onClick={this.showModal}>
                立即下单
              </span>,
            ]}
          // className="top-nav-bar"
          />
        </div>
        <Modal
          popup
          className='goodsModal'
          visible={this.state.modal2}
          onClose={this.onClose}
          animationType="slide-up"
          style={{
            height: document.documentElement.clientHeight * 0.6,
          }}
        >
          <div className='title'>购物车</div>
          <List style={{ height: document.documentElement.clientHeight * 0.6 - 113, overflow: 'auto' }} className="popup-list">
            {cart.map((i, index) => (
              <List.Item key={i.id} style={{ display: 'flex' }}>
                <img style={{ height: '64px', width: '64px', marginRight: '15px' }} src={_.get(i, 'img') || 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png'} alt="" />
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', lineHeight: '24px', textAlign: 'left' }}>{_.get(i, 'GOODS_NAME')} </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '16px', color: '#FF6E27', textAlign: 'left' }}><span style={{ fontSize: 16, color: 'rgba(0,0,0,0.65)' }}>价格：</span>{_.get(i, 'PRICE')}</div>

                    <Stepper
                      style={{ minWidth: '100px' }}
                      showNumber
                      max={10}
                      min={0}
                      step={1}
                      defaultValue={i.number}
                      onChange={(e) => this.stepperChange(e, i)}
                    />
                  </div>

                </div>
              </List.Item>
            ))}
            <List.Item>
              <div style={{ lineHeight: '36px' }}>共<span>{cart.length}</span>种，<span>{cartNum}</span>件</div>
              <div style={{ flex: '1', textAlign: 'right', }}>总价：<span style={{ color: '#FF6E27', fontSize: 24 }}>{totalPrice}</span></div>
            </List.Item>
          </List>
          <Button style={{ width: '95%', margin: '0 auto', top: '12px' }} type="primary" onClick={this.confirmOrder}>确认下单</Button>
        </Modal>
      </div>
    );
  }
}

export default GoodsListPage;
