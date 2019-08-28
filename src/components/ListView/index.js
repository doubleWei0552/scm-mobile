import React, { Component } from "react";
import {
  ListView,
  PullToRefresh
} from 'antd-mobile';
import _ from 'lodash';
import moment from 'moment'
import ReactDOM from 'react-dom';

const dataBlobs = {};
let sectionIDs = [];
let rowIDs = [];
function genData(pIndex = 0,list) {
    const sectionName = `Section ${pIndex}`;
    const idx = _.findIndex(sectionIDs, item => item === sectionName)
    if (idx > -1) {
        rowIDs[pIndex] = [];
        _.map(list, (item, i) => {
            rowIDs[pIndex].push(item.ID);
            dataBlobs[item.ID] = item.ID;
        })
        rowIDs = [...rowIDs];
    } else {
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
}

// 不分页长列表
export default class ListViews extends Component {
  constructor(props) {
    super(props)
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
    }
  }

  componentDidMount() {
    const { list } = this.props;
    genData(0, list);
    const hei = document.documentElement.clientHeight - ReactDOM.findDOMNode(this.lv).parentNode.offsetTop;
    // simulate initial Ajax
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlobs, sectionIDs, rowIDs),
        isLoading: false,
        height: hei,
      });
    }, 600);
  }

  render() {
    const { list: data } = this.props;
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
        <div onClick={() => this.props.onJump(obj)} key={rowID} style={{ padding: 0 }}>
          <div
            style={{
              lineHeight: '50px',
              color: '#888',
              fontSize: 14,
              borderBottom: '1px solid #F6F6F6',
              paddingLeft: 10,
            }}
          >
            {moment(obj.START_DATE).format('YYYY年MM月DD日 HH:mm')} - {moment(obj.END_DATE).format('YYYY年MM月DD日 HH:mm')}
          </div>
          <div style={{ padding: '0px 10px 10px' }}>
            <h2>{obj.SUBJECT}</h2>
            <h3>拜访{obj.CUSTOMER}{obj.CUSTOMER_CONTACT}</h3>
            <div>{obj.ADDRESS ? obj.ADDRESS : '--'}</div>
          </div>
        </div>
      );
    };

    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? '数据加载中...' : '已加载所有数据'}
          </div>)}
          renderRow={row}
          renderSeparator={separator}
          style={{
            height: this.state.height,
            overflow: 'auto',
          }}
          pageSize={5}
          scrollRenderAheadDistance={500}
          pullToRefresh={<PullToRefresh  //下拉刷新
            onRefresh={() => genData(0, this.props.list)}
          />}
        />
      </div>
    );
  }
}