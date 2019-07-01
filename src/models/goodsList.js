import { } from '@/services/goods';
import { Toast } from 'antd-mobile';
import router from 'umi/router';
import _ from 'lodash';

//新版的商品列表页
export default {
    namespace: 'goodsList',

    state: {
        searchData: [
            {
                label: '品牌车型',
                value: 1,
                children: [
                    {
                        label: '比亚迪',
                        value: 11
                    }, {
                        label: '吉利',
                        value: 12
                    }, {
                        label: '长城',
                        value: 13
                    }
                ]
            }, {
                label: '安装方位',
                value: 2,
                children: [
                    {
                        label: '前减',
                        value: 21
                    }, {
                        label: '后减',
                        value: 22
                    }, {
                        label: '全套',
                        value: 23
                    }
                ]
            }
        ],
        goodsData: [
            {
                img: null,
                GOODS_NAME: '吉利博锐',
                des: '最美B级车',
                ID:0,
                PRICE:170000,
                number:0,
            },
            {
                img: null,
                GOODS_NAME: '领克02',
                des: '紧凑型suv',
                ID:1,
                PRICE:150000,
                number:0,
            },
            {
                img: null,
                GOODS_NAME: '宝马3系',
                des: '德系车',
                ID:2,
                PRICE:300000,
                number:0,
            },
        ]
    },

    effects: {
        // 获取分类列表
        *getTypeList({ payload, callback }, { call, put }) {
            const result = yield call(getTypeList, payload);
            if (result.status === 'success') {
            yield put({
                type: 'save',
                payload: { menuData: result.data },
            });
            callback && callback(result)
            } else {
            Toast.fail(result.message, 1);
            console.log('result', result)
            }
        },
    
        // 获取商品列表
        *getGoodsList({ payload, callback }, { call, put, select }) {
            const result = yield call(getGoodsList, payload);
            const oldList = yield select(({ goodsList }) => goodsList.list);
    
            if (result.status === 'success') {
            yield put({
                type: 'save',
                payload: { list: _.concat(oldList, result.data.list), currentPage: result.data.currentPage },
            });
            } else {
            Toast.fail(result.message, 1);
            }
            callback && callback(result)
        },
    
        // 获取商品列表
        *confirmOrder({ payload, callback }, { call, put }) {
            const result = yield call(confirmOrder, payload);
            if (result.status === 'success') {
                Toast.success('下单成功 !!!', 1);
                setTimeout(() => {
                    callback && callback(result)
                }, 900);
                } else {
                Toast.fail(result.message, 1);
            }
        },
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
