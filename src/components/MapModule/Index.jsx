import React from 'react'
import PropTypes from 'prop-types'
import { Spin } from 'antd';
import axios from 'axios';
import $script from 'scriptjs'
// import styles from './AMap.less'
 
const googleMapSdk='https://maps.googleapis.com/maps/api/js?key=your key';
const gaodeMapSdk='https://webapi.amap.com/maps?v=1.4.2&key=your key';
 
let map = null;
let marker = null;
let geocoder = null;
let zoomLevel=15;
 
class AMapModule extends React.Component {
  constructor(props){
    super(props); 
    this.state = {
      status:0
    };   
  }
  componentWillMount(){
    if(!window.AMap&&!(window.google&&window.google.maps)){
      axios.get(googleMapSdk,{timeout: 1000}).then(res => {
            $script( [googleMapSdk],function(a,b){})
          }).catch(function (error) {
            $script( [gaodeMapSdk],function(a,b){})
      }); 
    }
  }

  componentDidMount(){
    let _this=this;
    function listenerStorage(){
      if(window.AMap||(window.google && window.google.maps)){
        if(window.AMap) {
          const {lat, lng, getMapAddress} = _this.props;
          const latlngxy=[(!lng||lng=='undefined'||lng=='0')?116.397428:lng,(!lat||lat=='undefined'||lat=='0')?39.90923:lat];//默认北京天安门
          map = new window.AMap.Map('allmap', {
              resizeEnable: true,
              center: latlngxy,
              zoom: zoomLevel
            });
            
          //高德设置语言    ['en', 'zh_en', 'zh_cn']
          let mapLang;
          if(window.localStorage.getItem('i18n') == 'en_US'){
            mapLang = 'en';
          }else{
            mapLang = 'zh_cn';
          }     
          map.setLang(mapLang);
    
          // 在新中心点添加 marker 
          marker = new window.AMap.Marker({
              map: map,
              position: latlngxy
          });
          map.on('click',function(e){
            marker.setPosition(e.lnglat);
            window.AMap.service('AMap.Geocoder',function(){//回调函数
              //实例化Geocoder
              geocoder = new window.AMap.Geocoder({});
              geocoder.getAddress(e.lnglat,function(status,result){
                if(status === 'complete' && result.info === 'OK'){
                  const address=result.regeocode.formattedAddress
                  getMapAddress&&getMapAddress(address);
                }
              })
            })
          })
        }
    
        if(window.google && window.google.maps){
    
          const {lat, lng, getMapAddress} = _this.props;
          const latlngxy=[(!lng||lng=='undefined'||lng=='0')?116.397428:lng,(!lat||lat=='undefined'||lat=='0')?39.90923:lat];//默认北京天安门
     
          var uluru = {lat: parseFloat(latlngxy[1]), lng: parseFloat(latlngxy[0])};  // google need number
    
          initMap()
          function initMap() {
            map = new window.google.maps.Map(document.getElementById('allmap'), {
                resizeEnable: true,
                center: uluru,
                zoom: zoomLevel
            });
            // 在新中心点添加 marker 
            marker = new window.google.maps.Marker({
                map: map,
                position: uluru
            });
          }
          map.addListener('click',function(e){
            let latlng=e.latLng;
            marker.setPosition(latlng);
            geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({'location': latlng}, function(results, status) {
              if (status === 'OK') {
                const address=results[0].formatted_address
                getMapAddress&&getMapAddress(address.substring(0,address.indexOf(' ')));
              } else {
                console.log('Geocoder failed due to: ' + status);
              }
            });
          })
        }
        _this.setState({
          status:1
        })
      }else{
        setTimeout(function(){
          listenerStorage()
        },800)
      }
    }
    listenerStorage();
  }
  componentWillReceiveProps=(nextProps)=>{
    const {getMapPoint}=this.props;
    if(window.AMap && nextProps.address&&nextProps.address!=this.props.address) {
      window.AMap.service('AMap.Geocoder',function(){//回调函数
          //实例化Geocoder
          geocoder = new window.AMap.Geocoder({});
          geocoder.getLocation(nextProps.address, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              let latlng = result.geocodes[0].location;
              getMapPoint&&getMapPoint(latlng);
              // 设置缩放级别和中心点
              let latlngxy = [latlng['lng'],latlng['lat']];
              const currentZoom=map.getZoom();
              map.setZoomAndCenter(currentZoom!=zoomLevel?currentZoom:zoomLevel, latlngxy);
              // 在新中心点添加 marker 
              marker.setPosition(latlng);
            } else {
              console.log('search "' + nextProps.address + '" no data')
            }
          });
      });
    }
    if(window.google && window.google.maps && nextProps.address&&nextProps.address!=this.props.address){
        geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({'address': nextProps.address}, function(results, status) {
          if (status === 'OK') {
            let latlng = results[0].geometry.location;
            getMapPoint&&getMapPoint({lat:latlng.lat(),lng:latlng.lng()});
            map.setCenter(latlng);
            // 在新中心点添加 marker 
            marker.setPosition(latlng);
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    }
   
    render(){
      const { height } = this.props;
      return(
        <div className={styles.container} style={{height:height?height:300}}>
          <Spin spinning={this.state.status==0?true:false} tip="Loading...">
            <div id="allmap" className={styles.mapContainer} style={{height:height?height:300}} />
          </Spin>
        </div>
      )
    }
  }
   
  AMapModule.propTypes = {
    lng: PropTypes.string,
    lat: PropTypes.string,
    className: PropTypes.string,
  }
   
  export default AMapModule  