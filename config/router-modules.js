const routes = [
  {
    path: '/content',
    name: '内容管理',
    icon: 'cluster',
    routes: [
      {
        path: '/category',
        name: '分类管理',
        icon: 'book',
        authority: 'category:manage',
        component: './category',
      },
      {
        path: '/article',
        name: '文章管理',
        component: './article',
        authority: 'article:manage',
        icon: 'read'
      },
    ]
  },
  {
    path: '/site',
    name: '站点管理',
    icon: 'cloud',
    component: './site',
    authority: 'site:manage'
  },
];

export default routes;
