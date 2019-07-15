import React from 'react'
import AMap from '@/components/MapModule/Index'
import {
    Table,
    Button,
    Form,
    Row,
    Card,
    Col,
    Input,
    message,
    Popconfirm,
    Divider,
    InputNumber,
    Select,
    DatePicker,
    Icon,
    Tabs,
    Tooltip,
    Radio,
    Checkbox,
  } from 'antd';

@Form.create()
export default class HomePage extends React.Component{
    render(){
        return(
            <div>
                我是首页
                <div style={{width:'500px'}}>
            <Form>
                <FormItem
                          label={
                            <span>
                              地址
                            </span>
                          }>
                          {getFieldDecorator('position', {
                            initialValue: '北京'
                          })(
                            <Input placeholder={'请输入地址'} />
                            )}
                </FormItem>
                <FormItem
                label={
                    <span>
                      经度
                    </span>
                  }>
                              {getFieldDecorator('longitude', {
                                initialValue: ''
                              })(
                                <Input />
                                )}
                          </FormItem>
                          <FormItem label={
                    <span>
                      维度
                    </span>
                  }>
                              {getFieldDecorator('latitude', {
                                initialValue: ''
                              })(
                                <Input/>
                                )}
                </FormItem>
                
                    {/* <AMap 
                        lng={''}
                        lat={''}
                        address={getFieldValue('position')}
                        getMapPoint={(point)=>{
                            setFieldsValue({
                                latitude: point.lat,
                                longitude: point.lng
                            });
                        }}
                        getMapAddress={(address)=>{
                            setFieldsValue({
                                position: address
                            });
                        }}
                    /> */}
                
            </Form>
            </div>
            </div>
        )
    }
}