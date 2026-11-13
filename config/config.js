import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import routers, { flatRoutes } from './routers';

const { primaryColor } = defaultSettings;

export default defineConfig({
  antd: {
    theme: {
      token: {
        colorPrimary: primaryColor,
      },
    },
  },
  dva: {
    hmr: true,
  },
  locale: false,
  access: false,
  initialState: false,
  request: false,
  layout: false,
  routes: [
    {
      path: '/login',
      component: '../common/layouts/LoginLayout',
      routes: [
        {
          name: '登录',
          path: '/login',
          component: '../common/pages/login',
        },
      ],
    },
    {
      path: '/',
      component: '../common/layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../common/layouts/BasicLayout',
          routes: routers,
        },
      ],
    },
  ],
  define: {
    COPRY_RIGHT: defaultSettings.copyRight,
    TITLE: defaultSettings.title,
    TITLE_DESC: defaultSettings.titleDesc,
    FLAT_ROUTES: flatRoutes,
    MOCK: process.env.MOCK === 'true',
  },
  history: {
    type: 'browser',
  },
  hash: true,
  mfsu: false,
  npmClient: 'npm',
  title: defaultSettings.title,
  favicons: ['/favicon.png'],
});
