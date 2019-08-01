import React from 'react'
import ProvincesData from '@/utils/ProvincesData'
import { Picker, List, WhiteSpace } from 'antd-mobile';
import arrayTreeFilter from 'array-tree-filter';

export default class AddressCom extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            visible:false,
            pickerValue:null , //选择的地址
        }
    }
    getSel() {
        const value = this.state.pickerValue;
        if (!value) {
          return '';
        }
        const treeChildren = arrayTreeFilter(ProvincesData, (c, level) => c.value === value[level]);
        return treeChildren.map(v => v.label).join(',');
    }
    render(){
        return (
            <div>
                <Picker
                visible={this.state.visible}
                data={ProvincesData}
                value={this.state.pickerValue}
                onChange={v => {this.props.addressChange(v),this.setState({ pickerValue: v })}}
                onOk={() => this.setState({ visible: false })}
                onDismiss={() => this.setState({ visible: false })}
                >
                <List.Item extra={this.getSel()} onClick={() => this.setState({ visible: true })}>
                    <span style={{color:'#bbbbbb'}}>请选择地址</span>
                </List.Item>
                </Picker>
            </div>
        )
    }
}