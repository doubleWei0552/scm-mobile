import React from "react";
import {Map,Marker} from 'react-amap';

  export default class MapApp extends React.Component {
  constructor(){
    super();
    this.toolEvents = {
      created: (tool) => {
        this.tool = tool;
      }
    }
  }

  componentDidMount=()=>{
      this.mapPlugins = ['ToolBar'];
      // this.mapCenter = {longitude: this.props.longitude, latitude: this.props.latitude};
      this.markerPosition = {longitude: 113.735245, latitude: 34.773151};
  }

  render(){
    console.log('map',this.props)
        return  <Map 
          plugins={this.mapPlugins}
          // center={this.mapCenter}
          zoom={90}
        >
          <Marker position={this.markerPosition} />
        </Map>
  }
}
  