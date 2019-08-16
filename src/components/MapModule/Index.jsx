import React from "react";
import {Map,Marker} from 'react-amap';

export default class MapApp extends React.Component {
  constructor() {
    super();
    this.toolEvents = {
      created: (tool) => {
        this.tool = tool;
      }
    }
    this.mapPlugins = ['ToolBar'];
  }

  render() {
    return <div style={{ width: '100%', height: '100%' }}>
      <Map zoom={90} plugins={this.mapPlugins}
        center={{longitude: this.props.longitude, latitude: this.props.latitude}}>
          <Marker position={{longitude: this.props.longitude, latitude: this.props.latitude}} />
      </Map>
    </div>
  }
}
  