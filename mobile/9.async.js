(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{fV0L:function(e,t,n){"use strict";var a=n("tAuX"),o=n("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("UzV/");var l=o(n("vLen")),r=o(n("2Taf")),i=o(n("vZ4D")),d=o(n("l4Ni")),u=o(n("ujKo")),s=o(n("MhPg")),c=o(n("gWZ8")),f=a(n("q1tI")),h=o(n("LvDl")),v=o(n("wd/R")),p=o(n("i8i4"));var g={},m=[],E=[];function y(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n="Section ".concat(e),a=h.default.findIndex(m,function(e){return e===n});a>-1||(m.push(n),g[n]=n,E[e]=[],h.default.map(t,function(t,n){E[e].push(t.ID),g[t.ID]=t.ID}),m=(0,c.default)(m),E=(0,c.default)(E))}var D=function(e){function t(e){var n;(0,r.default)(this,t),n=(0,d.default)(this,(0,u.default)(t).call(this,e)),n.onEndReached=function(e){n.state.isLoading&&!n.state.hasMore||(console.log("reach end",e),n.setState({isLoading:!0}),setTimeout(function(){n.setState({isLoading:!1})},1e3))};var a=function(e,t){return e[t]},o=function(e,t,n){return e[n]},i=new l.default.DataSource({getRowData:o,getSectionHeaderData:a,rowHasChanged:function(e,t){return e!==t},sectionHeaderHasChanged:function(e,t){return e!==t}});return n.state={dataSource:i,isLoading:!0,height:3*document.documentElement.clientHeight/4},n}return(0,s.default)(t,e),(0,i.default)(t,[{key:"componentDidMount",value:function(){var e=this;console.log("\u4f20\u9012\u7684\u53c2\u6570",this.props);var t=this.props.list;console.log("sssss",t),y(0,t);var n=document.documentElement.clientHeight-p.default.findDOMNode(this.lv).parentNode.offsetTop;setTimeout(function(){e.setState({dataSource:e.state.dataSource.cloneWithRowsAndSections(g,m,E),isLoading:!1,height:n})},600)}},{key:"render",value:function(){var e=this;console.log("sectionIDs",m),console.log("rowIDs",E);var t=this.props.list,n=function(e,t){return f.default.createElement("div",{key:"".concat(e,"-").concat(t),style:{backgroundColor:"#F5F5F9",height:8,borderTop:"1px solid #ECECED",borderBottom:"1px solid #ECECED"}})},a=t.length-1,o=function(n,o,l){a<0&&(a=t.length-1);var r=t[a--];return f.default.createElement("div",{onClick:function(){return e.props.onJump(r)},key:l,style:{padding:0}},f.default.createElement("div",{style:{lineHeight:"50px",color:"#888",fontSize:14,borderBottom:"1px solid #F6F6F6",paddingLeft:10}},(0,v.default)(r.START_DATE).format("YYYY\u5e74MM\u6708DD\u65e5 hh:mm")," - ",(0,v.default)(r.END_DATE).format("YYYY\u5e74MM\u6708DD\u65e5 hh:mm")),f.default.createElement("div",{style:{padding:"15px 15px"}},f.default.createElement("h3",null,"\u62dc\u8bbf",r.CUSTOMER,r.CUSTOMER_CONTACT),f.default.createElement("div",null,r.ADDRESS?r.ADDRESS:"--")))};return f.default.createElement("div",{style:{width:"100%",position:"relative"}},f.default.createElement(l.default,{ref:function(t){return e.lv=t},dataSource:this.state.dataSource,renderFooter:function(){return f.default.createElement("div",{style:{padding:30,textAlign:"center"}},e.state.isLoading?"Loading...":"Loaded")},renderRow:o,renderSeparator:n,style:{height:this.state.height,overflow:"auto"},pageSize:5,onScroll:function(){console.log("scroll")},scrollRenderAheadDistance:500,onEndReached:this.onEndReached,onEndReachedThreshold:10}))}}]),t}(f.Component);t.default=D},lMjU:function(e,t,n){"use strict";var a=n("g09b"),o=n("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("XGli");var l=a(n("NHyu"));n("iOla");var r=a(n("yWu4"));n("1Cgs");var i=a(n("zvbH"));n("D2jH");var d,u,s,c=a(n("2ROE")),f=a(n("2Taf")),h=a(n("vZ4D")),v=a(n("l4Ni")),p=a(n("ujKo")),g=a(n("MhPg")),m=o(n("q1tI")),E=a(n("usdK")),y=n("MuoO"),D=a(n("fV0L")),S=(d=(0,y.connect)(function(e){var t=e.services,n=e.loading;return{services:t,loading:n.models.queryWorkTasks}}),d((s=function(e){function t(e){var n;return(0,f.default)(this,t),n=(0,v.default)(this,(0,p.default)(t).call(this,e)),n.queryWorkTasks=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=n.props.dispatch;t({type:"services/queryWorkTasks",payload:{queryvalue:e},callback:function(e){console.log("response",e),n.setState({data:e.data})}})},n.goBack=function(){window.history.back()},n.handleAddService=function(){E.default.push("/user/service/add")},n.onJump=function(e){E.default.push("/user/service/see/".concat(e.ID))},n.handleSearch=function(e){console.log("vvvv",e),n.queryWorkTasks(e)},n.state={data:[]},n}return(0,g.default)(t,e),(0,h.default)(t,[{key:"componentDidMount",value:function(){this.queryWorkTasks()}},{key:"render",value:function(){var e=this,t=this.state.data;return m.default.createElement("div",null,m.default.createElement("div",null,m.default.createElement(i.default,{mode:"dark",icon:m.default.createElement(c.default,{type:"left",size:"lg"}),onLeftClick:this.goBack,rightContent:[]},"\u4efb\u52a1\u5217\u8868")),m.default.createElement(r.default,{placeholder:"Search",maxLength:8,onChange:function(t){return e.handleSearch(t)}}),m.default.createElement("div",null,t.length>0&&m.default.createElement(D.default,{list:t,onJump:this.onJump})),m.default.createElement(l.default,{onClick:this.handleAddService,style:{position:"absolute",right:30,bottom:60,width:40,height:40,borderRadius:20,opacity:.9,boxShadow:"5px 5px 5px #888888"},type:"primary"},m.default.createElement(c.default,{style:{fontWeight:"bolder"},type:"plus",size:"sm"})))}}]),t}(m.Component),u=s))||u);t.default=S}}]);