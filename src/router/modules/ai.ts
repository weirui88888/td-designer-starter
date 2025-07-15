import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/ai',
    component: Layout,
    name: 'ai',
    meta: {
      title: {
        zh_CN: '大模型',
        en_US: 'ai',
      },
      icon: 'logo-adobe-illustrate-filled',
    },
    children: [
      {
        path: '',
        name: 'AiIndex',
        component: () => import('@/pages/ai/index.vue'),
        meta: {
          keepAlive: true,
          title: {
            zh_CN: '大模型对话',
            en_US: 'ai chat',
          },
        },
      },
    ],
  },
];
