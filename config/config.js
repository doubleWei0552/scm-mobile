// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

export default {
  history: 'hash', //打包时改变
  base: '/',
  publicPath: './', // 改变路径
  outputPath: './mobile',
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: {
    ie: 11,
  },

  /**
   * 路由相关配置
   */
  routes: [
    {
      path: '/',
      routes: [
        {
          path: '/',
          redirect: '/welcome'
        },
        // dashboard
        {
          path: '/welcome',
          component: './Login',
        },
        {
          path: '/homepage',
          // component: './TestPage',
          routes: [{
            path: '/homepage',
            redirect: '/homepage/goodList',
          },
          {
            path: '/homepage/:name',
            component: './TestPage',
          }]
        },
        {
          path: '/goodslist',
          component: './GoodsList',
        },
        {
          path: '/orderdetail/:orderId',
          component: './OrderDetail',
        },
        {
          path: '/wechatbind',
          component: './WechatBind',
        },
        {
          path: '/scan',
          component: './ScanPage',
        },
        {
          path: '/quagga',
          component: './QuaggaPage',
        },
        {
          path: '/saoyisao',
          component: './Saoyisao',
        },
        {
          path: '/customerselect',
          component: './CustomerSelect',
        },
      ],
    },
  ],
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
};
