import React from 'react'
import {connect} from 'dva'
import { Card, WhiteSpace } from 'antd-mobile'
import noImg from '@/assets/noImg.svg'

@connect(({ waterfallFlow }) => ({
    waterfallFlow,
  }))

export default class WaterfallFlow extends React.Component{
    componentDidMount=()=>{
        this.props.dispatch({
            type:'waterfallFlow/getShowData',
            payload: {
                CAR_MODEL: "",
                INSTALLATION_POSITION: "",
                MANUFACTURER: null,
                MODEL: null,
                QUERY: "",
                currentPage: 1,
                customerId: 1,
                pageSize: 10,
                userId: 1,
            }
        })
    }
    render(){
        let showData = _.get(this.props.waterfallFlow,'showData')
        return(
            <div style={{columnCount:2,columnGap:5,}}>
                {showData.map(item =>{
                    return (
                        <div style={{margin:'8px',height:'100%',overflow: 'auto',border:'1px solid lightgray',background:'#f1f3f4'}} key={item.ID}>
                            <img style={{width:'50%',margin:'5px auto'}} src={noImg}/>
                            <p style={{margin:'0'}}>{item.GOODS_NAME}</p>
                        </div>
                    )
                })}
            </div>
        )
    }
}