import { Toast } from 'antd-mobile';
import router from 'umi/router';
import _ from 'lodash'

export default {
    namespace: 'shoppingCart',

    state: {
        SelectedData: [], //被选择的数据
        goodsLists: [], //所有的订单数据
        TotalAmount: 0,  //订单总金额
        TotalNumber: 0,  //订单总件数
        allSelect: false, //购物车全选按钮
    },

    effects: {
        *changeGoodsNumberOld({ payload, callback }, { call, select, put }) {
            let TotalAmount = 0
            let TotalNumber = 0
            let SelectedData = yield select(({ shoppingCart }) => shoppingCart.SelectedData)
            let goodsLists = yield select(({ shoppingCart }) => shoppingCart.goodsLists)
            let { value, obj } = payload
            goodsLists.map((item, index) => {
                if (obj.ID == item.ID) {
                    item.number = value
                }
            })
            SelectedData.map((item, index) => {
                if (obj.ID == item.ID) {
                    item.number = value
                }
            })
            SelectedData.map(item => {
                TotalAmount = TotalAmount + item.number * item.PRICE
                TotalNumber = TotalNumber + item.number * 1
            })
            yield put({ type: 'save', payload: { TotalAmount, TotalNumber } })
        },
        *changeGoodsNumber({ payload, callback }, { call, select, put }) {
            let TotalAmount = 0
            let TotalNumber = 0
            let goodsLists = yield select(({ shoppingCart }) => shoppingCart.goodsLists)
            let { value, obj } = payload
            goodsLists.map((item, index) => {
                if (obj.ID == item.ID) {
                    item.number = value
                }
            })
            goodsLists.map(item => {
                TotalAmount = TotalAmount + item.number * item.PRICE
                TotalNumber = TotalNumber + item.number * 1
            })
            yield put({ type: 'save', payload: { TotalAmount, TotalNumber, goodsLists } })
        },
        *removeGoods({ payload, callback }, { call, select, put }) {
            let { obj } = payload
            let goodsLists = yield select(({ shoppingCart }) => shoppingCart.goodsLists)
            var deep = _.cloneDeep(goodsLists)
            deep.map((item, index) => {
                if (obj.ID == item.ID) {
                    deep.splice(index, 1)
                }
            })
            console.log('model数据', obj, deep)
            yield put({ type: 'save', payload: { goodsLists: deep } })
        },
        *selectGoods({ payload }, { call, select, put }) {
            let { obj } = payload
            let TotalAmount = 0
            let TotalNumber = 0
            let allSelect = yield select(({ shoppingCart }) => shoppingCart.allSelect)
            let SelectedData = yield select(({ shoppingCart }) => shoppingCart.SelectedData)
            let goodsLists = yield select(({ shoppingCart }) => shoppingCart.goodsLists)
            if (allSelect) {
                allSelect = false
            }
            let exist = SelectedData.findIndex(item => {
                return item.ID == obj.ID
            })
            if (exist == -1) {
                SelectedData.push(obj)
            } else {
                SelectedData.splice(exist, 1)
            }
            SelectedData.map(item => {
                TotalAmount = TotalAmount + item.number * item.PRICE
                TotalNumber = TotalNumber + item.number * 1
            })
            if (SelectedData.length == goodsLists.length) {
                allSelect = true
            }
            yield put({ type: 'save', payload: { SelectedData, TotalAmount, TotalNumber, allSelect } })
        },
        *onAllSelectChange({ payload }, { call, select, put }) {
            let TotalAmount = 0
            let TotalNumber = 0
            let { isAllSelect } = payload
            let SelectedData = yield select(({ shoppingCart }) => shoppingCart.SelectedData)
            let goodsLists = yield select(({ shoppingCart }) => shoppingCart.goodsLists)
            let allSelect = yield select(({ shoppingCart }) => shoppingCart.allSelect)
            if (isAllSelect) {
                goodsLists.map(item => {
                    TotalAmount = TotalAmount + item.number * item.PRICE
                    TotalNumber = TotalNumber + item.number * 1
                })
                yield put({ type: 'save', payload: { allSelect: isAllSelect, SelectedData: _.cloneDeep(goodsLists), TotalAmount, TotalNumber } })
            } else {
                yield put({ type: 'save', payload: { allSelect: isAllSelect, SelectedData: [], TotalAmount: 0, TotalNumber: 0 } })
            }
        }
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload,
            };
        },
        saveCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload || {},
            };
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload.totalCount,
                    unreadCount: action.payload.unreadCount,
                },
            };
        },
    },
};
