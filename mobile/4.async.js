(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{HVxL:function(e,t,a){e.exports=a.p+"static/logoO.1703c5fa.png"},Qwtm:function(e,t,a){"use strict";var l=a("g09b"),o=a("tAuX");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("+L6B");var r=l(a("2/Rp"));a("sRBo");var u=l(a("kaz8"));a("5NDa");var n=l(a("5rEg"));a("Pwec");var i=l(a("CtXQ"));a("mw1O");var s=l(a("nJCp"));a("Telt");var c=l(a("Tckk"));a("RFiq");var d=l(a("ZyfH")),m=l(a("2Taf")),f=l(a("vZ4D")),g=l(a("l4Ni")),p=l(a("ujKo")),h=l(a("MhPg"));a("y8nQ");var v,w,y,I,E=l(a("Vl3Y")),P=o(a("q1tI")),S=a("MuoO"),L=(l(a("mOP9")),l(a("i8i4")),l(a("LvDl"))),N=(a("/TIM"),l(a("m0DI"))),b=(l(a("HVxL")),a("T+dw")),k=(l(a("usdK")),v=E.default.create(),w=(0,S.connect)(function(e){var t=e.user,a=e.loading;return{user:t,loading:a.effects["user/login"]}}),v(y=w((I=function(e){function t(e){var a;return(0,m.default)(this,t),a=(0,g.default)(this,(0,p.default)(t).call(this,e)),a.handleSubmit=function(e){var t=a.props.dispatch;e.preventDefault(),a.props.form.validateFields(function(e,a){if(!e){var l=a.remember,o=a.password,r=a.userName;l?(localStorage.setItem("mPassword",o),localStorage.setItem("mUserName",r)):(localStorage.setItem("mPassword",""),localStorage.setItem("mUserName","")),t({type:"user/login",payload:a})}})},a.state={},a}return(0,h.default)(t,e),(0,f.default)(t,[{key:"componentWillMount",value:function(){var e=this.props.dispatch;L.default.get(this.props.location.query,"code"),L.default.get(this.props.location.query,"state");e({type:"user/queryLogoParameter"})}},{key:"componentDidMount",value:function(){L.default.get(this.props.location.query,"code")}},{key:"render",value:function(){var e=this.props.loading,t=void 0!==e&&e,a=this.props.form.getFieldDecorator,l=localStorage.getItem("wechatLoginLogoImg")&&"undefined"!==localStorage.getItem("wechatLoginLogoImg")?JSON.parse(localStorage.getItem("wechatLoginLogoImg")):[];if(l[0]&&!l[0].url.includes("http:")){b.apiConfig.apiUrl;var o=window.location.origin.split(":"),m=o[0]+":"+o[1]||"",f=m,g=f.split(":");l[0].url="".concat(g[0],":").concat(g[1]).concat(l[0].url)}return P.default.createElement("div",{className:N.default.welcomePage},P.default.createElement(d.default,{toast:!0,text:"\u767b\u5f55\u4e2d...",animating:t}),P.default.createElement(s.default,{className:"logo"},P.default.createElement(c.default,{shape:"square",src:l.length>0?l[0].url:"",size:64,icon:"user"}),P.default.createElement("div",{className:"title"},localStorage.getItem("wechatLoginTitle")&&"undefined"!==localStorage.getItem("wechatLoginTitle")?localStorage.getItem("wechatLoginTitle"):"")),P.default.createElement(s.default,null,P.default.createElement(E.default,{onSubmit:this.handleSubmit,className:"login-form"},P.default.createElement(E.default.Item,null,a("userName",{initialValue:localStorage.getItem("mUserName"),rules:[{required:!0,message:"Please input your username!"}]})(P.default.createElement(n.default,{prefix:P.default.createElement(i.default,{type:"user",style:{color:"rgba(0,0,0,.25)"}}),placeholder:"\u8bf7\u8f93\u5165\u7528\u6237\u540d"}))),P.default.createElement(E.default.Item,null,a("password",{initialValue:localStorage.getItem("mPassword"),rules:[{required:!0,message:"Please input your Password!"}]})(P.default.createElement(n.default,{prefix:P.default.createElement(i.default,{type:"lock",style:{color:"rgba(0,0,0,.25)"}}),type:"password",placeholder:"\u8bf7\u8f93\u5165\u5bc6\u7801"}))),P.default.createElement(E.default.Item,null,a("remember",{valuePropName:"checked",initialValue:!0})(P.default.createElement(u.default,null,"\u8bb0\u4f4f\u5bc6\u7801")),P.default.createElement(r.default,{type:"primary",htmlType:"submit",className:"login-form-button"},"\u767b\u5f55")))))}}]),t}(P.Component),y=I))||y)||y),q=k;t.default=q},m0DI:function(e,t,a){e.exports={welcomePage:"welcomePage___nuIPf"}}}]);