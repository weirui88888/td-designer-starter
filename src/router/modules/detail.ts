import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/detail',
    name: 'detail',
    component: Layout,
    redirect: '/detail/base',
    meta: {
      title: {
        zh_CN: '详情页',
        en_US: 'Detail',
      },
      icon: 'layers',
    },
    children: [
      {
        path: 'base',
        name: 'DetailBase',
        component: () => import('@/pages/detail/base/index.vue'),
        meta: {
          title: {
            zh_CN: '基础详情页',
            en_US: 'Base Detail',
          },
        },
      },
      {
        path: 'advanced',
        name: 'DetailAdvanced',
        component: () => import('@/pages/detail/advanced/index.vue'),
        meta: {
          title: {
            zh_CN: '多卡片详情页',
            en_US: 'Card Detail',
          },
        },
      },
      {
        path: 'deploy',
        name: 'DetailDeploy',
        component: () => import('@/pages/detail/deploy/index.vue'),
        meta: {
          title: {
            zh_CN: '数据详情页',
            en_US: 'Data Detail',
          },
        },
      },
      {
        path: 'secondary',
        name: 'DetailSecondary',
        component: () => import('@/pages/detail/secondary/index.vue'),
        meta: {
          title: {
            zh_CN: '二级详情页',
            en_US: 'Secondary Detail',
          },
        },
      },
    ],
  },
];
