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
