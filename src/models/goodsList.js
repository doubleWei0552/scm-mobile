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
                label: '京东物流',
                value: 0,
                children: []
            }, {
                label: '品牌',
                value: 1,
                children: [
                    {
                        label: '前减',
                        value: 11
                    }, {
                        label: '后减',
                        value: 12
                    }, {
                        label: '全套',
                        value: 13
                    }
                ]
            }, {
                label: '安装方位',
                value: 2,
                children: [
                    {
                        label: 'test1',
                        value: 21
                    }, {
                        label: 'test2',
                        value: 22
                    }
                ]
            }, {
                label: '减震种类',
                value: 3,
                children: [
                    {
                        label: '钢铁直男',
                        value: 31
                    }
                ]
            }
        ],
        goodsData: [
            {
                img: null,
                GOODS_NAME: '测试数据',
                des: '不是所有的兼职汪都需要风吹日晒',
                ID:0,
                PRICE:666,
                number:0,
            },
            {
                img: null,
                GOODS_NAME: '测试数据2',
                des: '所有的兼职汪都需要风吹日晒',
                ID:1,
                PRICE:888,
                number:0,
            },
            {
                img: null,
                GOODS_NAME: '测试数据3',
                des: '都需要风吹日晒',
                ID:2,
                PRICE:999,
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
