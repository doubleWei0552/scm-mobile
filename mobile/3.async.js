(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{HVxL:function(e,t,a){e.exports=a.p+"static/logoO.1703c5fa.png"},Qwtm:function(e,t,a){"use strict";var l=a("mZ4U"),o=a("fbTi");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("DpyA");var r=l(a("3dmf"));a("CTW5");var u=l(a("As5V"));a("Bler");var n=l(a("CS+4"));a("twMU");var s=l(a("T310"));a("rR2d");var c=l(a("tAas"));a("R1C7");var i=l(a("O4A6"));a("PZXF");var d=l(a("GI1m")),m=l(a("43Yg")),f=l(a("/tCh")),g=l(a("scpF")),p=l(a("O/V9")),h=l(a("8aBX"));a("xKti");var v,w,I,y,S=l(a("PXOp")),E=o(a("uqIC")),L=a("LneV"),P=(l(a("5Tjw")),l(a("jCnN")),l(a("wfkH"))),b=(a("sF2l"),l(a("m0DI"))),N=(l(a("HVxL")),l(a("XIKz")),v=S.default.create(),w=(0,L.connect)(function(e){var t=e.user,a=e.loading;return{user:t,loading:a.effects["user/login"]}}),v(I=w((y=function(e){function t(e){var a;return(0,m.default)(this,t),a=(0,g.default)(this,(0,p.default)(t).call(this,e)),a.handleSubmit=function(e){var t=a.props.dispatch;e.preventDefault(),a.props.form.validateFields(function(e,a){if(console.log("999",a),!e){console.log("Received values of form: ",a);var l=a.remember,o=a.password,r=a.userName;l?(localStorage.setItem("mPassword",o),localStorage.setItem("mUserName",r)):(localStorage.setItem("mPassword",""),localStorage.setItem("mUserName","")),t({type:"user/login",payload:a})}})},a.state={},a}return(0,h.default)(t,e),(0,f.default)(t,[{key:"componentWillMount",value:function(){var e=this.props.dispatch;P.default.get(this.props.location.query,"code"),P.default.get(this.props.location.query,"state");e({type:"user/queryLogoParameter"})}},{key:"componentDidMount",value:function(){console.log("props",this.props.location);var e=P.default.get(this.props.location.query,"code");console.log("code2",e)}},{key:"render",value:function(){var e=this.props.loading,t=void 0!==e&&e,a=this.props.form.getFieldDecorator;console.log("sssss22",localStorage.getItem("wechatLoginLogoImg"));var l=localStorage.getItem("wechatLoginLogoImg")&&"undefined"!==localStorage.getItem("wechatLoginLogoImg")?JSON.parse(localStorage.getItem("wechatLoginLogoImg")):[];return E.default.createElement("div",{className:b.default.welcomePage},E.default.createElement(d.default,{toast:!0,text:"\u767b\u5f55\u4e2d...",animating:t}),E.default.createElement(c.default,{className:"logo"},E.default.createElement(i.default,{shape:"square",src:l.length>0?l[0].url:"",size:64,icon:"user"}),E.default.createElement("div",{className:"title"},localStorage.getItem("wechatLoginTitle")&&"undefined"!==localStorage.getItem("wechatLoginTitle")?localStorage.getItem("wechatLoginTitle"):"")),E.default.createElement(c.default,null,E.default.createElement(S.default,{onSubmit:this.handleSubmit,className:"login-form"},E.default.createElement(S.default.Item,null,a("userName",{initialValue:localStorage.getItem("mUserName"),rules:[{required:!0,message:"Please input your username!"}]})(E.default.createElement(n.default,{prefix:E.default.createElement(s.default,{type:"user",style:{color:"rgba(0,0,0,.25)"}}),placeholder:"\u8bf7\u8f93\u5165\u7528\u6237\u540d"}))),E.default.createElement(S.default.Item,null,a("password",{initialValue:localStorage.getItem("mPassword"),rules:[{required:!0,message:"Please input your Password!"}]})(E.default.createElement(n.default,{prefix:E.default.createElement(s.default,{type:"lock",style:{color:"rgba(0,0,0,.25)"}}),type:"password",placeholder:"\u8bf7\u8f93\u5165\u5bc6\u7801"}))),E.default.createElement(S.default.Item,null,a("remember",{valuePropName:"checked",initialValue:!0})(E.default.createElement(u.default,null,"\u8bb0\u4f4f\u5bc6\u7801")),E.default.createElement(r.default,{type:"primary",htmlType:"submit",className:"login-form-button"},"\u767b\u5f55")))))}}]),t}(E.Component),I=y))||I)||I),k=N;t.default=k},m0DI:function(e,t,a){e.exports={welcomePage:"welcomePage___nuIPf"}}}]);