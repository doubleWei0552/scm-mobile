import { } from '@/services/goods';
import { Toast } from 'antd-mobile';
import router from 'umi/router';
import _ from 'lodash';

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
                img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
                title: 'Meet hotel',
                des: '不是所有的兼职汪都需要风吹日晒',
            },
            {
                img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
                title: 'McDonald\'s invites you',
                des: '不是所有的兼职汪都需要风吹日晒',
            },
            {
                img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
                title: 'Eat the week',
                des: '不是所有的兼职汪都需要风吹日晒',
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
