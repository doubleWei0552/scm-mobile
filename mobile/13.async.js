(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[13], { "8d3Q": function (e, t, a) { "use strict"; var l = a("g09b"); Object.defineProperty(t, "__esModule", { value: !0 }), t.default = void 0; var n = l(a("2Taf")), d = l(a("vZ4D")), u = l(a("l4Ni")), o = l(a("ujKo")), r = l(a("MhPg")), i = l(a("q1tI")), s = a("7DBZ"), f = function (e) { function t() { var e; return (0, n.default)(this, t), e = (0, u.default)(this, (0, o.default)(t).call(this)), e.componentDidMount = function () { e.mapPlugins = ["ToolBar"], e.markerPosition = { longitude: e.props.longitude, latitude: e.props.latitude } }, e.toolEvents = { created: function (t) { e.tool = t } }, e } return (0, r.default)(t, e), (0, d.default)(t, [{ key: "render", value: function () { return i.default.createElement(s.Map, { plugins: this.mapPlugins, zoom: 90 }, i.default.createElement(s.Marker, { position: this.markerPosition })) } }]), t }(i.default.Component); t.default = f }, Mp4L: function (e, t, a) { "use strict"; var l = a("g09b"); Object.defineProperty(t, "__esModule", { value: !0 }), t.default = void 0, a("XGli"); var n = l(a("NHyu")); a("e3Tq"); var d = l(a("n+tp")); a("XCdk"); var u = l(a("b+ud")), o = l(a("jehZ")); a("1Cgs"); var r = l(a("zvbH")); a("D2jH"); var i, s, f, p = l(a("2ROE")), c = l(a("2Taf")), m = l(a("vZ4D")), g = l(a("l4Ni")), k = l(a("ujKo")), v = l(a("MhPg")), h = l(a("q1tI")), E = a("47e7"), y = l(a("usdK")), T = a("MuoO"), M = l(a("wd/R")), D = l(a("8d3Q")), I = (i = (0, T.connect)(function (e) { var t = e.task; return { task: t } }), i((f = function (e) { function t(e) { var a; return (0, c.default)(this, t), a = (0, g.default)(this, (0, k.default)(t).call(this, e)), a.componentDidMount = function () { a.getTaskData() }, a.getTaskData = function () { var e = a.props, t = e.dispatch, l = e.match, n = _.get(l, "params.orderId"); t({ type: "task/getTaskDetails", payload: { Id: n } }), a.setState({ taskId: n }) }, a.updataWorkTasks = function () { a.props.form.validateFields(function (e, t) { e || a.props.dispatch({ type: "task/updataWorkTasks", payload: { EXPLAIN: t.EXPLAIN, Id: a.state.taskId, REGISTRATION_DATE: (0, M.default)().valueOf() } }) }) }, a.state = { taskId: null }, a } return (0, v.default)(t, e), (0, m.default)(t, [{ key: "render", value: function () { var e = this.props.form.getFieldProps, t = this.props.task, a = t.taskDetail, l = t.CUSTOMER, i = t.CUSTOMERCONTACT, s = { longitude: 1 * _.get(a, "longitude"), latitude: 1 * _.get(a, "latitude") }; return h.default.createElement("div", null, h.default.createElement(r.default, { mode: "dark", icon: h.default.createElement(p.default, { type: "left" }), onLeftClick: function () { return y.default.goBack() } }, "\u4efb\u52a1\u7b7e\u5230"), h.default.createElement("div", { style: { padding: "1rem" } }, h.default.createElement("h2", null, "\u62dc\u8bbf", _.get(l, "name")), h.default.createElement("p", { style: { marginBottom: "5px" } }, (0, M.default)().format("YYYY\u5e74MM\u6708DD HH:mm")), h.default.createElement("p", { style: { marginBottom: "5px" } }, _.get(l, "name")), h.default.createElement("p", { style: { marginBottom: "5px" } }, _.get(i, "contact"), "(", _.get(i, "mobilePhone"), ")"), h.default.createElement("div", { style: { width: "100%", height: "180px" } }, h.default.createElement(D.default, s)), h.default.createElement("p", { style: { margin: "5px 0" } }, _.get(a, "address")), h.default.createElement(d.default, null, h.default.createElement(u.default, (0, o.default)({}, e("EXPLAIN"), { rows: 4, placeholder: "\u63cf\u8ff0" })))), h.default.createElement("div", { style: { padding: "1rem", position: "fixed", bottom: 0, width: "100%", height: "80px" } }, h.default.createElement(n.default, { onClick: this.updataWorkTasks, type: "primary" }, "\u7b7e\u5230"))) } }]), t }(h.default.Component), s = f)) || s), P = (0, E.createForm)()(I), b = P; t.default = b } }]);
